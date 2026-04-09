"use client";

import { useRouter } from 'next/navigation';
import './careearmachig.scss';

type MatchLevel = 'High Match' | 'Medium Match' | 'Good Match';

type CareerMatch = {
	id: string;
	title: string;
	level: MatchLevel;
	score: number;
	fitReason: string;
	roadmapHint: string;
};

const careerMatches: CareerMatch[] = [
	{
		id: 'fullstack',
		title: 'Full Stack Developer',
		level: 'High Match',
		score: 87,
		fitReason: 'Based on your skills in React, JavaScript, and your interest in building applications.',
		roadmapHint: 'Best next step: deepen backend architecture and API design.',
	},
	{
		id: 'frontend',
		title: 'Frontend Engineer',
		level: 'High Match',
		score: 84,
		fitReason: 'Strong alignment with your UI focus, component-driven development habits, and design sensitivity.',
		roadmapHint: 'Best next step: master accessibility and performance optimization.',
	},
	{
		id: 'product-designer',
		title: 'UI/UX Product Designer',
		level: 'Medium Match',
		score: 72,
		fitReason: 'Your visual thinking and problem-solving style fit product design workflows and user journey design.',
		roadmapHint: 'Best next step: create portfolio case studies with measurable impact.',
	},
	{
		id: 'data-analyst',
		title: 'Data Analyst',
		level: 'Good Match',
		score: 66,
		fitReason: 'You show strong analytical curiosity and a structured approach to understanding trends and outcomes.',
		roadmapHint: 'Best next step: strengthen SQL and dashboard storytelling.',
	},
];

const levelClassMap: Record<MatchLevel, string> = {
	'High Match': 'high',
	'Medium Match': 'medium',
	'Good Match': 'good',
};

export default function CareerMaching() {
	const router = useRouter();

	return (
		<main className="careerMatchingPage">
			<section className="careerMatchingHero">
				<p className="heroKicker">AI Career Intelligence</p>
				<h1>Your Career Matches</h1>
				<p>Based on your profile, here are the best career paths for you.</p>
			</section>

			<section className="careerCards" aria-label="Career match cards">
				{careerMatches.map((match) => {
					const levelClass = levelClassMap[match.level];
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
							<p className="whyTitle">Why This Fits You</p>
							<p className="fitReason">{match.fitReason}</p>
							<p className="roadmapHint">{match.roadmapHint}</p>
						</button>
					);
				})}
			</section>
		</main>
	);
}
