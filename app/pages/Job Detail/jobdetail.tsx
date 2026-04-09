"use client";

import { useRouter } from 'next/navigation';
import './jobdetail.scss';

const job = {
	title: 'Frontend Developer (React.js)',
	company: 'TechNova Pvt Ltd',
	location: 'Remote / Ahmedabad',
	salary: '₹6–10 LPA',
	experience: '1–3 Years',
	tags: ['React.js', 'Next.js', 'TypeScript', 'REST APIs'],
	responsibilities: [
		'Build modern, scalable web applications using React.js and Next.js',
		'Develop reusable UI components',
		'Integrate REST APIs',
		'Optimize performance and responsiveness',
	],
	requirements: [
		'Strong knowledge of JavaScript and React.js',
		'Experience with Next.js',
		'Understanding of API integration',
		'Basic knowledge of Git',
	],
	niceToHave: [
		'Experience with TypeScript',
		'Knowledge of UI/UX principles',
	],
};

export default function Jobdetail() {
	const router = useRouter();

	return (
		<main className="jobDetailPage">
			<section className="jobDetailCard" aria-label="Job details">
				<header className="jobDetailHeader">
					<p className="headingKicker">Job Detail</p>
					<h1>{job.title}</h1>
					<p className="companyName">{job.company}</p>

					<div className="metaRow">
						<span>{job.location}</span>
						<span>{job.salary}</span>
					</div>
				</header>

				<div className="tagsRow" aria-label="Job skills">
					{job.tags.map((tag) => (
						<span key={tag}>{tag}</span>
					))}
				</div>

				<section className="contentSection" aria-label="Job description">
					<h2>Job Description</h2>

					<div className="listBlock">
						<h3>Responsibilities:</h3>
						<ul>
							{job.responsibilities.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>

					<div className="listBlock">
						<h3>Requirements:</h3>
						<ul>
							{job.requirements.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>

					<div className="listBlock">
						<h3>Nice to Have:</h3>
						<ul>
							{job.niceToHave.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</div>
				</section>

				<section className="applySection" aria-label="Apply section">
					<div className="experienceBox">
						<p>Experience Required</p>
						<strong>{job.experience}</strong>
					</div>

					<button type="button" className="applyButton" onClick={() => router.push('/job-application')}>
						Apply Now
					</button>
				</section>
			</section>
		</main>
	);
}
