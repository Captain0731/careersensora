"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { apiClient, ApiError } from '../../utils/apiClient';
import './faqchating.scss';

type Sender = 'user' | 'ai';

type ChatMessage = {
	id: number;
	sender: Sender;
	text: string;
	timestamp: string;
};

const suggestedQuestions = [
	'Which career should I choose?',
	'How to improve my resume?',
	'Best skills for AI jobs?',
];


function formatTime(date: Date): string {
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function FaqChating() {
	const [query, setQuery] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: 1,
			sender: 'ai',
			text: 'Welcome to the FAQ Assistant. Ask anything about careers, resumes, or skills, and I will answer instantly.',
			timestamp: formatTime(new Date()),
		},
	]);

	const nextId = useRef(2);
	const scrollRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!scrollRef.current) return;
		scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, [messages, isTyping]);

	const canAsk = useMemo(() => query.trim().length > 0 && !isTyping, [query, isTyping]);

	const sendQuestion = (questionText?: string) => {
		const value = (questionText ?? query).trim();
		if (!value || isTyping) return;

		setMessages((prev) => [
			...prev,
			{
				id: nextId.current++,
				sender: 'user',
				text: value,
				timestamp: formatTime(new Date()),
			},
		]);

		setQuery('');
		setIsTyping(true);

		(async () => {
			try {
				const response = await apiClient.post<{ reply: string }>('/faq-chat', { message: value }, { skipAuth: true });
				setMessages((prev) => [
					...prev,
					{
						id: nextId.current++,
						sender: 'ai',
						text: response.reply,
						timestamp: formatTime(new Date()),
					},
				]);
			} catch (err) {
				const msg = err instanceof ApiError ? err.message : 'Could not reach AI assistant.';
				setMessages((prev) => [
					...prev,
					{
						id: nextId.current++,
						sender: 'ai',
						text: msg,
						timestamp: formatTime(new Date()),
					},
				]);
			} finally {
				setIsTyping(false);
			}
		})();
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		sendQuestion();
	};

	return (
		<section className="faqAssistant">
			<div className="faqShell">
				<header className="faqHeader">
					<h1>Ask Anything (FAQ Assistant)</h1>
					<p>Get instant answers to your questions powered by AI.</p>
				</header>

				<div className="suggestions" aria-label="Suggested questions">
					{suggestedQuestions.map((question) => (
						<button key={question} type="button" className="suggestionBtn" onClick={() => sendQuestion(question)}>
							{question}
						</button>
					))}
				</div>

				<div className="chatWindow" ref={scrollRef}>
					{messages.map((message) => (
						<div key={message.id} className={`messageRow ${message.sender === 'user' ? 'isUser' : 'isAI'}`}>
							<div className="messageBubble">
								{message.sender === 'ai' && <span className="aiBadge">AI Answer</span>}
								<p>{message.text}</p>
								<small>{message.timestamp}</small>
							</div>
						</div>
					))}

					{isTyping && (
						<div className="messageRow isAI">
							<div className="messageBubble typingBubble">
								<span className="aiBadge">AI Answer</span>
								<div className="typingDots" aria-label="AI is thinking">
									<span></span>
									<span></span>
									<span></span>
								</div>
							</div>
						</div>
					)}
				</div>

				<form className="inputBar" onSubmit={handleSubmit}>
					<input
						type="text"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Type your question..."
						aria-label="Type your question"
					/>
					<button type="submit" disabled={!canAsk}>
						Ask AI
					</button>
				</form>
			</div>
		</section>
	);
}
