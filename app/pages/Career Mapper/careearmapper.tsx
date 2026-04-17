"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../../utils/apiClient';
import { saveCareerMapperPayload } from '../../utils/careerMapperSession';
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

type CareerMapperConfig = {
	base_skills: string[];
	interests: { id: string }[];
	experience_levels: string[];
	career_paths: CareerPath[];
};

const emptyConfig: CareerMapperConfig = {
	base_skills: [],
	interests: [],
	experience_levels: [],
	career_paths: [],
};

export default function CareerMapper() {
	const router = useRouter();
	const [config, setConfig] = useState<CareerMapperConfig>(emptyConfig);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [savingSkill, setSavingSkill] = useState(false);
	const [skillSaveError, setSkillSaveError] = useState<string | null>(null);

	const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
	const [skillQuery, setSkillQuery] = useState('');
	const [customSkill, setCustomSkill] = useState('');
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
	const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const data = await apiClient.get<CareerMapperConfig>('/career-mapper/config');
				if (!cancelled) {
					setConfig(data);
					setLoadError(null);
				}
			} catch (err) {
				if (!cancelled) {
					const msg =
						err instanceof ApiError
							? err.message
							: 'Could not load career data. Is the API running on port 8000?';
					setLoadError(msg);
					setConfig(emptyConfig);
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

	const baseSkills = config.base_skills;
	const interests = config.interests;
	const experienceLevels = config.experience_levels as ExperienceLevel[];

	const allSkills = useMemo(() => {
		const merged = [...baseSkills, ...selectedSkills];
		return Array.from(new Set(merged));
	}, [baseSkills, selectedSkills]);

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

	const addCustomSkill = async () => {
		const nextSkill = customSkill.trim();
		if (!nextSkill) {
			return;
		}

		setSkillSaveError(null);
		setSavingSkill(true);
		try {
			await apiClient.post<{ name: string; created: boolean }>('/career-mapper/skills', { name: nextSkill });
			const data = await apiClient.get<CareerMapperConfig>('/career-mapper/config');
			setConfig(data);
			const savedName = data.base_skills.find((s) => s.toLowerCase() === nextSkill.toLowerCase()) ?? nextSkill;
			if (!selectedSkills.includes(savedName)) {
				setSelectedSkills([...selectedSkills, savedName]);
			}
			setCustomSkill('');
		} catch (err) {
			const msg =
				err instanceof ApiError
					? err.message
					: 'Could not save skill. Is the API running on port 8000?';
			setSkillSaveError(msg);
		} finally {
			setSavingSkill(false);
		}
	};

	const generateCareerPath = () => {
		if (!experienceLevel) {
			return;
		}
		saveCareerMapperPayload({
			skills: selectedSkills,
			interests: selectedInterests,
			experienceLevel,
		});
		router.push('/services/career-matching');
	};

	return (
		<main className="careerMapperPage">
			<section className="mapperHero">
				<p className="mapperKicker">Smart Career Discovery</p>
				<h1>AI Career Mapper</h1>
				<p>Discover the best career path tailored to your skills, interests, and experience.</p>
				{loading ? <p className="mapperStatus">Loading career data…</p> : null}
				{loadError ? <p className="mapperStatus mapperStatusError">{loadError}</p> : null}
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
							disabled={loading}
						/>
						<div className="customSkillRow">
							<input
								type="text"
								value={customSkill}
								onChange={(event) => setCustomSkill(event.target.value)}
								placeholder="Add custom skill"
								aria-label="Add custom skill"
								disabled={loading || savingSkill}
							/>
							<button type="button" onClick={addCustomSkill} disabled={loading || savingSkill}>
								{savingSkill ? 'Saving…' : 'Add'}
							</button>
						</div>
						{skillSaveError ? <p className="mapperStatus mapperStatusError">{skillSaveError}</p> : null}
					</div>

					<div className="chipGrid">
						{filteredSkills.map((skill) => (
							<button
								key={skill}
								type="button"
								className={selectedSkills.includes(skill) ? 'chip active' : 'chip'}
								onClick={() => toggleSelection(skill, selectedSkills, setSelectedSkills)}
								disabled={loading}
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
									disabled={loading}
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
								onClick={() => setExperienceLevel(level as ExperienceLevel)}
								disabled={loading}
							>
								<span className={`levelDot ${level.toLowerCase()}`} aria-hidden="true" />
								<strong>{level}</strong>
							</button>
						))}
					</div>
				</article>
			</section>

			<div className="generateBar">
				<button type="button" className="generateBtn" onClick={generateCareerPath} disabled={!canGenerate || loading}>
					Generate Career Path
				</button>
			</div>
		</main>
	);
}
