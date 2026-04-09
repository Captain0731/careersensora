"use client";

import { ChangeEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import './resumechecker.scss';

type ResumeCheckerProps = {
	isOpen: boolean;
	candidateSkills: string[];
	onClose: () => void;
};

const requiredKeywords = ['React.js', 'Next.js', 'REST APIs', 'GraphQL', 'TypeScript'];

export default function Resumechecker({ isOpen, candidateSkills, onClose }: ResumeCheckerProps) {
	const router = useRouter();
	const [uploadedResumeName, setUploadedResumeName] = useState('');
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [hasAnalyzed, setHasAnalyzed] = useState(false);

	const onResumeSelected = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		setUploadedResumeName(file ? file.name : '');
		setHasAnalyzed(false);
		setIsAnalyzing(false);
	};

	const runAnalysis = () => {
		if (!uploadedResumeName) {
			return;
		}

		setIsAnalyzing(true);
		window.setTimeout(() => {
			setIsAnalyzing(false);
			setHasAnalyzed(true);
		}, 900);
	};

	const analysis = useMemo(() => {
		const normalized = candidateSkills.map((skill) => skill.trim().toLowerCase()).filter(Boolean);
		const matched = requiredKeywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));
		const keywordScore = Math.round((matched.length / requiredKeywords.length) * 100);
		const skillsDepthScore = Math.min(100, Math.round((normalized.length / 8) * 100));
		const resumeQualityScore = uploadedResumeName ? 90 : 0;
		const overallScore = Math.round((keywordScore * 0.6) + (skillsDepthScore * 0.25) + (resumeQualityScore * 0.15));
		const eligible = overallScore >= 80;

		return { matched, keywordScore, skillsDepthScore, resumeQualityScore, overallScore, eligible };
	}, [candidateSkills, uploadedResumeName]);

	if (!isOpen) {
		return null;
	}

	return (
		<div className="resumeModalBackdrop" role="presentation" onClick={onClose}>
			<div className="resumeModal" role="dialog" aria-modal="true" aria-labelledby="resume-analysis-title" onClick={(event) => event.stopPropagation()}>
				<button type="button" className="closeModalButton" aria-label="Close resume analysis" onClick={onClose}>
					×
				</button>

				<h2 id="resume-analysis-title">Resume Analysis in Progress...</h2>
				<p className="modalSubtext">We are matching your resume with job requirements.</p>

				<section className="analysisBlock" aria-label="Resume upload">
					<h3>Resume Upload</h3>
					<p className="uploadHint">Upload your latest resume to continue the AI validation process.</p>
					<label className="uploadControl">
						<input type="file" accept=".pdf,.doc,.docx" onChange={onResumeSelected} />
						<span>{uploadedResumeName ? 'Change Resume' : 'Upload Resume'}</span>
					</label>
					<p className="uploadStatus">
						{uploadedResumeName ? `Selected: ${uploadedResumeName}` : 'No file selected'}
					</p>
					<button type="button" className="analyzeButton" onClick={runAnalysis} disabled={!uploadedResumeName || isAnalyzing}>
						{isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
					</button>
				</section>

				{hasAnalyzed ? (
					<>
						<section className="analysisBlock" aria-label="Keyword matching">
					<h3>Keyword Matching Section</h3>
					<p className="scoreText">Keyword Match: {analysis.keywordScore}%</p>

					<div className="progressTrack" aria-hidden="true">
						<div className="progressFill" style={{ width: `${analysis.keywordScore}%` }} />
					</div>

					<div className="scoreGrid" aria-label="Resume score breakdown">
						<div className="scoreCard">
							<span>Keyword Score</span>
							<strong>{analysis.keywordScore}%</strong>
						</div>
						<div className="scoreCard">
							<span>Skills Depth</span>
							<strong>{analysis.skillsDepthScore}%</strong>
						</div>
						<div className="scoreCard">
							<span>Resume Quality</span>
							<strong>{analysis.resumeQualityScore}%</strong>
						</div>
					</div>

					<div className="overallScoreBox" aria-label="Overall resume score">
						<p>Resume Overall Score</p>
						<strong>{analysis.overallScore}%</strong>
					</div>

					<div className="keywordColumns">
						<div className="keywordColumn">
							<h4>Matched Skills</h4>
							<ul>
								{analysis.matched.map((skill) => (
									<li key={skill}>{skill} ✅</li>
								))}
							</ul>
						</div>
					</div>
						</section>

						<section className="analysisBlock" aria-label="AI Insight">
					<h3>AI Insight</h3>
					<p className="insightCopy">
						Your profile matches most of the required skills, but adding missing technologies can improve your chances.
					</p>
						</section>

						<section className="analysisBlock" aria-label="Decision logic">
					<h3>Decision</h3>
					<p className={`decisionText ${analysis.eligible ? 'success' : 'warning'}`}>
						{analysis.eligible ? '✅ Eligible for Next Step' : '⚠️ Not Eligible Yet'}
					</p>
					{analysis.eligible ? (
						<button
							type="button"
							className="primaryActionButton"
							disabled={!uploadedResumeName}
							onClick={() => router.push('/services/ai-interview')}
						>
							Continue to AI Interview
						</button>
					) : (
						<>
							<p className="improveHint">Improve your resume by adding missing skills.</p>
							<button
								type="button"
								className="primaryActionButton"
								disabled={!uploadedResumeName}
								onClick={() => router.push('/services/resume-analysis')}
							>
								Improve Resume
							</button>
						</>
					)}
					{!uploadedResumeName ? <p className="uploadRequiredNote">Please upload a resume to continue.</p> : null}
						</section>
					</>
				) : (
					<section className="analysisBlock" aria-label="Awaiting analysis">
						<p className="awaitingText">Upload resume and click Analyze Resume to view AI validation results.</p>
					</section>
				)}
			</div>
		</div>
	);
}
