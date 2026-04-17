"use client";

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiError, apiClient } from '../../utils/apiClient';
import {
	readCareerMapperPayload,
	readCareerMatches,
	type StoredCareerMatch,
} from '../../utils/careerMapperSession';
import './careermatchingdetails.scss';

type CareerDetail = {
	id: string;
	title: string;
	matchScore: number;
	successProbability: number;
	selectedSkills: string[];
	salaryInsight: string;
	growthPotential: string;
	jobAvailability: string;
	availabilityHint: string;
	nextSkills: string[];
	learningSpeed: string;
	improvementRate: string;
	successFactors: string[];
	missingSkills: string[];
};

type CareerMatchingDetailProps = {
	selectedCareerId?: string;
};

export default function CareerMatchingDetail({ selectedCareerId }: CareerMatchingDetailProps) {
	const searchParams = useSearchParams();
	const careerFromUrl = searchParams.get('career') ?? undefined;
	const careerId = selectedCareerId ?? careerFromUrl;

	const [detail, setDetail] = useState<CareerDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const snapshot = useMemo(() => {
		if (!careerId) return null;
		const payload = readCareerMapperPayload();
		const matches = readCareerMatches();
		if (!payload || !matches?.length) return null;
		const match = matches.find((m) => m.id === careerId) ?? null;
		return { payload, match };
	}, [careerId]);

	useEffect(() => {
		if (!careerId) {
			setLoading(false);
			setError('No career selected. Go back to Career Mapper and generate matches first.');
			return;
		}

		const payload = readCareerMapperPayload();
		const matches = readCareerMatches();
		if (!payload || !matches?.length) {
			setLoading(false);
			setError(
				'Session data not found. Open Career Mapper, select skills and interests, generate matches, then open this page again.'
			);
			return;
		}

		const match = matches.find((m: StoredCareerMatch) => m.id === careerId);
		if (!match) {
			setLoading(false);
			setError(`No saved match for “${careerId}”. Return to the matching page and click a card again.`);
			return;
		}

		let cancelled = false;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const result = await apiClient.post<CareerDetail>(
					'/career-mapper/detail',
					{
						skills: payload.skills,
						interests: payload.interests,
						experienceLevel: payload.experienceLevel,
						careerId: match.id,
						title: match.title,
						matchScore: match.matchScore,
						successProbability: match.successProbability,
						fitReason: match.fitReason,
						roadmapHint: match.roadmapHint,
						nextBestSkillsToLearn: match.nextBestSkillsToLearn,
						missingSkills: match.missingSkills,
						languageChoice: match.languageChoice,
					},
					{ skipAuth: true }
				);
				if (!cancelled) {
					setDetail(result);
				}
			} catch (err) {
				if (!cancelled) {
					const msg = err instanceof ApiError ? err.message : 'Could not load AI career detail.';
					setError(msg);
					setDetail({
						id: match.id,
						title: match.title,
						matchScore: match.matchScore,
						successProbability: match.successProbability,
						selectedSkills: payload.skills,
						salaryInsight: match.salaryInsights,
						growthPotential: 'See roadmap and next skills below.',
						jobAvailability: match.jobAvailability,
						availabilityHint: 'Demand varies by region; portfolio quality matters most.',
						nextSkills: match.nextBestSkillsToLearn,
						learningSpeed: 'Depends on weekly practice consistency.',
						improvementRate: match.skillBasedImprovementRate,
						successFactors: ['Your selected skills', 'Your interests', 'Market demand'],
						missingSkills: match.missingSkills,
					});
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [careerId]);

	const downloadReport = () => {
		window.print();
	};

	if (loading) {
		return (
			<main className="careerDetailPage">
				<section className="detailHero">
					<p className="detailKicker">AI Career Analysis Dashboard</p>
					<h1>Loading your report…</h1>
					<p>Generating insights with Groq AI using your selected profile.</p>
				</section>
			</main>
		);
	}

	if (error && !detail) {
		return (
			<main className="careerDetailPage">
				<section className="detailHero">
					<p className="detailKicker">AI Career Analysis Dashboard</p>
					<h1>Could not load detail</h1>
					<p>{error}</p>
				</section>
			</main>
		);
	}

	if (!detail) {
		return null;
	}

	return (
		<main className="careerDetailPage">
			{error ? (
				<section className="detailHero" style={{ marginBottom: 12 }}>
					<p style={{ color: '#b45309', fontSize: '0.95rem' }}>{error} Showing saved card data where needed.</p>
				</section>
			) : null}

			<section className="detailHero">
				<p className="detailKicker">AI Career Analysis Dashboard</p>
				<h1>Career Analysis: {detail.title}</h1>
				<p>Detailed insights based on your selected skills, interests, and Groq AI analysis.</p>
				{snapshot?.match?.successTrack ? (
					<p style={{ marginTop: 8, fontSize: '0.95rem', color: 'rgba(20, 58, 42, 0.75)' }}>
						<strong>Success track:</strong> {snapshot.match.successTrack}
					</p>
				) : null}
			</section>

			<section className="scorePanel">
				<div className="ringWrap" aria-label="Match score visualization">
					<div className="scoreRing" style={{ ['--score' as string]: detail.matchScore }}>
						<span>{detail.matchScore}%</span>
						<small>Match Score</small>
					</div>
				</div>
				<div className="scoreMeta">
					<div>
						<strong>Match Score</strong>
						<p>{detail.matchScore}%</p>
					</div>
					<div>
						<strong>Success Probability</strong>
						<p>{detail.successProbability}%</p>
					</div>
					<div className="progressRow" aria-label="Success probability bar">
						<span>Success Track</span>
						<div className="progressTrack">
							<div style={{ width: `${detail.successProbability}%` }} />
						</div>
					</div>
				</div>
			</section>

			<section className="detailGrid">
				<article className="detailCard">
					<h2>Selected Skills</h2>
					<ul className="pillList">
						{detail.selectedSkills.map((skill) => (
							<li key={skill}>{skill}</li>
						))}
					</ul>
				</article>

				<article className="detailCard">
					<h2>Salary Insights</h2>
					<p><strong>Average Salary:</strong> {detail.salaryInsight}</p>
					<p><strong>Growth Potential:</strong> {detail.growthPotential}</p>
				</article>

				<article className="detailCard">
					<h2>Job Availability</h2>
					<p><strong>{detail.jobAvailability}</strong></p>
					<p>{detail.availabilityHint}</p>
				</article>

				<article className="detailCard">
					<h2>Next Best Skills to Learn</h2>
					<ul className="bulletList">
						{detail.nextSkills.map((skill) => (
							<li key={skill}>{skill}</li>
						))}
					</ul>
				</article>

				<article className="detailCard">
					<h2>Skill-Based Improvement Rate</h2>
					<p><strong>Learning Speed:</strong> {detail.learningSpeed}</p>
					<p><strong>Improvement Rate:</strong> {detail.improvementRate}</p>
				</article>

				<article className="detailCard">
					<h2>Success Probability</h2>
					<p>{detail.successProbability}% chance of success in this field</p>
					<p><strong>Based on:</strong></p>
					<ul className="bulletList">
						{detail.successFactors.map((factor) => (
							<li key={factor}>{factor}</li>
						))}
					</ul>
				</article>

				<article className="detailCard fullWidth">
					<h2>Missing Skills</h2>
					<ul className="pillList warning">
						{detail.missingSkills.map((skill) => (
							<li key={skill}>{skill}</li>
						))}
					</ul>
				</article>
			</section>

			<section className="downloadSection">
				<button type="button" className="downloadBtn" onClick={downloadReport}>
					Download Report
				</button>
				<p>The report includes full analysis, scores, skills, and recommendations. The print dialog lets you save as PDF.</p>
			</section>
		</main>
	);
}
