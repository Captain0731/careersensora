"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import './jobcard.scss';

type JobCategory = 'All' | 'Web Development' | 'Data Science' | 'AI / ML' | 'Mobile Development' | 'UI/UX Design' | 'Cyber Security';

type Job = {
	id: number;
	title: string;
	company: string;
	location: string;
	salary: string;
	workType: 'Remote' | 'Part Time' | 'Full Time' | 'Night Job';
	experience: string;
	category: Exclude<JobCategory, 'All'>;
	skills: string[];
	description: string;
	badge: string;
};

const categories: JobCategory[] = ['All', 'Web Development', 'Data Science', 'AI / ML', 'Mobile Development', 'UI/UX Design', 'Cyber Security'];

const locationOptions = ['All Locations', 'Remote', 'Ahmedabad', 'Bangalore'];
const experienceOptions = ['All Levels', 'Fresher', '1-3 Years', '3-5 Years'];
const workTypeOptions = ['All Work Types', 'Remote', 'Part Time', 'Full Time', 'Night Job'];

const jobs: Job[] = [
	{
		id: 1,
		title: 'Frontend Developer (React.js)',
		company: 'TechNova Pvt Ltd',
		location: 'Remote / Ahmedabad',
		salary: '₹6–10 LPA',
		workType: 'Remote',
		experience: '1-3 Years',
		category: 'Web Development',
		skills: ['React.js', 'Next.js', 'TypeScript', 'REST APIs'],
		description:
			'Build modern, scalable web applications using React and Next.js. Work with APIs and create responsive UI components.',
		badge: 'Featured',
	},
	{
		id: 2,
		title: 'Data Analyst',
		company: 'Insight Analytics',
		location: 'Bangalore',
		salary: '₹5–8 LPA',
		workType: 'Full Time',
		experience: 'Fresher',
		category: 'Data Science',
		skills: ['Python', 'SQL', 'Power BI', 'Excel'],
		description:
			'Analyze data trends, create dashboards, and support business decisions using actionable insights.',
		badge: 'Hiring Fast',
	},
];

export default function Jobcard() {
	const router = useRouter();
	const [activeCategory, setActiveCategory] = useState<JobCategory>('All');
	const [locationFilter, setLocationFilter] = useState('All Locations');
	const [experienceFilter, setExperienceFilter] = useState('All Levels');
	const [workTypeFilter, setWorkTypeFilter] = useState('All Work Types');

	const filteredJobs = useMemo(() => {
		return jobs.filter((job) => {
			const categoryMatch = activeCategory === 'All' || job.category === activeCategory;
			const locationMatch = locationFilter === 'All Locations' || job.location.toLowerCase().includes(locationFilter.toLowerCase());
			const experienceMatch = experienceFilter === 'All Levels' || job.experience === experienceFilter;
			const workTypeMatch = workTypeFilter === 'All Work Types' || job.workType === workTypeFilter;

			return categoryMatch && locationMatch && experienceMatch && workTypeMatch;
		});
	}, [activeCategory, experienceFilter, locationFilter, workTypeFilter]);

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
							onClick={() => setActiveCategory(category)}
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
					<p>{filteredJobs.length} jobs found</p>
					<span>Branded with Hireonix career intelligence colors</span>
				</div>

				<div className="jobGrid">
					{filteredJobs.map((job) => (
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
								<button type="button" className="detailsButton" onClick={() => router.push('/job-detail')}>
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
