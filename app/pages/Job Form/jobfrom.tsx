"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiError, apiClient } from '../../utils/apiClient';
import Resumechecker from '../Job Resume Analysis/resumechecker';
import './jobfrom.scss';

type ExperienceLevel = 'Fresher' | '1-3 yrs' | '3+ yrs';

type UserProfile = {
	fullName: string;
	email: string;
	phone: string;
	skills: string[];
};

type JobSummary = {
	id: string;
	title: string;
	company: string;
};

const STORAGE_KEY = 'hireonix-user-profile';

const defaultProfile: UserProfile = {
	fullName: 'Harsh Patel',
	email: 'harsh.patel@example.com',
	phone: '+91 98765 43210',
	skills: ['React.js', 'Next.js', 'TypeScript', 'REST APIs'],
};

export default function Jobfrom() {
	const searchParams = useSearchParams();
	const selectedJobId = searchParams.get('jobId') || searchParams.get('id');
	const hasValidJobId = !!selectedJobId;

	const [isLoading, setIsLoading] = useState(true);
	const [jobLoading, setJobLoading] = useState(false);
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
	const [submitError, setSubmitError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedJob, setSelectedJob] = useState<JobSummary | null>(null);
	const [applicationId, setApplicationId] = useState<string | null>(null);

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

	useEffect(() => {
		let ignore = false;
		const loadJob = async () => {
			setJobLoading(true);
			try {
				if (hasValidJobId) {
					const job = await apiClient.get<JobSummary>(`/jobs/${selectedJobId}`, { skipAuth: true });
					if (!ignore) {
						setSelectedJob(job);
					}
					return;
				}

				const list = await apiClient.get<{ jobs: JobSummary[] }>('/jobs/', { skipAuth: true });
				if (!ignore) {
					setSelectedJob((list.jobs && list.jobs.length > 0) ? list.jobs[0] : null);
				}
			} catch {
				if (!ignore) {
					setSelectedJob(null);
				}
			} finally {
				if (!ignore) {
					setJobLoading(false);
				}
			}
		};

		loadJob();
		return () => {
			ignore = true;
		};
	}, [hasValidJobId, selectedJobId]);

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

	const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitFeedback('');
		setSubmitError('');
		setApplicationId(null);

		if (!selectedJob) {
			setSubmitError('No open jobs available right now.');
			return;
		}

		const profile: UserProfile = {
			fullName,
			email,
			phone,
			skills: normalizedSkills,
		};

		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

		const messageParts = [
			`Degree: ${degree.trim()}`,
			`College: ${college.trim()}`,
			`Passing Year: ${passYear.trim()}`,
			`Experience Level: ${experienceLevel}`,
			`Previous Company: ${(previousCompany || 'N/A').trim()}`,
			`Skills: ${normalizedSkills.join(', ') || 'N/A'}`,
		];

		setIsSubmitting(true);
		try {
			const response = await apiClient.post<{ ok: boolean; application_id: string }>(
				'/jobs/apply',
				{
					job_id: selectedJob.id,
					full_name: fullName.trim(),
					email: email.trim(),
					phone: phone.trim(),
					message: messageParts.join('\n'),
				},
				{ skipAuth: true }
			);

			if (response.ok) {
				setApplicationId(response.application_id);
				setSubmitFeedback(`Application submitted for ${selectedJob.title}. Ref #${response.application_id}`);
				window.requestAnimationFrame(() => {
					setIsResumeModalOpen(true);
				});
			}
		} catch (err) {
			const msg = err instanceof ApiError ? err.message : 'Could not submit application.';
			setSubmitError(msg);
		} finally {
			setIsSubmitting(false);
		}
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
					{jobLoading ? <p>Loading selected job...</p> : null}
					{selectedJob ? <p>Applying for: {selectedJob.title} at {selectedJob.company}</p> : null}
					{!jobLoading && !selectedJob ? <p>No open jobs available for applying right now.</p> : null}
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
						<button type="submit" className="applyNowButton" disabled={isSubmitting || jobLoading || !selectedJob}>
							{isSubmitting ? 'Submitting...' : 'Submit Application'}
						</button>
					</div>
				</form>

				{submitError ? <p className="statusMessage" style={{ color: '#b42318' }}>{submitError}</p> : null}
				{submitFeedback ? <p className="statusMessage">{submitFeedback}</p> : null}
			</section>

			<Resumechecker
				isOpen={isResumeModalOpen}
				applicationId={applicationId}
				candidateSkills={normalizedSkills}
				onClose={() => {
					setIsResumeModalOpen(false);
					setSubmitFeedback('');
					setApplicationId(null);
				}}
			/>
		</main>
	);
}
