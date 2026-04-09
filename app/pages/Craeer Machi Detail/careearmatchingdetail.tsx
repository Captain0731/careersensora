"use client";

import './careermatchingdetails.scss';

type CareerDetail = {
	id: string;
	title: string;
	matchScore: number;
	successProbability: number;
	selectedSkills: string[];
	salaryInsight: string;
	growthPotential: string;
	jobAvailability: string;
	availabilityHint: string;
	nextSkills: string[];
	learningSpeed: string;
	improvementRate: string;
	successFactors: string[];
	missingSkills: string[];
};

const careerDetails: CareerDetail[] = [
	{
		id: 'fullstack',
		title: 'Full Stack Developer',
		matchScore: 87,
		successProbability: 78,
		selectedSkills: ['React.js', 'JavaScript', 'HTML/CSS'],
		salaryInsight: '₹8–15 LPA',
		growthPotential: 'High',
		jobAvailability: 'High Demand',
		availabilityHint: 'Number of openings increasing',
		nextSkills: ['Node.js', 'System Design', 'Database Management'],
		learningSpeed: 'Fast',
		improvementRate: '+20% potential',
		successFactors: ['Skills', 'Interest', 'Market demand'],
		missingSkills: ['Backend Development', 'API Integration', 'Deployment'],
	},
	{
		id: 'frontend',
		title: 'Frontend Engineer',
		matchScore: 84,
		successProbability: 75,
		selectedSkills: ['React.js', 'TypeScript', 'Responsive UI'],
		salaryInsight: '₹7–13 LPA',
		growthPotential: 'High',
		jobAvailability: 'High Demand',
		availabilityHint: 'Remote opportunities are growing',
		nextSkills: ['Accessibility', 'Performance Optimization', 'Testing'],
		learningSpeed: 'Fast',
		improvementRate: '+18% potential',
		successFactors: ['Skills', 'Interest', 'Portfolio quality'],
		missingSkills: ['Advanced testing', 'Architecture patterns', 'SEO optimization'],
	},
	{
		id: 'product-designer',
		title: 'UI/UX Product Designer',
		matchScore: 72,
		successProbability: 69,
		selectedSkills: ['Design Systems', 'Figma', 'User Flows'],
		salaryInsight: '₹6–12 LPA',
		growthPotential: 'Medium to High',
		jobAvailability: 'Steady Demand',
		availabilityHint: 'Openings rising in product-led teams',
		nextSkills: ['UX Research', 'Interaction Design', 'Design Strategy'],
		learningSpeed: 'Moderate',
		improvementRate: '+16% potential',
		successFactors: ['User empathy', 'Design execution', 'Product understanding'],
		missingSkills: ['Research depth', 'Analytics interpretation', 'Cross-team communication'],
	},
	{
		id: 'data-analyst',
		title: 'Data Analyst',
		matchScore: 66,
		successProbability: 64,
		selectedSkills: ['SQL Basics', 'Data Visualization', 'Python'],
		salaryInsight: '₹5–10 LPA',
		growthPotential: 'Medium',
		jobAvailability: 'Growing Demand',
		availabilityHint: 'Analytics roles expanding across industries',
		nextSkills: ['Advanced SQL', 'Dashboard Storytelling', 'Business Analytics'],
		learningSpeed: 'Moderate',
		improvementRate: '+14% potential',
		successFactors: ['Data skills', 'Business context', 'Communication'],
		missingSkills: ['Statistical modeling', 'Data cleaning depth', 'Domain specialization'],
	},
];

type CareerMatchingDetailProps = {
	selectedCareerId?: string;
};

export default function CareerMatchingDetail({ selectedCareerId = 'fullstack' }: CareerMatchingDetailProps) {
	const detail = careerDetails.find((item) => item.id === selectedCareerId) ?? careerDetails[0];

	const downloadReport = () => {
		window.print();
	};

	return (
		<main className="careerDetailPage">
			<section className="detailHero">
				<p className="detailKicker">AI Career Analysis Dashboard</p>
				<h1>Career Analysis: {detail.title}</h1>
				<p>Detailed insights based on your profile and AI analysis.</p>
			</section>

			<section className="scorePanel">
				<div className="ringWrap" aria-label="Match score visualization">
					<div className="scoreRing" style={{ ['--score' as string]: detail.matchScore }}>
						<span>{detail.matchScore}%</span>
						<small>Match Score</small>
					</div>
				</div>
				<div className="scoreMeta">
					<div>
						<strong>Match Score</strong>
						<p>{detail.matchScore}%</p>
					</div>
					<div>
						<strong>Success Probability</strong>
						<p>{detail.successProbability}%</p>
					</div>
					<div className="progressRow" aria-label="Success probability bar">
						<span>Success Track</span>
						<div className="progressTrack">
							<div style={{ width: `${detail.successProbability}%` }} />
						</div>
					</div>
				</div>
			</section>

			<section className="detailGrid">
				<article className="detailCard">
					<h2>Selected Skills</h2>
					<ul className="pillList">
						{detail.selectedSkills.map((skill) => (
							<li key={skill}>{skill}</li>
						))}
					</ul>
				</article>

				<article className="detailCard">
					<h2>Salary Insights</h2>
					<p><strong>Average Salary:</strong> {detail.salaryInsight}</p>
					<p><strong>Growth Potential:</strong> {detail.growthPotential}</p>
				</article>

				<article className="detailCard">
					<h2>Job Availability</h2>
					<p><strong>{detail.jobAvailability}</strong></p>
					<p>{detail.availabilityHint}</p>
				</article>

				<article className="detailCard">
					<h2>Next Best Skills to Learn</h2>
					<ul className="bulletList">
						{detail.nextSkills.map((skill) => (
							<li key={skill}>{skill}</li>
						))}
					</ul>
				</article>

				<article className="detailCard">
					<h2>Skill-Based Improvement Rate</h2>
					<p><strong>Learning Speed:</strong> {detail.learningSpeed}</p>
					<p><strong>Improvement Rate:</strong> {detail.improvementRate}</p>
				</article>

				<article className="detailCard">
					<h2>Success Probability</h2>
					<p>{detail.successProbability}% chance of success in this field</p>
					<p><strong>Based on:</strong></p>
					<ul className="bulletList">
						{detail.successFactors.map((factor) => (
							<li key={factor}>{factor}</li>
						))}
					</ul>
				</article>

				<article className="detailCard fullWidth">
					<h2>Missing Skills</h2>
					<ul className="pillList warning">
						{detail.missingSkills.map((skill) => (
							<li key={skill}>{skill}</li>
						))}
					</ul>
				</article>
			</section>

			<section className="downloadSection">
				<button type="button" className="downloadBtn" onClick={downloadReport}>
					Download Report
				</button>
				<p>The report includes full analysis, scores, skills, and recommendations. The print dialog lets you save as PDF.</p>
			</section>
		</main>
	);
}
