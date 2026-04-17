"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { apiClient, ApiError } from '../../utils/apiClient';
import './jobdashbord.scss';

type JobPostingStatus = 'Open' | 'Paused' | 'Closed';

type JobPosting = {
	id: number;
	title: string;
	company: string;
	jobType: string;
	location: string;
	category: string;
	salaryRange: string;
	timeLimit: string;
	skills: string[];
	description: string;
	responsibilities: string[];
	requirements: string[];
	niceToHave: string[];
	experience: string;
	applications: number;
	status: JobPostingStatus;
};

type ApiManageJob = {
	id: number;
	title: string;
	company: string;
	location: string;
	salary: string;
	workType: string;
	experience: string;
	category: string;
	skills: string[];
	description: string;
	responsibilities: string[];
	requirements: string[];
	niceToHave: string[];
	badge: string;
	applications: number;
	listingStatus: string;
};

const statusOptions: JobPostingStatus[] = ['Open', 'Paused', 'Closed'];

function toPosting(j: ApiManageJob): JobPosting {
	const ls = (j.listingStatus || 'open').toLowerCase();
	const status: JobPostingStatus =
		ls === 'paused' ? 'Paused' : ls === 'closed' ? 'Closed' : 'Open';
	return {
		id: j.id,
		title: j.title,
		company: j.company,
		jobType: j.workType,
		location: j.location,
		category: j.category,
		salaryRange: j.salary,
		timeLimit: j.badge?.trim() ? j.badge : '—',
		skills: j.skills || [],
		description: j.description,
		responsibilities: j.responsibilities || [],
		requirements: j.requirements || [],
		niceToHave: j.niceToHave || [],
		experience: j.experience,
		applications: j.applications,
		status,
	};
}

function statusToListing(s: JobPostingStatus): string {
	if (s === 'Paused') {
		return 'paused';
	}
	if (s === 'Closed') {
		return 'closed';
	}
	return 'open';
}

