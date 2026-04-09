"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
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

const aiKnowledge: Array<{ keywords: string[]; answer: string }> = [
	{
		keywords: ['career', 'choose', 'best for me', 'domain'],
		answer:
			'Based on your goals, start by matching your strengths with a domain. If you enjoy building products end-to-end, Full Stack Development is a strong option. If you prefer analytics and prediction, Data Science or Machine Learning can be better.'
	},
	{
		keywords: ['resume', 'cv'],
		answer:
			'To improve your resume, focus on measurable impact. Use bullet points with numbers, add 3 to 5 relevant projects, highlight job-specific skills, and keep formatting clean and one-page for early career roles.'
	},
	{
		keywords: ['ai job', 'ai skills', 'artificial intelligence'],
		answer:
			'For AI jobs, prioritize Python, data structures, linear algebra, statistics, and deep learning fundamentals. Build practical projects in NLP or computer vision to demonstrate applied skills.'
	},
	{
		keywords: ['interview', 'prepare'],
		answer:
			'Interview preparation works best with a weekly plan: core concepts revision, daily coding practice, mock interviews, and role-specific question sets. Record your answers to improve clarity and confidence.'
	},
	{
		keywords: ['salary', 'package'],
		answer:
			'Salary depends on role, location, and project depth. Build a portfolio with strong outcomes and in-demand tools, then compare ranges across domains before deciding your next learning path.'
	},
];

function formatTime(date: Date): string {
	return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function generateAIResponse(question: string): string {
	const normalized = question.toLowerCase();
	const match = aiKnowledge.find((entry) => entry.keywords.some((word) => normalized.includes(word)));

	if (match) {
		return match.answer;
	}

	return 'I can help with career paths, resume improvement, AI skills, and interview preparation. Ask a more specific question and I will give a focused recommendation.';
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

		window.setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					id: nextId.current++,
					sender: 'ai',
					text: generateAIResponse(value),
					timestamp: formatTime(new Date()),
				},
			]);
			setIsTyping(false);
		}, 900);
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
