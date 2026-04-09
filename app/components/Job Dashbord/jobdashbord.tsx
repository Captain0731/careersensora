"use client";

import { FormEvent, useMemo, useState } from 'react';
import './jobdashbord.scss';

type ExperienceLevel = 'Fresher' | '1-3 Years' | '3+ Years';
type JobType = 'Full Time' | 'Part Time' | 'Remote' | 'Contract' | 'Internship';

type JobPosting = {
	id: number;
	title: string;
	company: string;
	jobType: JobType;
	location: string;
	salaryRange: string;
	timeLimit: string;
	skills: string[];
	description: string;
	experience: ExperienceLevel;
	applications: number;
	status: 'Open' | 'Paused' | 'Closed';
};

const initialJobs: JobPosting[] = [
	{
		id: 1,
		title: 'Frontend Developer',
		company: 'Hireonix Studios',
		jobType: 'Full Time',
		location: 'Remote',
		salaryRange: '₹6–10 LPA',
		timeLimit: '7 days',
		skills: ['React.js', 'TypeScript', 'Next.js'],
		description: 'Build polished user interfaces for our talent marketplace and career tools.',
		experience: '1-3 Years',
		applications: 24,
		status: 'Open',
	},
	{
		id: 2,
		title: 'AI Engineer',
		company: 'Insight Forge',
		jobType: 'Remote',
		location: 'Bangalore',
		salaryRange: '₹12–20 LPA',
		timeLimit: '14 days',
		skills: ['Python', 'LLMs', 'Machine Learning'],
		description: 'Design AI features for recommendation and evaluation systems.',
		experience: '3+ Years',
		applications: 17,
		status: 'Open',
	},
];

const experienceOptions: ExperienceLevel[] = ['Fresher', '1-3 Years', '3+ Years'];

const statusOptions: JobPosting['status'][] = ['Open', 'Paused', 'Closed'];