export default function JobDashbord() {
	const [jobs, setJobs] = useState<JobPosting[]>([]);
	const [listLoading, setListLoading] = useState(true);
	const [listError, setListError] = useState<string | null>(null);
	const [categoryOptions, setCategoryOptions] = useState<string[]>(['Web Development']);
	const [workTypeOptions, setWorkTypeOptions] = useState<string[]>(['Full Time']);
	const [experienceOptions, setExperienceOptions] = useState<string[]>(['1-3 Years']);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingJobId, setEditingJobId] = useState<number | null>(null);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState({
		title: '',
		company: '',
		jobType: 'Full Time',
		location: 'Remote',
		category: 'Web Development',
		salaryRange: '',
		timeLimit: '7 days',
		skills: '',
		description: '',
		responsibilities: '',
		requirements: '',
		niceToHave: '',
		experience: '1-3 Years',
		status: 'Open' as JobPostingStatus,
	});

	const loadMeta = useCallback(async () => {
		try {
			const meta = await apiClient.get<{
				categories: string[];
				workTypeOptions: string[];
				experienceOptions: string[];
			}>('/jobs/meta', { skipAuth: true });
			const cats = (meta.categories || []).filter((c) => c !== 'All');
			if (cats.length) {
				setCategoryOptions(cats);
				setForm((f) => ({ ...f, category: cats.includes(f.category) ? f.category : cats[0] }));
			}
			const wt = (meta.workTypeOptions || []).filter((w) => w !== 'All Work Types');
			if (wt.length) {
				setWorkTypeOptions(wt);
				setForm((f) => ({ ...f, jobType: wt.includes(f.jobType) ? f.jobType : wt[0] }));
			}
			const ex = (meta.experienceOptions || []).filter((e) => e !== 'All Levels');
			if (ex.length) {
				setExperienceOptions(ex);
				setForm((f) => ({ ...f, experience: ex.includes(f.experience) ? f.experience : ex[0] }));
			}
		} catch {
			/* defaults above */
		}
	}, []);

	const loadJobs = useCallback(async () => {
		setListLoading(true);
		setListError(null);
		try {
			const res = await apiClient.get<{ jobs: ApiManageJob[] }>('/jobs/manage/list');
			setJobs((res.jobs || []).map(toPosting));
		} catch (err) {
			const msg =
				err instanceof ApiError
					? err.message
					: 'Could not load jobs. Is Django running and are you logged in?';
			setListError(msg);
			setJobs([]);
		} finally {
			setListLoading(false);
		}
	}, []);

	useEffect(() => {
		loadMeta();
	}, [loadMeta]);

	useEffect(() => {
		loadJobs();
	}, [loadJobs]);

	const summary = useMemo(
		() => ({
			totalJobs: jobs.length,
			openJobs: jobs.filter((job) => job.status === 'Open').length,
			applications: jobs.reduce((count, job) => count + job.applications, 0),
		}),
		[jobs]
	);

	const resetForm = () => {
		setForm((f) => ({
			title: '',
			company: '',
			jobType: workTypeOptions[0] || 'Full Time',
			location: 'Remote',
			category: categoryOptions[0] || 'Web Development',
			salaryRange: '',
			timeLimit: '7 days',
			skills: '',
			description: '',
			responsibilities: '',
			requirements: '',
			niceToHave: '',
			experience: experienceOptions[0] || '1-3 Years',
			status: 'Open',
		}));
		setEditingJobId(null);
		setSaveError(null);
	};

	const openCreateModal = () => {
		resetForm();
		setIsModalOpen(true);
	};

	const openEditModal = (job: JobPosting) => {
		setEditingJobId(job.id);
		const cat = categoryOptions.includes(job.category) ? job.category : categoryOptions[0];
		setForm({
			title: job.title,
			company: job.company,
			jobType: workTypeOptions.includes(job.jobType) ? job.jobType : workTypeOptions[0],
			location: job.location,
			category: cat,
			salaryRange: job.salaryRange,
			timeLimit: job.timeLimit === '—' ? '7 days' : job.timeLimit,
			skills: job.skills.join(', '),
			description: job.description,
			responsibilities: job.responsibilities.join('\n'),
			requirements: job.requirements.join('\n'),
			niceToHave: job.niceToHave.join('\n'),
			experience: experienceOptions.includes(job.experience) ? job.experience : experienceOptions[0],
			status: job.status,
		});
		setSaveError(null);
		setIsModalOpen(true);
	};

	const updateJobStatus = async (jobId: number, nextStatus: JobPostingStatus) => {
		setSaveError(null);
		try {
			const updated = await apiClient.patch<ApiManageJob>(`/jobs/manage/${jobId}`, {
				listing_status: statusToListing(nextStatus),
			});
			setJobs((currentJobs) =>
				currentJobs.map((job) => (job.id === jobId ? toPosting(updated) : job))
			);
		} catch (err) {
			const msg = err instanceof ApiError ? err.message : 'Could not update status.';
			setSaveError(msg);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaveError(null);

		const skills = form.skills
			.split(',')
			.map((skill) => skill.trim())
			.filter(Boolean);

		const responsibilities = form.responsibilities
			.split('\n')
			.map((item) => item.trim())
			.filter(Boolean);

		const requirements = form.requirements
			.split('\n')
			.map((item) => item.trim())
			.filter(Boolean);

		const niceToHave = form.niceToHave
			.split('\n')
			.map((item) => item.trim())
			.filter(Boolean);

		if (skills.length === 0) {
			setSaveError('Please add at least one required skill.');
			return;
		}

		if (responsibilities.length === 0) {
			setSaveError('Please add at least one responsibility.');
			return;
		}

		if (requirements.length === 0) {
			setSaveError('Please add at least one requirement.');
			return;
		}

		const body = {
			title: form.title.trim(),
			company: form.company.trim(),
			location: form.location.trim(),
			salary: form.salaryRange.trim(),
			work_type: form.jobType,
			experience: form.experience,
			category: form.category.trim(),
			skills,
			description: form.description.trim(),
			responsibilities,
			requirements,
			nice_to_have: niceToHave,
			badge: form.timeLimit.trim(),
			listing_status: statusToListing(editingJobId !== null ? form.status : 'Open'),
		};

		setSaving(true);
		try {
			if (editingJobId !== null) {
				const updated = await apiClient.patch<ApiManageJob>(`/jobs/manage/${editingJobId}`, body);
				setJobs((currentJobs) =>
					currentJobs.map((job) => (job.id === editingJobId ? toPosting(updated) : job))
				);
			} else {
				const created = await apiClient.post<ApiManageJob>('/jobs/manage', body);
				setJobs((currentJobs) => [toPosting(created), ...currentJobs]);
			}
			resetForm();
			setIsModalOpen(false);
		} catch (err) {
			const msg = err instanceof ApiError ? err.message : 'Could not save job.';
			setSaveError(msg);
		} finally {
			setSaving(false);
		}
	};

	return (
		<section className="recruiterDashboard">
			<div className="dashboardHeader">
				<div>
					<h1>Recruiter Job Dashboard</h1>
					<p>Manage your job postings and find the right candidates faster. Open jobs appear on Job Apply.</p>
				</div>
				<button className="addJobBtn" type="button" onClick={openCreateModal}>
					+ Add New Job
				</button>
			</div>

			{listError ? (
				<p style={{ maxWidth: 1240, margin: '0 auto 16px', color: '#b91c1c' }}>{listError}</p>
			) : null}
			{saveError && !isModalOpen ? (
				<p style={{ maxWidth: 1240, margin: '0 auto 16px', color: '#b91c1c' }}>{saveError}</p>
			) : null}

			<div className="statsGrid">
				<div className="statCard">
					<span>Total Jobs</span>
					<strong>{listLoading ? '…' : summary.totalJobs}</strong>
				</div>
				<div className="statCard">
					<span>Open Roles</span>
					<strong>{listLoading ? '…' : summary.openJobs}</strong>
				</div>
				<div className="statCard">
					<span>Applications</span>
					<strong>{listLoading ? '…' : summary.applications}</strong>
				</div>
			</div>

			<div className="jobsGrid">
				{listLoading ? (
					<p style={{ gridColumn: '1 / -1' }}>Loading jobs…</p>
				) : (
					jobs.map((job) => (
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
								<span>Category: {job.category}</span>
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
					))
				)}
			</div>

			{isModalOpen && (
				<div className="modalOverlay" onClick={() => !saving && setIsModalOpen(false)}>
					<div className="jobModal" onClick={(event) => event.stopPropagation()}>
						<div className="modalHeader">
							<h2>{editingJobId !== null ? 'Edit Job' : 'Post New Job'}</h2>
							<button
								type="button"
								className="closeBtn"
								disabled={saving}
								onClick={() => {
									setIsModalOpen(false);
									resetForm();
								}}
							>
								×
							</button>
						</div>

						<form className="jobForm" onSubmit={handleSubmit}>
							{saveError ? <p style={{ color: '#b91c1c', margin: '0 0 12px' }}>{saveError}</p> : null}
							<div className="formGrid">
								<label>
									Job Title
									<input
										value={form.title}
										onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
										placeholder="Frontend Developer"
										required
									/>
								</label>
								<label>
									Company Name
									<input
										value={form.company}
										onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
										placeholder="Hireonix"
										required
									/>
								</label>
								<label>
									Category
									<select
										value={form.category}
										onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
										required
									>
										{categoryOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								</label>
								<label>
									Job Type
									<select
										value={form.jobType}
										onChange={(event) => setForm((current) => ({ ...current, jobType: event.target.value }))}
									>
										{workTypeOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								</label>
								<label>
									Location
									<input
										value={form.location}
										onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
										placeholder="Remote / City"
										required
									/>
								</label>
								<label>
									Salary Range
									<input
										value={form.salaryRange}
										onChange={(event) => setForm((current) => ({ ...current, salaryRange: event.target.value }))}
										placeholder="₹6–10 LPA"
										required
									/>
								</label>
								<label>
									Time Limit
									<select
										value={form.timeLimit}
										onChange={(event) => setForm((current) => ({ ...current, timeLimit: event.target.value }))}
									>
										<option value="3 days">3 days</option>
										<option value="7 days">7 days</option>
										<option value="14 days">14 days</option>
										<option value="30 days">30 days</option>
									</select>
								</label>
								<label className="fullWidth">
									Required Skills
									<input
										value={form.skills}
										onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))}
										placeholder="React.js, Node.js, Python"
										required
									/>
								</label>
								<label className="fullWidth">
									Job Description
									<textarea
										value={form.description}
										onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
										placeholder="Describe the role and responsibilities"
										rows={4}
										required
									/>
								</label>
									<label className="fullWidth">
										Responsibilities (one per line)
										<textarea
											value={form.responsibilities}
											onChange={(event) =>
												setForm((current) => ({ ...current, responsibilities: event.target.value }))
											}
											placeholder={"Build scalable web apps\nIntegrate REST APIs"}
											rows={4}
											required
										/>
									</label>
									<label className="fullWidth">
										Requirements (one per line)
										<textarea
											value={form.requirements}
											onChange={(event) =>
												setForm((current) => ({ ...current, requirements: event.target.value }))
											}
											placeholder={"Strong JavaScript and React knowledge\nExperience with Next.js"}
											rows={4}
											required
										/>
									</label>
									<label className="fullWidth">
										Nice to Have (one per line)
										<textarea
											value={form.niceToHave}
											onChange={(event) =>
												setForm((current) => ({ ...current, niceToHave: event.target.value }))
											}
											placeholder={"TypeScript experience\nUI/UX fundamentals"}
											rows={3}
										/>
									</label>
								<label className="fullWidth">
									Experience Required
									<select
										value={form.experience}
										onChange={(event) => setForm((current) => ({ ...current, experience: event.target.value }))}
									>
										{experienceOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								</label>
								{editingJobId !== null ? (
									<label className="fullWidth">
										Listing status
										<select
											value={form.status}
											onChange={(event) =>
												setForm((current) => ({ ...current, status: event.target.value as JobPostingStatus }))
											}
										>
											{statusOptions.map((s) => (
												<option key={s} value={s}>
													{s}
												</option>
											))}
										</select>
									</label>
								) : null}
							</div>

							<div className="modalActions">
								<button
									type="button"
									className="secondaryBtn"
									disabled={saving}
									onClick={() => {
										setIsModalOpen(false);
										resetForm();
									}}
								>
									Cancel
								</button>
								<button type="submit" className="primaryBtn" disabled={saving}>
									{saving ? 'Saving…' : editingJobId !== null ? 'Save Changes' : 'Post Job'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</section>
	);
}
