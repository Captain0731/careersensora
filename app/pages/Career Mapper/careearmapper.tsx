"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import './careearmapper.scss';

type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

type CareerPath = {
	id: string;
	title: string;
	summary: string;
	skillMatches: string[];
	interestMatches: string[];
	bestFor: ExperienceLevel[];
	roadmap: string[];
};

const baseSkills = [
	'JavaScript',
	'Python',
	'React.js',
	'Machine Learning',
	'UI/UX Design',
	'TypeScript',
	'Node.js',
	'SQL',
	'Data Visualization',
	'Product Thinking',
	'Figma',
	'Cloud Basics',
];

const interests = [
	{ id: 'Problem Solving' },
	{ id: 'Designing' },
	{ id: 'Data Analysis' },
	{ id: 'Building Applications' },
	{ id: 'Research & Innovation' },
];

const experienceLevels: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

const careerPaths: CareerPath[] = [
	{
		id: 'frontend',
		title: 'Frontend Engineer',
		summary: 'Focus on building high-performance interfaces and delightful user experiences.',
		skillMatches: ['JavaScript', 'React.js', 'TypeScript', 'UI/UX Design'],
		interestMatches: ['Designing', 'Building Applications', 'Problem Solving'],
		bestFor: ['Beginner', 'Intermediate', 'Advanced'],
		roadmap: [
			'Master modern HTML/CSS/JS foundations and component patterns.',
			'Build 3 production-grade React projects with responsive design.',
			'Learn testing, performance optimization, and accessibility.',
			'Deploy portfolio projects and prepare for frontend system design.',
		],
	},
	{
		id: 'datascience',
		title: 'Data Scientist',
		summary: 'Turn raw data into actionable insights and predictive models.',
		skillMatches: ['Python', 'SQL', 'Machine Learning', 'Data Visualization'],
		interestMatches: ['Data Analysis', 'Problem Solving', 'Research & Innovation'],
		bestFor: ['Intermediate', 'Advanced'],
		roadmap: [
			'Strengthen statistics, probability, and data cleaning workflows.',
			'Practice end-to-end ML projects with real-world datasets.',
			'Learn model evaluation, feature engineering, and experiment tracking.',
			'Create business-focused case studies and storytelling dashboards.',
		],
	},
	{
		id: 'fullstack',
		title: 'Full Stack Developer',
		summary: 'Build complete products from frontend experiences to backend APIs.',
		skillMatches: ['JavaScript', 'React.js', 'Node.js', 'SQL', 'Cloud Basics'],
		interestMatches: ['Building Applications', 'Problem Solving', 'Research & Innovation'],
		bestFor: ['Beginner', 'Intermediate', 'Advanced'],
		roadmap: [
			'Build API-driven apps with authentication and database support.',
			'Learn backend architecture, caching, and API security patterns.',
			'Deploy full stack projects using CI/CD and cloud tooling.',
			'Practice scalable architecture and production debugging.',
		],
	},
	{
		id: 'ux',
		title: 'UI/UX Product Designer',
		summary: 'Design intuitive digital products backed by research and usability.',
		skillMatches: ['UI/UX Design', 'Figma', 'Product Thinking', 'Data Visualization'],
		interestMatches: ['Designing', 'Research & Innovation', 'Problem Solving'],
		bestFor: ['Beginner', 'Intermediate', 'Advanced'],
		roadmap: [
			'Build strong design fundamentals: hierarchy, typography, and spacing.',
			'Run user research and convert insights into wireframes and flows.',
			'Create clickable prototypes and conduct usability testing.',
			'Build portfolio case studies that show process and measurable impact.',
		],
	},
];

export default function CareerMapper() {
	const router = useRouter();
	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
	const [skillQuery, setSkillQuery] = useState('');
	const [customSkill, setCustomSkill] = useState('');
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
	const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);

	const allSkills = useMemo(() => {
		const merged = [...baseSkills, ...selectedSkills];
		return Array.from(new Set(merged));
	}, [selectedSkills]);

	const filteredSkills = useMemo(() => {
		if (!skillQuery.trim()) {
			return allSkills;
		}

		const needle = skillQuery.trim().toLowerCase();
		return allSkills.filter((skill) => skill.toLowerCase().includes(needle));
	}, [allSkills, skillQuery]);

	const canGenerate = selectedSkills.length > 0 && selectedInterests.length > 0 && experienceLevel !== null;

	const toggleSelection = (value: string, current: string[], setter: (next: string[]) => void) => {
		if (current.includes(value)) {
			setter(current.filter((item) => item !== value));
			return;
		}

		setter([...current, value]);
	};

	const addCustomSkill = () => {
		const nextSkill = customSkill.trim();
		if (!nextSkill) {
			return;
		}

		if (!selectedSkills.includes(nextSkill)) {
			setSelectedSkills([...selectedSkills, nextSkill]);
		}
		setCustomSkill('');
	};

	const generateCareerPath = () => {
		if (!experienceLevel) {
			return;
		}
		router.push('/services/career-matching');
	};

	return (
		<main className="careerMapperPage">
			<section className="mapperHero">
				<p className="mapperKicker">Smart Career Discovery</p>
				<h1>AI Career Mapper</h1>
				<p>Discover the best career path tailored to your skills, interests, and experience.</p>
			</section>

			<section className="mapperSteps">
				<article className="mapperCard">
					<header className="cardHeader">
						<span>Step 1</span>
						<h2>Select Skills</h2>
					</header>

					<div className="skillTools">
						<input
							type="text"
							value={skillQuery}
							onChange={(event) => setSkillQuery(event.target.value)}
							placeholder="Search skills..."
							aria-label="Search skills"
						/>
						<div className="customSkillRow">
							<input
								type="text"
								value={customSkill}
								onChange={(event) => setCustomSkill(event.target.value)}
								placeholder="Add custom skill"
								aria-label="Add custom skill"
							/>
							<button type="button" onClick={addCustomSkill}>Add</button>
						</div>
					</div>

					<div className="chipGrid">
						{filteredSkills.map((skill) => (
							<button
								key={skill}
								type="button"
								className={selectedSkills.includes(skill) ? 'chip active' : 'chip'}
								onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
							>
								{skill}
							</button>
						))}
					</div>
				</article>

				<article className="mapperCard">
					<header className="cardHeader">
						<span>Step 2</span>
						<h2>Select Interests</h2>
					</header>

					<div className="interestGrid">
						{interests.map((interest) => {
							const active = selectedInterests.includes(interest.id);
							return (
								<button
									key={interest.id}
									type="button"
									className={active ? 'interestCard active' : 'interestCard'}
									onClick={() => toggleSelection(interest.id, selectedInterests, setSelectedInterests)}
								>
									<strong>{interest.id}</strong>
								</button>
							);
						})}
					</div>
				</article>

				<article className="mapperCard">
					<header className="cardHeader">
						<span>Step 3</span>
						<h2>Select Experience Level</h2>
					</header>

					<div className="levelGrid">
						{experienceLevels.map((level) => (
							<button
								key={level}
								type="button"
								className={experienceLevel === level ? 'levelCard active' : 'levelCard'}
								onClick={() => setExperienceLevel(level)}
							>
								<span className={`levelDot ${level.toLowerCase()}`} aria-hidden="true" />
								<strong>{level}</strong>
							</button>
						))}
					</div>
				</article>
			</section>

			<div className="generateBar">
				<button type="button" className="generateBtn" onClick={generateCareerPath} disabled={!canGenerate}>
					Generate Career Path
				</button>
			</div>

		</main>
	);
}
