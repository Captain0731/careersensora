"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, apiClient } from '../../utils/apiClient';
import {
	readCareerMapperPayload,
	saveCareerMatches,
	type StoredCareerMatch,
} from '../../utils/careerMapperSession';
import './careearmachig.scss';

type MatchLevel = 'High Match' | 'Medium Match' | 'Good Match';

type CareerMatch = StoredCareerMatch;

const defaultCareerMatches: CareerMatch[] = [];

const levelClassMap: Record<MatchLevel, string> = {
	'High Match': 'high',
	'Medium Match': 'medium',
	'Good Match': 'good',
};

function inferLanguageChoice(skills: string[]): string {
	const raw = skills.join(' ').toLowerCase();
	const parts: string[] = [];
	if (raw.includes('react')) parts.push('React');
	if (raw.includes('javascript') || raw.includes(' js')) parts.push('JavaScript');
	if (raw.includes('typescript') || raw.includes(' ts')) parts.push('TypeScript');
	if (raw.includes('python')) parts.push('Python');
	if (raw.includes('java')) parts.push('Java');
	if (raw.includes('sql')) parts.push('SQL');
	if (parts.length === 0) {
		return skills.slice(0, 2).join(' + ') || 'General Tech Stack';
	}
	return parts.slice(0, 3).join(' + ');
}

function buildPersonalizedFallback(skills: string[], interests: string[]): CareerMatch[] {
	const language = inferLanguageChoice(skills);
	const roleTitle = interests.some((x) => x.toLowerCase().includes('design'))
		? 'UI/UX Product Role'
		: interests.some((x) => x.toLowerCase().includes('data'))
			? 'Data-Focused Role'
			: interests.some((x) => x.toLowerCase().includes('full stack'))
				? 'Full Stack Developer'
				: 'Software Development Role';
	const nextSkills = ['Problem Solving', 'Project Building', 'Interview Prep'];
	const missing = ['Advanced Projects', 'Portfolio Depth', 'System Thinking'];
	return [
		{
			id: 'personalized-1',
			title: roleTitle,
			level: 'High Match',
			score: 82,
			fitReason: `Based on your selected skills (${skills.join(', ')}) and interests (${interests.join(', ')}).`,
			roadmapHint: 'Best next step: build 2 focused projects and improve one weak area every week.',
			languageChoice: language,
			matchScore: 82,
			successProbability: 79,
			successTrack: 'Follow an 8-12 week plan with weekly project milestones.',
			salaryInsights: 'Salary growth is strong when your portfolio clearly shows real outcomes.',
			jobAvailability: 'Good opportunities available for candidates with practical project experience.',
			nextBestSkillsToLearn: nextSkills,
			skillBasedImprovementRate: '+8% to +12% profile improvement every quarter with consistency.',
			missingSkills: missing,
		},
	];
}

export default function CareerMaching() {
	const router = useRouter();
	const [careerMatches, setCareerMatches] = useState<CareerMatch[]>(defaultCareerMatches);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const payload = readCareerMapperPayload();
		if (!payload) return;
		const inferredLanguage = inferLanguageChoice(payload.skills);
		const personalizedFallback = buildPersonalizedFallback(payload.skills, payload.interests).map((match) => ({
			...match,
			languageChoice: inferredLanguage,
		}));

		let cancelled = false;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const result = await apiClient.post<{ matches: CareerMatch[] }>('/career-mapper/generate', payload);
				if (!cancelled && Array.isArray(result.matches) && result.matches.length > 0) {
					const aligned = result.matches.map((match) => ({
						...match,
						languageChoice: inferredLanguage,
					}));
					setCareerMatches(aligned);
				}
			} catch (err) {
				if (!cancelled) {
					const msg =
						err instanceof ApiError ? err.message : 'Could not generate AI matches. Showing fallback results.';
					setError(msg);
					setCareerMatches(personalizedFallback);
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
	}, []);

	useEffect(() => {
		if (careerMatches.length > 0) {
			saveCareerMatches(careerMatches);
		}
	}, [careerMatches]);

	return (
		<main className="careerMatchingPage">
			<section className="careerMatchingHero">
				<p className="heroKicker">AI Career Intelligence</p>
				<h1>Your Career Matches</h1>
				<p>Based on your profile, here are the best career paths for you.</p>
				{loading ? <p>Generating AI matches...</p> : null}
				{error ? <p>{error}</p> : null}
			</section>

			<section className="careerCards" aria-label="Career match cards">
				{careerMatches.map((match) => {
					const levelClass = levelClassMap[match.level as MatchLevel] ?? 'medium';
					return (
						<button
							key={match.id}
							type="button"
							className="careerCard"
							onClick={() => router.push(`/services/career-matching/detail?career=${match.id}`)}
						>
							<div className="cardTop">
								<h2>{match.title}</h2>
								<span className={`matchLevel ${levelClass}`}>
									<i aria-hidden="true" />
									{match.level}
								</span>
							</div>

							<p className="matchScore">{match.score}% Match</p>
							<div className="metricGrid">
								<p><strong>Language:</strong> {match.languageChoice}</p>
								<p><strong>Match Score:</strong> {match.matchScore}%</p>
								<p><strong>Success Probability:</strong> {match.successProbability}%</p>
								<p><strong>Success Track:</strong> {match.successTrack}</p>
								<p><strong>Salary Insights:</strong> {match.salaryInsights}</p>
								<p><strong>Job Availability:</strong> {match.jobAvailability}</p>
								<p><strong>Skill Improvement Rate:</strong> {match.skillBasedImprovementRate}</p>
							</div>
							<p className="whyTitle">Why This Fits You</p>
							<p className="fitReason">{match.fitReason}</p>
							<div className="skillRows">
								<p><strong>Next Best Skills:</strong> {match.nextBestSkillsToLearn.join(', ')}</p>
								<p><strong>Missing Skills:</strong> {match.missingSkills.join(', ')}</p>
							</div>
							<p className="roadmapHint">{match.roadmapHint}</p>
						</button>
					);
				})}
			</section>
		</main>
	);
}