export default function JobDashbord() {
	const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingJobId, setEditingJobId] = useState<number | null>(null);
	const [form, setForm] = useState({
		title: '',
		company: '',
		jobType: 'Full Time' as JobType,
		location: 'Remote',
		salaryRange: '',
		timeLimit: '7 days',
		skills: '',
		description: '',
		experience: '1-3 Years' as ExperienceLevel,
	});

	const summary = useMemo(
		() => ({
			totalJobs: jobs.length,
			openJobs: jobs.filter((job) => job.status === 'Open').length,
			applications: jobs.reduce((count, job) => count + job.applications, 0),
		}),
		[jobs]
	);

	const resetForm = () => {
		setForm({
			title: '',
			company: '',
			jobType: 'Full Time',
			location: 'Remote',
			salaryRange: '',
			timeLimit: '7 days',
			skills: '',
			description: '',
			experience: '1-3 Years',
		});
		setEditingJobId(null);
	};

	const openCreateModal = () => {
		resetForm();
		setIsModalOpen(true);
	};

	const openEditModal = (job: JobPosting) => {
		setEditingJobId(job.id);
		setForm({
			title: job.title,
			company: job.company,
			jobType: job.jobType,
			location: job.location,
			salaryRange: job.salaryRange,
			timeLimit: job.timeLimit,
			skills: job.skills.join(', '),
			description: job.description,
			experience: job.experience,
		});
		setIsModalOpen(true);
	};

	const updateJobStatus = (jobId: number, nextStatus: JobPosting['status']) => {
		setJobs((currentJobs) => currentJobs.map((job) => (job.id === jobId ? { ...job, status: nextStatus } : job)));
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const skills = form.skills
			.split(',')
			.map((skill) => skill.trim())
			.filter(Boolean);

		if (editingJobId !== null) {
			setJobs((currentJobs) =>
				currentJobs.map((job) =>
					job.id === editingJobId
						? {
								...job,
								title: form.title,
								company: form.company,
								jobType: form.jobType,
								location: form.location,
								salaryRange: form.salaryRange,
								timeLimit: form.timeLimit,
								skills,
								description: form.description,
								experience: form.experience,
							}
						: job
				)
			);
		} else {
			setJobs((currentJobs) => [
				{
					id: Date.now(),
					title: form.title,
					company: form.company,
					jobType: form.jobType,
					location: form.location,
					salaryRange: form.salaryRange,
					timeLimit: form.timeLimit,
					skills,
					description: form.description,
					experience: form.experience,
					applications: 0,
					status: 'Open',
				},
				...currentJobs,
			]);
		}

		resetForm();
		setIsModalOpen(false);
	};

	return (
		<section className="recruiterDashboard">
			<div className="dashboardHeader">
				<div>
					<h1>Recruiter Job Dashboard</h1>
					<p>Manage your job postings and find the right candidates faster.</p>
				</div>
				<button className="addJobBtn" type="button" onClick={openCreateModal}>
					+ Add New Job
				</button>
			</div>

			<div className="statsGrid">
				<div className="statCard">
					<span>Total Jobs</span>
					<strong>{summary.totalJobs}</strong>
				</div>
				<div className="statCard">
					<span>Open Roles</span>
					<strong>{summary.openJobs}</strong>
				</div>
				<div className="statCard">
					<span>Applications</span>
					<strong>{summary.applications}</strong>
				</div>
			</div>

			<div className="jobsGrid">
				{jobs.map((job) => (
					<article key={job.id} className="jobCard">
						<div className="jobCardHeader">
							<div>
								<h2>{job.title}</h2>
								<p>{job.company}</p>
							</div>
							<span className={`statusBadge status-${job.status.toLowerCase()}`}>{job.status}</span>
						</div>

						<div className="jobMeta">
							<span>Type: {job.jobType}</span>
							<span>{job.location}</span>
							<span>{job.salaryRange}</span>
							<span>Time Limit: {job.timeLimit}</span>
							<span>{job.experience}</span>
						</div>

						<div className="skillsRow">
							{job.skills.map((skill) => (
								<span key={skill} className="skillTag">
									{skill}
								</span>
							))}
						</div>

						<p className="jobDescription">{job.description}</p>

						<div className="jobFooter">
							<span>{job.applications} applications</span>
							<div className="footerActions">
								<button type="button" className="statusBtn editBtn" onClick={() => openEditModal(job)}>
									Edit
								</button>
								{statusOptions.map((status) => (
									<button
										key={status}
										type="button"
										className={`statusBtn ${job.status === status ? 'isActive' : ''}`}
										onClick={() => updateJobStatus(job.id, status)}
									>
										{status}
									</button>
								))}
							</div>
						</div>
					</article>
				))}
			</div>

			{isModalOpen && (
				<div className="modalOverlay" onClick={() => setIsModalOpen(false)}>
					<div className="jobModal" onClick={(event) => event.stopPropagation()}>
						<div className="modalHeader">
							<h2>{editingJobId !== null ? 'Edit Job' : 'Post New Job'}</h2>
							<button type="button" className="closeBtn" onClick={() => setIsModalOpen(false)}>
								×
							</button>
						</div>

						<form className="jobForm" onSubmit={handleSubmit}>
							<div className="formGrid">
								<label>
									Job Title
									<input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Frontend Developer" required />
								</label>
								<label>
									Company Name
									<input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} placeholder="Hireonix" required />
								</label>
								<label>
									Job Type
									<select value={form.jobType} onChange={(event) => setForm((current) => ({ ...current, jobType: event.target.value as JobType }))}>
										<option value="Full Time">Full Time</option>
										<option value="Part Time">Part Time</option>
										<option value="Remote">Remote</option>
										<option value="Contract">Contract</option>
										<option value="Internship">Internship</option>
									</select>
								</label>
								<label>
									Location
									<input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} placeholder="Remote / City" required />
								</label>
								<label>
									Salary Range
									<input value={form.salaryRange} onChange={(event) => setForm((current) => ({ ...current, salaryRange: event.target.value }))} placeholder="₹6–10 LPA" required />
								</label>
								<label>
									Time Limit
									<select value={form.timeLimit} onChange={(event) => setForm((current) => ({ ...current, timeLimit: event.target.value }))}>
										<option value="3 days">3 days</option>
										<option value="7 days">7 days</option>
										<option value="14 days">14 days</option>
										<option value="30 days">30 days</option>
									</select>
								</label>
								<label className="fullWidth">
									Required Skills
									<input value={form.skills} onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))} placeholder="React.js, Node.js, Python" required />
								</label>
								<label className="fullWidth">
									Job Description
									<textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Describe the role and responsibilities" rows={4} required />
								</label>
								<label className="fullWidth">
									Experience Required
									<select value={form.experience} onChange={(event) => setForm((current) => ({ ...current, experience: event.target.value as ExperienceLevel }))}>
										{experienceOptions.map((option) => (
											<option key={option} value={option}>{option}</option>
										))}
									</select>
								</label>
							</div>

							<div className="modalActions">
								<button type="button" className="secondaryBtn" onClick={() => { setIsModalOpen(false); resetForm(); }}>
									Cancel
								</button>
								<button type="submit" className="primaryBtn">
									{editingJobId !== null ? 'Save Changes' : 'Post Job'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</section>
	);
}
