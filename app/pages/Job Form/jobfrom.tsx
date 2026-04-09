"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Resumechecker from '../Job Resume Analysis/resumechecker';
import './jobfrom.scss';

type ExperienceLevel = 'Fresher' | '1-3 yrs' | '3+ yrs';

type UserProfile = {
	fullName: string;
	email: string;
	phone: string;
	skills: string[];
};

const STORAGE_KEY = 'hireonix-user-profile';

const defaultProfile: UserProfile = {
	fullName: 'Harsh Patel',
	email: 'harsh.patel@example.com',
	phone: '+91 98765 43210',
	skills: ['React.js', 'Next.js', 'TypeScript', 'REST APIs'],
};

export default function Jobfrom() {
	const [isLoading, setIsLoading] = useState(true);
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [degree, setDegree] = useState('B.Tech in Computer Science');
	const [college, setCollege] = useState('Nirma University');
	const [passYear, setPassYear] = useState('2024');
	const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('1-3 yrs');
	const [previousCompany, setPreviousCompany] = useState('');
	const [skills, setSkills] = useState<string[]>([]);
	const [newSkill, setNewSkill] = useState('');
	const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
	const [submitFeedback, setSubmitFeedback] = useState('');

	useEffect(() => {
		const loadProfile = () => {
			let profile = defaultProfile;

			try {
				const raw = window.localStorage.getItem(STORAGE_KEY);
				if (raw) {
					const parsed = JSON.parse(raw) as Partial<UserProfile>;
					profile = {
						fullName: parsed.fullName || defaultProfile.fullName,
						email: parsed.email || defaultProfile.email,
						phone: parsed.phone || defaultProfile.phone,
						skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : defaultProfile.skills,
					};
				}
			} catch {
				profile = defaultProfile;
			}

			setFullName(profile.fullName);
			setEmail(profile.email);
			setPhone(profile.phone);
			setSkills(profile.skills);
			setIsLoading(false);
		};

		// Small delay to make auto-fill feel like a fetched profile.
		const timer = window.setTimeout(loadProfile, 280);
		return () => window.clearTimeout(timer);
	}, []);

	const normalizedSkills = useMemo(() => skills.map((skill) => skill.trim()).filter(Boolean), [skills]);

	const addSkill = () => {
		const value = newSkill.trim();
		if (!value) {
			return;
		}

		if (normalizedSkills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
			setNewSkill('');
			return;
		}

		setSkills((current) => [...current, value]);
		setNewSkill('');
	};

	const removeSkill = (skillToRemove: string) => {
		setSkills((current) => current.filter((skill) => skill !== skillToRemove));
	};

	const submitApplication = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const profile: UserProfile = {
			fullName,
			email,
			phone,
			skills: normalizedSkills,
		};

		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
		setSubmitFeedback('Application submitted. Opening resume analysis...');

		// Keep popup opening reliable even when many state updates happen together.
		window.requestAnimationFrame(() => {
			setIsResumeModalOpen(true);
		});
	};

	if (isLoading) {
		return (
			<main className="jobFormPage">
				<section className="jobFormCard loadingState" aria-label="Loading profile">
					<p>Loading your profile details...</p>
				</section>
			</main>
		);
	}

	return (
		<main className="jobFormPage">
			<section className="jobFormCard" aria-label="Application form">
				<header className="formHeader">
					<h1>Complete Your Application</h1>
					<p>Review your details and submit your application.</p>
				</header>

				<form className="applicationForm" onSubmit={submitApplication}>
					<section className="formSection" aria-label="Personal information">
						<h2>1. Personal Information (Auto-Filled)</h2>

						<div className="fieldGrid">
							<label>
								Full Name
								<input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
							</label>

							<label>
								Email Address
								<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
							</label>

							<label>
								Phone Number
								<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required />
							</label>
						</div>
					</section>

					<section className="formSection" aria-label="Education details">
						<h2>2. Education Details</h2>

						<div className="fieldGrid">
							<label>
								Degree
								<input type="text" value={degree} onChange={(event) => setDegree(event.target.value)} required />
							</label>

							<label>
								College / University
								<input type="text" value={college} onChange={(event) => setCollege(event.target.value)} required />
							</label>

							<label>
								Year of Passing
								<input type="text" value={passYear} onChange={(event) => setPassYear(event.target.value)} required />
							</label>
						</div>
					</section>

					<section className="formSection" aria-label="Experience details">
						<h2>3. Experience</h2>

						<div className="fieldGrid">
							<label>
								Experience Level
								<select value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value as ExperienceLevel)}>
									<option value="Fresher">Fresher</option>
									<option value="1-3 yrs">1-3 yrs</option>
									<option value="3+ yrs">3+ yrs</option>
								</select>
							</label>

							<label>
								Previous Company (optional)
								<input
									type="text"
									value={previousCompany}
									onChange={(event) => setPreviousCompany(event.target.value)}
									placeholder="Enter company name"
								/>
							</label>
						</div>
					</section>

					<section className="formSection" aria-label="Skills">
						<h2>4. Skills</h2>

						<div className="skillsWrap">
							{normalizedSkills.map((skill) => (
								<button type="button" key={skill} className="skillTag" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`}>
									{skill}
									<span>×</span>
								</button>
							))}
						</div>

						<div className="addSkillRow">
							<input
								type="text"
								value={newSkill}
								onChange={(event) => setNewSkill(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === 'Enter') {
										event.preventDefault();
										addSkill();
									}
								}}
								placeholder="Add a new skill"
							/>
							<button type="button" className="ghostButton" onClick={addSkill}>Add Skill</button>
						</div>
					</section>

					<div className="submitRow">
						<button type="submit" className="applyNowButton">Submit Application</button>
					</div>
				</form>

				{submitFeedback ? <p className="statusMessage">{submitFeedback}</p> : null}
			</section>

			<Resumechecker
				isOpen={isResumeModalOpen}
				candidateSkills={normalizedSkills}
				onClose={() => {
					setIsResumeModalOpen(false);
					setSubmitFeedback('');
				}}
			/>
		</main>
	);
}
