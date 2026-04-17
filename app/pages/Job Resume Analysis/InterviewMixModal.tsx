"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { apiClient, ApiError } from '../../utils/apiClient';
import './InterviewMixModal.scss';

type InterviewMixModalProps = {
	isOpen: boolean;
	applicationId: string | null;
	onClose: () => void;
};

type QuestionRow = {
	id: string;
	prompt: string;
};

type ModeId = 'text' | 'voice' | 'video';

export default function InterviewMixModal({ isOpen, applicationId, onClose }: InterviewMixModalProps) {
	const [stage, setStage] = useState<'intro' | 'interview' | 'results'>('intro');
	const [selectedMode, setSelectedMode] = useState<ModeId>('voice');
	const [questionIndex, setQuestionIndex] = useState(0);
	const [answer, setAnswer] = useState('');
	const [questions, setQuestions] = useState<QuestionRow[]>([]);
	const [score, setScore] = useState(0);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [resultsData, setResultsData] = useState<any>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [recordingSeconds, setRecordingSeconds] = useState(0);
	const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const liveVideoRef = useRef<HTMLVideoElement | null>(null);
	const liveStreamRef = useRef<MediaStream | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		if (!isOpen) {
			setStage('intro');
			setSessionId(null);
			setQuestions([]);
			setResultsData(null);
			setScore(0);
		}
	}, [isOpen]);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
			if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
			if (liveStreamRef.current) liveStreamRef.current.getTracks().forEach(t => t.stop());
		};
	}, []);

	const startInterview = async () => {
		setError(null);
		setIsSubmitting(true);
		try {
			const res = await apiClient.post<{
				id: string;
				questions: Array<{ id: string; question_text: string; order: number }>;
			}>('/interviews/start', {
				domain: 'Full Stack Development',
				difficulty: 'medium',
				mode: 'mix',
			}, { skipAuth: true });

			setSessionId(res.id);
			setQuestions(res.questions.map(q => ({ id: q.id, prompt: q.question_text })));
			setStage('interview');
			setQuestionIndex(0);
			
			// Mandatory Camera/Mic Start
			setTimeout(() => {
				startRecordingAction(true); // Don't start actual recording yet, just the stream
			}, 100);
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Could not start interview.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const startRecordingAction = async (isInitialStream = false) => {
		if (isRecording) return;
		setError(null);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ 
				audio: true, 
				video: true // Mandatory video
			});
			liveStreamRef.current = stream;
			if (liveVideoRef.current) {
				liveVideoRef.current.srcObject = stream;
			}

			if (isInitialStream) {
				setSelectedMode('video');
				return;
			}

			const recorder = new MediaRecorder(stream);
			mediaRecorderRef.current = recorder;
			audioChunksRef.current = [];
			recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
			recorder.onstop = () => {
				const blob = new Blob(audioChunksRef.current, { type: 'video/webm' });
				setAudioPreviewUrl(URL.createObjectURL(blob));
				setAnswer('AI Interview response captured via Video/Voice.');
			};
			recorder.start();
			setIsRecording(true);
			setRecordingSeconds(0);
			timerRef.current = window.setInterval(() => setRecordingSeconds(s => s + 1), 1000);
		} catch {
			setError('Mandatory Camera/Mic access denied. Please enable permissions to proceed.');
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
		if (timerRef.current) clearInterval(timerRef.current);
		setIsRecording(false);
	};

	const submitAnswer = async () => {
		if (!sessionId || isSubmitting) return;
		setIsSubmitting(true);
		try {
			const res = await apiClient.post<{ score: number }>(`/interviews/${sessionId}/answer`, {
				question_id: questions[questionIndex].id,
				answer_text: answer.trim() || 'Response captured via audio/video.',
			}, { skipAuth: true });

			const nextScore = score + res.score;
			setScore(nextScore);
			setAnswer('');
			setAudioPreviewUrl(null);

			if (questionIndex >= questions.length - 1) {
				const results = await apiClient.get<any>(`/interviews/${sessionId}/results`, { skipAuth: true });
				setResultsData(results);
				setStage('results');
			} else {
				setQuestionIndex(i => i + 1);
			}
		} catch {
			setError('Failed to submit answer.');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	const progressPercentage = questions.length ? ((questionIndex + 1) / questions.length) * 100 : 0;

	return (
		<div className="interviewMixModalBackdrop" onClick={onClose}>
			<div className="interviewMixModal" onClick={e => e.stopPropagation()}>
				<button className="closeMixModalButton" onClick={onClose}>×</button>

				<div className="mixProgressBar">
					<div className="progressFill" style={{ width: `${stage === 'results' ? 100 : progressPercentage}%` }} />
				</div>

				{stage === 'intro' && (
					<div className="mixIntro">
						<h2>AI Interview Readiness</h2>
						<p className="mixModalSubtext">Your resume is strong! The next step is a 5-minute AI-driven interview.</p>
						
						<div className="mixDeadlineNotice">
							Please complete your AI Interview within the next 2 days to proceed with your application.
						</div>

						<div className="mixActionRow">
							<button className="mixPrimary" onClick={startInterview} disabled={isSubmitting}>
								{isSubmitting ? 'Starting...' : 'Start AI Interview Now'}
							</button>
						</div>
					</div>
				)}

				{stage === 'interview' && questions[questionIndex] && (
					<div className="mixInterview">
						<div className="mixQuestionBox">
							<h3>{questions[questionIndex].prompt}</h3>
							<p>Question {questionIndex + 1} of {questions.length}</p>
						</div>

						<div className="mixResponseArea">
							<div className="mixInputSection">
								<p className="inputLabel">Type your response:</p>
								<textarea 
									value={answer} 
									onChange={e => setAnswer(e.target.value)} 
									placeholder="Tell us about yourself..." 
								/>
							</div>

							<div className="mixMediaSection">
								<div className="mixMediaBox">
									{isRecording && <div className="mixRecordingStatus">Recording {recordingSeconds}s</div>}
									<video ref={liveVideoRef} autoPlay muted playsInline />
								</div>

								<div className="mixMediaControls">
									<button className={`mixSecondary ${isRecording ? 'isRecording' : ''}`} onClick={isRecording ? stopRecording : () => startRecordingAction(false)}>
										{isRecording ? 'Stop Recording' : 'Record Video Response'}
									</button>
									{audioPreviewUrl && (
										<div className="mixAudioControl" style={{ marginTop: 12 }}>
											<span>Recording ready</span>
											<audio controls src={audioPreviewUrl} />
										</div>
									)}
								</div>
							</div>
						</div>

						{error && <p className="mixError" style={{ color: 'red', marginBottom: 15 }}>{error}</p>}

						<button className="mixPrimary" onClick={submitAnswer} disabled={isSubmitting || (answer.trim().length === 0 && !audioPreviewUrl && !isRecording)}>
							{isSubmitting ? 'Submitting...' : 'Submit Answer'}
						</button>
					</div>
				)}

				{stage === 'results' && (
					<div className="mixResultsBox">
						<div className="mixScoreOverview">
							<div className="scoreRing">
								<strong>{Math.round(resultsData?.overall_score || 0)}%</strong>
							</div>
							<span>Interview Completed Successfully</span>
						</div>

						<div className="mixResultsGrid">
							<div className="mixResultCard">
								<h4>Strengths</h4>
								<ul>
									{resultsData?.strengths?.map((s: string) => <li key={s}>{s}</li>)}
								</ul>
							</div>
							<div className="mixResultCard">
								<h4>Suggestions</h4>
								<ul>
									{resultsData?.suggestions?.map((s: string) => <li key={s}>{s}</li>)}
								</ul>
							</div>
						</div>

						<button className="mixPrimary" onClick={onClose}>Close and Finish Application</button>
					</div>
				)}
			</div>
		</div>
	);
}
