"use client";

import { useMemo, useState } from 'react';
import { ApiError, apiClient } from '../../utils/apiClient';
import './resumeaenalisis.scss';

type AnalysisResult = {
	ok: boolean;
	analysis_id: string;
	score: number;
	atsScore: number;
	strengths: string[];
	weaknesses: string[];
	suggestions: string[];
	extractedSkills: string[];
	missingKeywords: string[];
};

export default function ResumeAnalysis() {
	const [file, setFile] = useState<File | null>(null);
	const [dragActive, setDragActive] = useState(false);
	const [analyzing, setAnalyzing] = useState(false);
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const canAnalyze = useMemo(() => Boolean(file) && !analyzing, [file, analyzing]);

	const onFileSelected = (nextFile?: File) => {
		if (!nextFile) {
			return;
		}

		setFile(nextFile);
		setResult(null);
		setError(null);
	};

	const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
		event.preventDefault();
		setDragActive(false);
		onFileSelected(event.dataTransfer.files?.[0]);
	};

	const analyzeResume = async () => {
		if (!file || analyzing) {
			return;
		}

		setAnalyzing(true);
		setError(null);
		try {
			const formData = new FormData();
			formData.append('candidate_skills', JSON.stringify([]));
			formData.append('resume', file);

			const analyzed = await apiClient.post<AnalysisResult>('/jobs/resume-analysis', formData, {
				skipAuth: true,
			});
			setResult(analyzed);
		} catch (err) {
			const msg = err instanceof ApiError ? err.message : 'Could not analyze resume right now.';
			setError(msg);
			setResult(null);
		} finally {
			setAnalyzing(false);
		}
	};

	return (
		<main className="resumeAnalyzerPage">
			<section className="resumeHero">
				<p className="eyebrow">AI Resume Intelligence</p>
				<h1>AI Resume Analyzer</h1>
				<p className="heroCopy">Upload your resume and get instant AI-powered insights to improve your chances of getting hired.</p>
			</section>

			<section className="rulesPanel">
				<div className="panelHeader">
					<h2>Resume Analysis Rules</h2>
				</div>
				<div className="rulesGrid">
					<div className="ruleCard">
						<h3>What We Analyze</h3>
						<ul>
							<li>Skills relevance to job roles</li>
							<li>Resume structure and formatting</li>
							<li>Keyword optimization for ATS</li>
							<li>Experience and project quality</li>
							<li>Grammar and clarity</li>
						</ul>
					</div>
					<div className="ruleCard">
						<h3>Important Guidelines</h3>
						<ul>
							<li>Use a clear and professional format</li>
							<li>Include relevant skills and technologies</li>
							<li>Avoid unnecessary information</li>
							<li>Keep resume concise at 1 to 2 pages</li>
						</ul>
					</div>
				</div>
			</section>

			<section className="uploadPanel">
				<label
					className={`uploadZone ${dragActive ? 'dragActive' : ''}`}
					onDragOver={(event) => {
						event.preventDefault();
						setDragActive(true);
					}}
					onDragLeave={(event) => {
						event.preventDefault();
						setDragActive(false);
					}}
					onDrop={handleDrop}
				>
					<input
						type="file"
						accept=".pdf,.doc,.docx"
						onChange={(event) => onFileSelected(event.target.files?.[0])}
					/>
					<div className="uploadContent">
						<p className="uploadTitle">Upload Your Resume (PDF or DOC)</p>
						<p className="uploadHint">Drag and drop your file here, or click to upload</p>
						{file ? (
							<div className="uploadSuccess">
								<span className="statusDot" />
								<span>{file.name}</span>
							</div>
						) : null}
					</div>
				</label>

				<button className="analyzeBtn" type="button" onClick={analyzeResume} disabled={!canAnalyze}>
					{analyzing ? 'Analyzing Resume...' : 'Analyze Resume'}
				</button>
				{error ? <p className="analysisError">{error}</p> : null}
			</section>

			{result ? (
				<section className="resultPanel">
					<div className="scoreRow">
						<div className="scoreCard">
							<p>Resume Score</p>
							<strong>{result.score}%</strong>
						</div>
						<div className="scoreCard">
							<p>ATS Match</p>
							<strong>{result.atsScore}%</strong>
						</div>
					</div>

					<div className="insightGrid">
						<div className="insightCard">
							<h3>Strengths</h3>
							<ul>
								{result.strengths.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
						<div className="insightCard">
							<h3>Weaknesses</h3>
							<ul>
								{result.weaknesses.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
						<div className="insightCard fullWidth">
							<h3>Suggestions</h3>
							<ul>
								{result.suggestions.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					</div>

					<div className="keywordRows">
						<div className="keywordBox">
							<h4>Extracted Skills</h4>
							<div className="chipRow">
								{result.extractedSkills.map((skill) => (
									<span className="chip" key={skill}>{skill}</span>
								))}
							</div>
						</div>
						<div className="keywordBox">
							<h4>Missing ATS Keywords</h4>
							<div className="chipRow">
								{result.missingKeywords.map((keyword) => (
									<span className="chip warning" key={keyword}>{keyword}</span>
								))}
							</div>
						</div>
					</div>
				</section>
			) : null}
		</main>
	);
}
