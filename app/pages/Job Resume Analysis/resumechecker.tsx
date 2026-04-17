"use client";

import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, apiClient } from '../../utils/apiClient';
import InterviewMixModal from './InterviewMixModal';
import './resumechecker.scss';

type ResumeCheckerProps = {
	isOpen: boolean;
	applicationId: string | null;
	candidateSkills: string[];
	onClose: () => void;
};

type ResumeAnalysisResult = {
	ok: boolean;
	analysis_id: string;
	matched: string[];
	keywordScore: number;
	skillsDepthScore: number;
	resumeQualityScore: number;
	overallScore: number;
	eligible: boolean;
};

export default function Resumechecker({ isOpen, applicationId, candidateSkills, onClose }: ResumeCheckerProps) {
	const router = useRouter();
	const [uploadedResumeName, setUploadedResumeName] = useState('');
	const [uploadedResumeFile, setUploadedResumeFile] = useState<File | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [hasAnalyzed, setHasAnalyzed] = useState(false);
 	const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
	const [analysisError, setAnalysisError] = useState('');
	const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

	const onResumeSelected = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		setUploadedResumeName(file ? file.name : '');
		setUploadedResumeFile(file || null);
		setHasAnalyzed(false);
		setIsAnalyzing(false);
		setAnalysis(null);
		setAnalysisError('');
	};

	const runAnalysis = async () => {
		if (!uploadedResumeFile) {
			setAnalysisError('Please upload a resume before analysis.');
			return;
		}
		if (!applicationId) {
			setAnalysisError('Application was not saved yet. Please submit again.');
			return;
		}

		setIsAnalyzing(true);
		setAnalysisError('');
		try {
			const formData = new FormData();
			formData.append('candidate_skills', JSON.stringify(candidateSkills));
			formData.append('resume', uploadedResumeFile);

			const result = await apiClient.post<ResumeAnalysisResult>(
				`/jobs/applications/${applicationId}/resume-analysis`,
				formData,
				{ skipAuth: true }
			);
			setAnalysis(result);
			setIsAnalyzing(false);
			setHasAnalyzed(true);
		} catch (err) {
			setIsAnalyzing(false);
			setHasAnalyzed(false);
			const msg = err instanceof ApiError ? err.message : 'Resume analysis failed.';
			setAnalysisError(msg);
		}
	};

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
					{analysisError ? <p className="uploadRequiredNote">{analysisError}</p> : null}
					<button type="button" className="analyzeButton" onClick={runAnalysis} disabled={!uploadedResumeName || isAnalyzing}>
						{isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
					</button>
				</section>

				{hasAnalyzed && analysis ? (
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
						<div className="eligibleActionBlock">
							<p className="mixModalDeadlineNote">
								⚠️ <strong>Notice:</strong> Please complete your AI Interview within the next <strong>2 days</strong> to proceed with your application.
							</p>
							<button
								type="button"
								className="primaryActionButton"
								disabled={!uploadedResumeName}
								onClick={() => setIsInterviewModalOpen(true)}
							>
								Start AI Interview
							</button>
						</div>
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

			<InterviewMixModal
				isOpen={isInterviewModalOpen}
				applicationId={applicationId}
				onClose={() => {
					setIsInterviewModalOpen(false);
					onClose(); // Close the resume checker as well when interview is done
				}}
			/>
		</div>
	);
}
