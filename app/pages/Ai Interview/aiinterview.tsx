"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { apiClient, ApiError } from '../../utils/apiClient';
import './aiinterview.scss';

type QuestionRow = {
	id: number;
	prompt: string;
};

type ModeId = 'text' | 'voice' | 'video';
type DifficultyId = 'easy' | 'medium' | 'hard';

type Mode = {
	id: ModeId;
	label: string;
	description: string;
};

type Difficulty = {
	id: DifficultyId;
	label: string;
	color: string;
	description: string;
};

type MetricCard = {
	label: string;
	value: string;
	description: string;
};

const modes: Mode[] = [
	{ id: 'text', label: 'Text Mode', description: 'Chat-based interview experience' },
	{ id: 'voice', label: 'Voice Mode', description: 'Voice-based interaction with AI' },
	{ id: 'video', label: 'Video Mode', description: 'Real-time interview simulation with camera' },
];

const renderModeIcon = (mode: ModeId) => {
	if (mode === 'text') {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M7 8.5h10M7 12h7M6.5 18.5l3.3-2H18a2.5 2.5 0 0 0 2.5-2.5V7.5A2.5 2.5 0 0 0 18 5H6A2.5 2.5 0 0 0 3.5 7.5V14A2.5 2.5 0 0 0 6 16.5h.5v2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		);
	}

	if (mode === 'voice') {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M4.5 13.5V12a7.5 7.5 0 0 1 15 0v1.5M7 13v3a2 2 0 0 1-2 2h-.5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2H7m10 0h2.5a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H19a2 2 0 0 1-2-2v-3ZM12 18v1a2 2 0 0 1-2 2h-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h7.5A2.5 2.5 0 0 1 16 8.5v7A2.5 2.5 0 0 1 13.5 18H6a2.5 2.5 0 0 1-2.5-2.5v-7Zm12.5 2.2 4-2.6v7.8l-4-2.6v-2.6Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

const difficulties: Difficulty[] = [
	{ id: 'easy', label: 'Easy', color: 'green', description: 'Basic questions for beginners' },
	{ id: 'medium', label: 'Medium', color: 'yellow', description: 'Moderate-level real interview questions' },
	{ id: 'hard', label: 'Hard', color: 'red', description: 'Advanced, industry-level questions' },
];

const domains = [
	'Full Stack Development',
	'Data Science',
	'Machine Learning',
	'Artificial Intelligence',
	'Web Development',
	'Mobile Development',
	'UI/UX Design',
];

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const buildLiveMetrics = (mode: ModeId, scoreValue: number): MetricCard[] => {
	const baseFluency = Math.min(100, Math.max(55, scoreValue + 8));
	const baseAccuracy = Math.min(100, Math.max(50, scoreValue - 2));
	const baseConfidence = Math.min(100, Math.max(48, scoreValue + 4));

	if (mode === 'text') {
		return [
			{ label: 'Fluency', value: `${baseFluency}%`, description: 'Clarity and flow of written responses' },
			{ label: 'Accuracy', value: `${baseAccuracy}%`, description: 'Correctness of technical answers' },
			{ label: 'Missing Info', value: scoreValue >= 70 ? 'Low' : scoreValue >= 50 ? 'Medium ⚠️' : 'High ⚠️', description: 'Important points not covered' },
			{ label: 'Confidence', value: scoreValue >= 70 ? 'High 🟢' : scoreValue >= 50 ? 'Medium 🟡' : 'Low 🔴', description: 'Assertiveness and clarity in answers' },
		];
	}

	if (mode === 'voice') {
		return [
			{ label: 'Fluency', value: `${baseFluency - 3}%`, description: 'Natural flow of spoken responses' },
			{ label: 'Accuracy', value: `${baseAccuracy}%`, description: 'Correctness of technical answers' },
			{ label: 'Missing Info', value: scoreValue >= 70 ? 'Low' : scoreValue >= 50 ? 'Medium ⚠️' : 'High ⚠️', description: 'Important points not covered' },
			{ label: 'Confidence', value: scoreValue >= 70 ? 'High 🟢' : scoreValue >= 50 ? 'Medium 🟡' : 'Low 🔴', description: 'Assertiveness and clarity in answers' },
			{ label: 'Tone', value: scoreValue >= 70 ? 'Professional ✅' : scoreValue >= 50 ? 'Professional / Casual' : 'Unclear ⚠️', description: 'Professional, casual, or unclear delivery' },
			{ label: 'Nervousness', value: scoreValue >= 70 ? 'Low' : scoreValue >= 50 ? 'Slight ⚠️' : 'Moderate ⚠️', description: 'Based on pauses and voice breaks' },
		];
	}

	return [
		{ label: 'Fluency', value: `${baseFluency - 1}%`, description: 'Smoothness of spoken and visual communication' },
		{ label: 'Accuracy', value: `${baseAccuracy}%`, description: 'Correctness of technical answers' },
		{ label: 'Missing Info', value: scoreValue >= 70 ? 'Low' : scoreValue >= 50 ? 'Medium ⚠️' : 'High ⚠️', description: 'Important points not covered' },
		{ label: 'Confidence', value: scoreValue >= 70 ? 'High 🟢' : scoreValue >= 50 ? 'Medium 🟡' : 'Low 🔴', description: 'Assertiveness and clarity in answers' },
		{ label: 'Tone', value: scoreValue >= 70 ? 'Good ✅' : scoreValue >= 50 ? 'Professional / Casual' : 'Unclear ⚠️', description: 'Overall presence and delivery tone' },
		{ label: 'Nervousness', value: scoreValue >= 70 ? 'Low' : scoreValue >= 50 ? 'Moderate ⚠️' : 'High ⚠️', description: 'Based on pauses and voice breaks' },
		{ label: 'Stress Level', value: scoreValue >= 70 ? 'Low 🟢' : scoreValue >= 50 ? 'Medium 🟡' : 'High 🔴', description: 'Facial + voice indicators' },
		{ label: 'Facial Reaction', value: scoreValue >= 70 ? 'Good' : scoreValue >= 50 ? 'Needs Attention' : 'Needs Improvement', description: 'Eye contact and expressions' },
	];
};

export default function AIInterview() {
	const [selectedMode, setSelectedMode] = useState<ModeId>('voice');
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('medium');
	const [selectedDomain, setSelectedDomain] = useState(domains[0]);
	const [stage, setStage] = useState<'setup' | 'interview' | 'results'>('setup');
	const [questionIndex, setQuestionIndex] = useState(0);
	const [answer, setAnswer] = useState('');
	const [answers, setAnswers] = useState<string[]>([]);
	const [questions, setQuestions] = useState<QuestionRow[]>([]);
	const [score, setScore] = useState(0);
	const [sessionId, setSessionId] = useState<number | null>(null);
	const [resultsData, setResultsData] = useState<any>(null);
	const [isRecording, setIsRecording] = useState(false);
	const [recordingSeconds, setRecordingSeconds] = useState(0);
	const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
	const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
	const [audioError, setAudioError] = useState<string | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const liveVideoRef = useRef<HTMLVideoElement | null>(null);
	const liveStreamRef = useRef<MediaStream | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const timerRef = useRef<number | null>(null);

	const modeMeta = useMemo(() => modes.find((mode) => mode.id === selectedMode) ?? modes[0], [selectedMode]);
	const difficultyMeta = useMemo(() => difficulties.find((difficulty) => difficulty.id === selectedDifficulty) ?? difficulties[1], [selectedDifficulty]);
	const currentQuestion = questions[questionIndex];

	const stopTimer = () => {
		if (timerRef.current !== null) {
			window.clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const stopStream = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
	};

	const clearMediaPreviews = () => {
		if (audioPreviewUrl) {
			URL.revokeObjectURL(audioPreviewUrl);
			setAudioPreviewUrl(null);
		}
		if (videoPreviewUrl) {
			URL.revokeObjectURL(videoPreviewUrl);
			setVideoPreviewUrl(null);
		}
	};

	const stopLiveStream = () => {
		if (liveStreamRef.current) {
			liveStreamRef.current.getTracks().forEach((track) => track.stop());
			liveStreamRef.current = null;
		}

		if (liveVideoRef.current) {
			liveVideoRef.current.srcObject = null;
		}
	};

	useEffect(() => {
		if (stage !== 'interview' || selectedMode !== 'video') {
			stopLiveStream();
		}
	}, [selectedMode, stage]);

	const startRecording = async () => {
		if ((selectedMode !== 'voice' && selectedMode !== 'video') || isRecording) {
			return;
		}

		if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
			setAudioError('Voice recording is not supported in this browser.');
			return;
		}

		setAudioError(null);
		clearMediaPreviews();
		setAnswer('');
		setRecordingSeconds(0);

		try {
			const stream = selectedMode === 'video'
				? liveStreamRef.current ?? await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
				: await navigator.mediaDevices.getUserMedia({ audio: true });

			if (selectedMode === 'video' && !liveStreamRef.current) {
				liveStreamRef.current = stream;
				if (liveVideoRef.current) {
					liveVideoRef.current.srcObject = stream;
				}
			}

			streamRef.current = stream;

			const recorder = new MediaRecorder(stream);
			mediaRecorderRef.current = recorder;
			audioChunksRef.current = [];

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			recorder.onstop = () => {
				stopTimer();
				setIsRecording(false);

				if (!audioChunksRef.current.length) {
					setAudioError('No audio was captured. Please record again.');
					return;
				}

				const blobType = audioChunksRef.current[0]?.type || (selectedMode === 'video' ? 'video/webm' : 'audio/webm');
				const blob = new Blob(audioChunksRef.current, { type: blobType });
				const nextUrl = URL.createObjectURL(blob);
				if (selectedMode === 'video') {
					setAnswer(`Video response recorded (${Math.max(recordingSeconds, 1)}s).`);
					return;
				}
				stopStream();
				setAudioPreviewUrl(nextUrl);
				setAnswer(`Audio response recorded (${Math.max(recordingSeconds, 1)}s).`);
			};

			recorder.start();
			setIsRecording(true);
			timerRef.current = window.setInterval(() => {
				setRecordingSeconds((value) => value + 1);
			}, 1000);
		} catch {
			setAudioError(selectedMode === 'video' ? 'Unable to access camera or microphone. Please allow permissions and try again.' : 'Unable to access microphone. Please allow microphone permission and try again.');
			stopStream();
		}
	};

	const stopRecording = () => {
		if (!isRecording) {
			return;
		}

		const recorder = mediaRecorderRef.current;
		if (recorder && recorder.state !== 'inactive') {
			recorder.stop();
			return;
		}

		stopTimer();
		setIsRecording(false);
		if (selectedMode !== 'video') {
			stopStream();
		}
	};

	useEffect(() => {
		return () => {
			stopTimer();
			stopStream();
			stopLiveStream();
			if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
				mediaRecorderRef.current.stop();
			}
			if (audioPreviewUrl) {
				URL.revokeObjectURL(audioPreviewUrl);
			}
			if (videoPreviewUrl) {
				URL.revokeObjectURL(videoPreviewUrl);
			}
		};
	}, [audioPreviewUrl, videoPreviewUrl]);

	const startInterview = async () => {
		stopTimer();
		stopStream();
		setIsRecording(false);
		setRecordingSeconds(0);
		setAudioError(null);
		clearMediaPreviews();
		stopLiveStream();

		try {
			const res = await apiClient.post<{
				id: number;
				questions: Array<{ id: number; question_text: string; order: number }>;
			}>('/interviews/start', {
				domain: selectedDomain,
				difficulty: selectedDifficulty,
				mode: selectedMode,
			}, { skipAuth: true });
			setSessionId(res.id);
			setQuestions(
				res.questions.map((q) => ({
					id: q.id,
					prompt: q.question_text,
				}))
			);
			setAnswers([]);
			setQuestionIndex(0);
			setAnswer('');
			setScore(0);
			setStage('interview');
		} catch (err) {
			const msg =
				err instanceof ApiError
					? err.message
					: 'Could not start the interview. Ensure the API server is running.';
			setAudioError(msg);
		}
	};

	const submitAnswer = async () => {
		if (!currentQuestion || !sessionId) {
			return;
		}

		if ((selectedMode === 'voice' || selectedMode === 'video') && !answer.trim()) {
			setAudioError(selectedMode === 'video' ? 'Please record your video response before submitting.' : 'Please record your voice response before submitting.');
			return;
		}

		const responseText = answer.trim() || 'No response provided';

		if (isRecording) {
			stopRecording();
		}

		try {
			const res = await apiClient.post<{ score: number }>(`/interviews/${sessionId}/answer`, {
				question_id: currentQuestion.id,
				answer_text: responseText,
			}, { skipAuth: true });
			const nextAnswers = [...answers, responseText];
			const nextTotal = score + res.score;

			setAnswers(nextAnswers);
			setScore(nextTotal);
			setAnswer('');
			setRecordingSeconds(0);
			setAudioError(null);
			clearMediaPreviews();

			if (questionIndex >= questions.length - 1) {
				const resultsRes = await apiClient.get<{
					strengths: string[];
					weak_areas: string[];
					suggestions: string[];
				}>(`/interviews/${sessionId}/results`, { skipAuth: true });
				setResultsData(resultsRes);
				setStage('results');
				return;
			}

			setQuestionIndex((value) => value + 1);
		} catch (err) {
			const msg = err instanceof ApiError ? err.message : 'Failed to submit answer.';
			setAudioError(msg);
		}
	};

	const overallScore = questions.length ? Math.round(score / questions.length) : 0;
	const hasSubmittedAnswer = answers.length > 0;
	const liveScoreValue = questions.length ? Math.round(score / Math.max(1, answers.length)) : 0;
	const liveMetrics = stage === 'interview' && hasSubmittedAnswer ? buildLiveMetrics(selectedMode, liveScoreValue) : [];

	return (
		<main className="aiInterviewPage">
			<section className="heroShell">
				<div className="heroCopyBlock">
					<p className="eyebrow">AI Interview Practice</p>
					<h1>Practice smarter with AI-driven mock interviews tailored to your skills and goals.</h1>
					<p className="heroCopy">Choose a mode, difficulty, and domain. Start a realistic mock interview and get intelligent feedback that helps you improve fast.</p>
				</div>
			</section>

			{stage === 'setup' ? (
				<section className="workspaceGrid setupLayout">
					<div className="panel fullWidth setupTabsPanel">
						<div className="domainTabs" role="tablist" aria-label="Interview domains">
							{domains.map((domain) => (
								<button key={domain} type="button" className={`domainTab ${selectedDomain === domain ? 'active' : ''}`} onClick={() => setSelectedDomain(domain)}>
									{domain}
								</button>
							))}
						</div>
					</div>

					<div className="panel sectionPanel fullWidth">
						<div className="resultsLikeHeader">
							<p>{modes.length} interview modes available</p>
							<span>Selected: {selectedDomain}</span>
						</div>
						<div className="filterPanel experiencePanel">
							<label className="filterLabel">Experience Level</label>
							<div className="filterOptionRow">
								{difficulties.map((difficulty) => (
									<button key={difficulty.id} type="button" className={`filterOption ${selectedDifficulty === difficulty.id ? 'active' : ''}`} onClick={() => setSelectedDifficulty(difficulty.id)}>
										<span className={`difficultyDot ${difficulty.color}`} />
										{difficulty.label}
									</button>
								))}
							</div>
						</div>
						<div className="filterPanel modePanel">
							<label className="filterLabel">Interview Mode</label>
							<div className="filterOptionRow">
								{modes.map((mode) => (
									<button key={mode.id} type="button" className={`filterOption modeChip ${selectedMode === mode.id ? 'active' : ''}`} onClick={() => setSelectedMode(mode.id)}>
										<span className="filterIcon">{renderModeIcon(mode.id)}</span>
										{mode.label}
									</button>
								))}
							</div>
						</div>
						<div className="ctaRow">
							<button type="button" className="primaryBtn" onClick={startInterview}>Start Interview</button>
							<div className="summaryPill">
								<strong>{modeMeta.label}</strong>
								<span>{difficultyMeta.label} · {selectedDomain}</span>
							</div>
						</div>
					</div>
				</section>
			) : null}

			{stage === 'interview' && currentQuestion ? (
				<section className="sessionGrid">
					<div className="panel interviewPanel sectionPanel">
						<div className="panelHeading">
							<h2>Live Interview</h2>
							<span>Question {questionIndex + 1} of {questions.length}</span>
						</div>
						<div className="statusBar">
							<div className="statusCard statusModeCard">
								<div className="statusIcon" aria-hidden="true">{renderModeIcon(modeMeta.id)}</div>
								<div>
									<strong>{modeMeta.label}</strong>
									<span>{modeMeta.description}</span>
								</div>
							</div>
							<div className="statusCard statusMetaCard">
								<span className="statusLabel">Difficulty</span>
								<strong>{difficultyMeta.label}</strong>
							</div>
							<div className="statusCard statusMetaCard">
								<span className="statusLabel">Domain</span>
								<strong>{selectedDomain}</strong>
							</div>
						</div>
						<div className="questionCard">
							<p className="questionLabel">AI Question</p>
							<h3>{currentQuestion.prompt}</h3>
							<p className="questionHint">Focus on clarity, confidence, and technical accuracy.</p>
						</div>
						{selectedMode === 'voice' ? (
							<div className="audioResponseCard">
								<div className="audioRecorderHead">
									<div className="audioMicIcon" aria-hidden="true">
										{renderModeIcon('voice')}
									</div>
									<div>
										<strong>{isRecording ? `Recording ${formatDuration(recordingSeconds)}` : 'Voice response mode'}</strong>
										<span>{isRecording ? 'Microphone is active. Speak clearly and confidently.' : 'Tap record to answer with your voice'}</span>
									</div>
								</div>
								<div className={`audioWave ${isRecording ? 'recording' : ''}`} aria-hidden="true">
									<span />
									<span />
									<span />
									<span />
									<span />
									<span />
									<span />
									<span />
								</div>
								<p className="audioHint">Your answer can be recorded directly from here. Keep your response structured and concise.</p>
								{audioPreviewUrl ? (
									<div className="audioPreview">
										<audio controls src={audioPreviewUrl} />
									</div>
								) : null}
										{audioError ? <p className="audioError">{audioError}</p> : null}
								<div className="audioActions">
									<button type="button" className="primaryBtn" onClick={startRecording} disabled={isRecording}>
										{isRecording ? 'Recording...' : 'Start Recording'}
									</button>
									<button type="button" className="secondaryBtn" onClick={stopRecording} disabled={!isRecording}>Stop</button>
								</div>
							</div>
						) : selectedMode === 'video' ? (
							<div className="audioResponseCard videoResponseCard">
								<div className="audioRecorderHead">
									<div className="audioMicIcon" aria-hidden="true">
										{renderModeIcon('video')}
									</div>
									<div>
										<strong>{isRecording ? `Recording ${formatDuration(recordingSeconds)}` : 'Video response mode'}</strong>
										<span>{isRecording ? 'Camera and microphone are active. Look into the camera and answer confidently.' : 'Tap record to answer with your camera and voice'}</span>
									</div>
								</div>
								<p className="audioHint">{isRecording ? 'Live camera is on. Keep your posture open and your response structured.' : 'Camera will start after you click Start Recording.'}</p>
								<div className="videoPreview liveVideoPreview">
									<video ref={liveVideoRef} autoPlay muted playsInline />
								</div>
								{audioError ? <p className="audioError">{audioError}</p> : null}
								<div className="audioActions">
									<button type="button" className="primaryBtn" onClick={startRecording} disabled={isRecording}>
										{isRecording ? 'Recording...' : 'Start Recording'}
									</button>
									<button type="button" className="secondaryBtn" onClick={stopRecording} disabled={!isRecording}>Stop</button>
								</div>
							</div>
						) : (
							<textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Share your response here..." rows={7} />
						)}
						<div className="ctaRow">
							<button type="button" className="primaryBtn" onClick={submitAnswer}>Submit Answer</button>
							<button type="button" className="secondaryBtn" onClick={() => setStage('setup')}>Back to Setup</button>
						</div>
					</div>

					<div className="panel sidePanel sectionPanel">
						<div className="panelHeading">
							<h2>AI Features</h2>
						</div>
						<ul className="featureList">
							<li>Dynamic question generation</li>
							<li>Real-time response evaluation</li>
							<li>Confidence & communication analysis</li>
							<li>Technical accuracy scoring</li>
						</ul>
						<div className="liveMetric">
							<span>Current estimated score</span>
							<strong>{questions.length && answers.length ? Math.round(score / answers.length) : 0}%</strong>
						</div>
					</div>
				</section>
			) : null}

			{stage === 'results' ? (
				<section className="resultsGrid">
					<div className="panel resultsPanel sectionPanel">
						<div className="resultsHeaderBlock">
							<div className="scoreCircle">
								<span>{overallScore}%</span>
								<small>Overall Score</small>
							</div>
							<div>
								<p className="eyebrow">Interview Feedback</p>
								<h2>Personalized review for {selectedDomain}</h2>
								<p className="heroCopy">A concise summary of how you performed, what you did well, and where to improve before the next attempt.</p>
							</div>
						</div>

						<div className="feedbackColumns">
							<div className="feedbackCard">
								<h3>Strengths</h3>
								<ul>
									{resultsData?.strengths?.map((item: string) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
							<div className="feedbackCard">
								<h3>Weak Areas</h3>
								<ul>
									{resultsData?.weak_areas?.map((item: string) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
						</div>

						<div className="liveMetricsBlock resultsMetricsBlock">
							<div className="panelHeading liveMetricsHeading">
								<h2>Final Interview Details</h2>
								<span>{selectedMode === 'text' ? 'Text Mode' : selectedMode === 'voice' ? 'Audio Mode' : 'Video Mode'}</span>
							</div>
							<div className="liveMetricsGrid">
								{buildLiveMetrics(selectedMode, overallScore).map((metric) => (
									<div key={metric.label} className="metricCard">
										<p>{metric.label}</p>
										<strong>{metric.value}</strong>
										<span>{metric.description}</span>
									</div>
								))}
							</div>
							<div className="submittedAnswersBlock">
								<div className="panelHeading submittedAnswersHeading">
									<h2>Submitted Answers</h2>
									<span>{answers.length} answered</span>
								</div>
								<div className="submittedAnswersList">
									{answers.map((submittedAnswer, index) => (
										<div key={`${submittedAnswer}-${index}`} className="submittedAnswerCard">
											<p>Answer {index + 1}</p>
											<span>{submittedAnswer}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="panel sidePanel sectionPanel">
						<div className="panelHeading">
							<h2>Improvement Suggestions</h2>
						</div>
						<ul className="featureList">
							{resultsData?.suggestions?.map((item: string) => (
								<li key={item}>{item}</li>
							))}
						</ul>
						<div className="ctaRow">
							<button type="button" className="primaryBtn" onClick={() => setStage('setup')}>Try Again</button>
							<button
								type="button"
								className="secondaryBtn"
								onClick={() => {
									setStage('setup');
									setScore(0);
									setAnswers([]);
								}}
							>
								Change Settings
							</button>
						</div>
					</div>
				</section>
			) : null}
		</main>
	);
}
