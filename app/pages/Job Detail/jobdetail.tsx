"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiError, apiClient } from '../../utils/apiClient';
import './jobdetail.scss';

type JobDetail = {
	id: string;
	title: string;
	company: string;
	location: string;
	salary: string;
	experience: string;
	skills: string[];
	description: string;
	responsibilities: string[];
	requirements: string[];
	niceToHave: string[];
};

const DEFAULT_JOB_ID = '';

export default function Jobdetail() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [job, setJob] = useState<JobDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const jobId = useMemo(() => {
		const raw = searchParams.get('id');
		return raw || DEFAULT_JOB_ID;
	}, [searchParams]);

	useEffect(() => {
		let ignore = false;

		const loadJobDetail = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await apiClient.get<JobDetail>(`/jobs/${jobId}`, { skipAuth: true });
				if (!ignore) {
					setJob(data);
				}
			} catch (err) {
				if (ignore) {
					return;
				}
				const message =
					err instanceof ApiError
						? err.message
						: err instanceof Error
							? err.message
							: 'Unable to load job details.';
				setError(message);
				setJob(null);
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		};

		loadJobDetail();

		return () => {
			ignore = true;
		};
	}, [jobId]);

	if (loading) {
		return (
			<main className="jobDetailPage">
				<section className="jobDetailCard" aria-label="Job details">
					<p className="headingKicker">Job Detail</p>
					<h1>Loading job details...</h1>
				</section>
			</main>
		);
	}

	if (!job || error) {
		return (
			<main className="jobDetailPage">
				<section className="jobDetailCard" aria-label="Job details">
					<p className="headingKicker">Job Detail</p>
					<h1>Job not available</h1>
					<p className="companyName">{error ?? 'No job found for this id.'}</p>
					<button type="button" className="applyButton" onClick={() => router.push('/job-apply')}>
						Back to jobs
					</button>
				</section>
			</main>
		);
	}

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
					{job.skills.map((tag) => (
						<span key={tag}>{tag}</span>
					))}
				</div>

				<section className="contentSection" aria-label="Job description">
					<h2>Job Description</h2>
					<p className="descriptionText">{job.description || 'Description not added by recruiter yet.'}</p>

					<div className="listBlock">
						<h3>Responsibilities:</h3>
						<ul>
							{job.responsibilities.length > 0 ? job.responsibilities.map((item) => (
								<li key={item}>{item}</li>
							)) : <li>Not added by recruiter yet.</li>}
						</ul>
					</div>

					<div className="listBlock">
						<h3>Requirements:</h3>
						<ul>
							{job.requirements.length > 0 ? job.requirements.map((item) => (
								<li key={item}>{item}</li>
							)) : <li>Not added by recruiter yet.</li>}
						</ul>
					</div>

					<div className="listBlock">
						<h3>Nice to Have:</h3>
						<ul>
							{job.niceToHave.length > 0 ? job.niceToHave.map((item) => (
								<li key={item}>{item}</li>
							)) : <li>Not added by recruiter yet.</li>}
						</ul>
					</div>
				</section>

				<section className="applySection" aria-label="Apply section">
					<div className="experienceBox">
						<p>Experience Required</p>
						<strong>{job.experience}</strong>
					</div>

					<button
						type="button"
						className="applyButton"
						onClick={() => router.push(`/job-application?jobId=${job.id}`)}
					>
						Apply Now
					</button>
				</section>
			</section>
		</main>
	);
}
