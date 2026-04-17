"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../../utils/apiClient';
import './jobcard.scss';

type JobCategory =
	| 'All'
	| 'Web Development'
	| 'Data Science'
	| 'AI / ML'
	| 'Mobile Development'
	| 'UI/UX Design'
	| 'Cyber Security';

type Job = {
	id: number;
	title: string;
	company: string;
	location: string;
	salary: string;
	workType: string;
	experience: string;
	category: Exclude<JobCategory, 'All'>;
	skills: string[];
	description: string;
	badge: string;
};

const defaultCategories: JobCategory[] = [
	'All',
	'Web Development',
	'Data Science',
	'AI / ML',
	'Mobile Development',
	'UI/UX Design',
	'Cyber Security',
];

const defaultLocationOptions = ['All Locations', 'Remote', 'Ahmedabad', 'Bangalore'];
const defaultExperienceOptions = ['All Levels', 'Fresher', '1-3 Years', '3-5 Years', '3+ Years'];
const defaultWorkTypeOptions = ['All Work Types', 'Remote', 'Part Time', 'Full Time', 'Night Job', 'Contract', 'Internship'];

const ALL_LOCATIONS = 'All Locations';
const ALL_LEVELS = 'All Levels';
const ALL_WORK_TYPES = 'All Work Types';

export default function Jobcard() {
	const router = useRouter();
	const [categories, setCategories] = useState<JobCategory[]>(defaultCategories);
	const [locationOptions, setLocationOptions] = useState(defaultLocationOptions);
	const [experienceOptions, setExperienceOptions] = useState(defaultExperienceOptions);
	const [workTypeOptions, setWorkTypeOptions] = useState(defaultWorkTypeOptions);

	const [jobs, setJobs] = useState<Job[]>([]);
	const [listLoading, setListLoading] = useState(true);
	const [listError, setListError] = useState<string | null>(null);

	const [activeCategory, setActiveCategory] = useState<JobCategory>('All');
	const [locationFilter, setLocationFilter] = useState(ALL_LOCATIONS);
	const [experienceFilter, setExperienceFilter] = useState(ALL_LEVELS);
	const [workTypeFilter, setWorkTypeFilter] = useState(ALL_WORK_TYPES);

	const loadMeta = useCallback(async () => {
		try {
			const meta = await apiClient.get<{
				categories: string[];
				locationOptions: string[];
				experienceOptions: string[];
				workTypeOptions: string[];
			}>('/jobs/meta', { skipAuth: true });
			if (meta.categories?.length) {
				setCategories(meta.categories as JobCategory[]);
			}
			if (meta.locationOptions?.length) {
				setLocationOptions(meta.locationOptions);
			}
			if (meta.experienceOptions?.length) {
				setExperienceOptions(meta.experienceOptions);
			}
			if (meta.workTypeOptions?.length) {
				setWorkTypeOptions(meta.workTypeOptions);
			}
		} catch {
			/* keep defaults */
		}
	}, []);

	const loadJobs = useCallback(async () => {
		setListLoading(true);
		setListError(null);
		try {
			const params = new URLSearchParams();
			if (activeCategory !== 'All') {
				params.set('category', activeCategory);
			}
			if (locationFilter !== ALL_LOCATIONS) {
				params.set('location', locationFilter);
			}
			if (experienceFilter !== ALL_LEVELS) {
				params.set('experience', experienceFilter);
			}
			if (workTypeFilter !== ALL_WORK_TYPES) {
				params.set('work_type', workTypeFilter);
			}
			const qs = params.toString();
			const res = await apiClient.get<{ jobs: Job[]; count: number }>(qs ? `/jobs/?${qs}` : '/jobs/', {
				skipAuth: true,
			});
			setJobs(res.jobs as Job[]);
		} catch (err) {
			const msg =
				err instanceof ApiError
					? err.message
					: `${err instanceof Error ? err.message : 'Network error'} — start Django (\`py manage.py runserver 8000\`) and restart Next dev.`;
			setListError(msg);
			setJobs([]);
		} finally {
			setListLoading(false);
		}
	}, [activeCategory, experienceFilter, locationFilter, workTypeFilter]);

	useEffect(() => {
		loadMeta();
	}, [loadMeta]);

	useEffect(() => {
		loadJobs();
	}, [loadJobs]);

	const filteredJobs = useMemo(() => jobs, [jobs]);

	const resultsSummary = useMemo(() => {
		if (listLoading) {
			return '…';
		}
		const n = filteredJobs.length;
		const allFilters =
			activeCategory === 'All' &&
			locationFilter === ALL_LOCATIONS &&
			experienceFilter === ALL_LEVELS &&
			workTypeFilter === ALL_WORK_TYPES;
		if (allFilters) {
			return n === 1 ? '1 open job — all listings' : `${n} open jobs — all listings`;
		}
		return n === 1 ? '1 job found' : `${n} jobs found`;
	}, [
		listLoading,
		filteredJobs.length,
		activeCategory,
		locationFilter,
		experienceFilter,
		workTypeFilter,
	]);

	const selectCategory = (category: JobCategory) => {
		setActiveCategory(category);
		if (category === 'All') {
			setLocationFilter(ALL_LOCATIONS);
			setExperienceFilter(ALL_LEVELS);
			setWorkTypeFilter(ALL_WORK_TYPES);
		}
	};

	return (
		<main className="jobApplyPage">
			<section className="jobHero">
				<p className="eyebrow">Hireonix Job Apply</p>
				<h1>Explore Career Opportunities</h1>
				<p className="heroCopy">Find jobs that fit your skills and start your career journey today.</p>
			</section>

			<section className="filtersPanel" aria-label="Job filters">
				<div className="categoryTabs" role="tablist" aria-label="Job categories">
					{categories.map((category) => (
						<button
							key={category}
							type="button"
							className={`tabButton ${activeCategory === category ? 'active' : ''}`}
							onClick={() => selectCategory(category)}
						>
							{category}
						</button>
					))}
				</div>

				<div className="dropdownFilters">
					<label>
						<span>Location</span>
						<select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
							{locationOptions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</label>

					<label>
						<span>Experience Level</span>
						<select value={experienceFilter} onChange={(event) => setExperienceFilter(event.target.value)}>
							{experienceOptions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</label>

					<label>
						<span>Work Type</span>
						<select value={workTypeFilter} onChange={(event) => setWorkTypeFilter(event.target.value)}>
							{workTypeOptions.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</label>
				</div>
			</section>

			<section className="cardsSection" aria-label="Job listings">
				<div className="resultsHeader">
					<p>{resultsSummary}</p>
					<span>Branded with Hireonix career intelligence colors</span>
				</div>
				{listError ? <p className="jobListError">{listError}</p> : null}

				<div className="jobGrid">
					{!listLoading &&
						filteredJobs.map((job) => (
							<article key={job.id} className="jobCard">
								<div className="jobCardTop">
									<span className="jobBadge">{job.badge}</span>
									<span className="jobCategory">{job.category}</span>
								</div>

								<h2>{job.title}</h2>
								<p className="companyName">{job.company}</p>

								<div className="metaRow">
									<span>{job.location}</span>
									<span>{job.salary}</span>
								</div>

								<div className="skillsRow">
									{job.skills.map((skill) => (
										<span key={skill}>{skill}</span>
									))}
								</div>

								<p className="description">{job.description}</p>

								<div className="cardActions">
									<button
										type="button"
										className="detailsButton"
										onClick={() => router.push(`/job-detail?id=${job.id}`)}
									>
										View More
									</button>
								</div>
							</article>
						))}
				</div>
			</section>
		</main>
	);
}
