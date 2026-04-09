"use client";
import { useState } from 'react';
import './parallelInsights.scss';

// Career domain data
const careerDomains = [
	{ id: 'ai', name: 'Artificial Intelligence', color: '#FF6B6B' },
	{ id: 'ml', name: 'Machine Learning', color: '#4ECDC4' },
	{ id: 'ds', name: 'Data Science', color: '#45B7D1' },
	{ id: 'web', name: 'Web Development', color: '#96CEB4' },
	{ id: 'fullstack', name: 'Full Stack Development', color: '#FFEAA7' },
	{ id: 'cybersec', name: 'Cyber Security', color: '#DDA0DD' },
];

const comparisonData: Record<string, any> = {
	ai: {
		name: 'Artificial Intelligence',
		description: 'Focus on intelligent systems, automation, NLP, robotics, and advanced problem-solving',
		analysis: 'Broad field requiring strong fundamentals in algorithms, mathematics, and programming',
		salary: '₹10–25 LPA',
		salaryRange: [10, 25],
		growth: 'Extremely High 🚀',
		growthScore: 95,
		demand: 'Rapidly increasing with high competition',
		demandScore: 90,
		skills: ['Python', 'Deep Learning', 'NLP', 'Computer Vision', 'Neural Networks', 'TensorFlow/PyTorch'],
		recommendation: 'AI is better suited if you are interested in innovation, broad applications, and cutting-edge technology.',
		whyRecommended: [
			'Matches your skills in Python & problem solving',
			'Aligns with your interest in innovation and advanced technologies',
			'Higher long-term growth potential',
			'Strong market demand with premium salaries'
		],
		chooseIfAI: [
			'You enjoy innovation, research, and building intelligent systems',
			'You want high growth and future opportunities',
			'You are comfortable with complex concepts (Deep Learning, NLP)',
			'You aim for cutting-edge technology roles'
		],
		chooseIfOther: [
			'You prefer data analysis and predictive modeling',
			'You like working with algorithms and structured data',
			'You want a focused and practical career path'
		],
		finalSuggestion: 'Based on your current profile, AI is the best career path for you. With strong fundamentals and passion for innovation, you can excel in this field.',
	},
	ml: {
		name: 'Machine Learning',
		description: 'Focus on data-driven models, predictive systems, and algorithm optimization',
		analysis: 'Specialized subset with more focused approach on algorithms and statistical methods',
		salary: '₹8–20 LPA',
		salaryRange: [8, 20],
		growth: 'Very High 📊',
		growthScore: 85,
		demand: 'High and stable across industries',
		demandScore: 85,
		skills: ['Python', 'Statistics', 'Algorithms', 'Data Analysis', 'Scikit-learn', 'Pandas'],
		recommendation: 'ML is better if you prefer focused data-driven modeling with clear, measurable outcomes.',
		whyRecommended: [
			'Strong alignment with data analysis interests',
			'Practical and focused career path',
			'High demand across industries',
			'Clear progression and measurable outcomes'
		],
		chooseIfML: [
			'You prefer data analysis and predictive modeling',
			'You like working with algorithms and structured data',
			'You want a focused and practical career path',
			'You value measurable and concrete results'
		],
		chooseIfOther: [
			'You enjoy innovation and research',
			'You want to work on broad intelligent systems',
			'You are interested in cutting-edge technologies'
		],
		finalSuggestion: 'Machine Learning offers a balanced path combining innovation with practical application. Ideal for those who want to see immediate impact of their work.',
	},
	ds: {
		name: 'Data Science',
		description: 'Transform raw data into actionable insights using analytics and visualization',
		analysis: 'Blend of statistics, programming, and domain knowledge for business intelligence',
		salary: '₹9–22 LPA',
		salaryRange: [9, 22],
		growth: 'Very High 📈',
		growthScore: 88,
		demand: 'Consistently high across all sectors',
		demandScore: 87,
		skills: ['Python', 'SQL', 'Statistics', 'Tableau/PowerBI', 'Excel', 'A/B Testing'],
		recommendation: 'Data Science is ideal if you enjoy working with large datasets and deriving business insights.',
		whyRecommended: [
			'Excellent for analytical minds',
			'High demand across all industries',
			'Direct impact on business decisions',
			'Growing opportunities in AI/ML integration'
		],
		chooseIfDS: [
			'You enjoy working with large datasets',
			'You want to derive business insights from data',
			'You prefer analytical and visualization work',
			'You enjoy storytelling with data'
		],
		chooseIfOther: [
			'You want to build intelligent systems',
			'You prefer development over analysis',
			'You\'re interested in cutting-edge research'
		],
		finalSuggestion: 'Data Science is perfect if you want to influence business strategy through analysis. Combines analytical rigor with business impact and creativity.',
	},
	web: {
		name: 'Web Development',
		description: 'Build user-facing applications and interfaces for web platforms',
		analysis: 'Fast-paced field focused on UI/UX, responsive design, and client-side technologies',
		salary: '₹5–18 LPA',
		salaryRange: [5, 18],
		growth: 'High and Stable 📱',
		growthScore: 75,
		demand: 'Consistent demand with evolving standards',
		demandScore: 80,
		skills: ['JavaScript/TypeScript', 'React/Vue', 'HTML/CSS', 'Node.js', 'Git', 'Responsive Design'],
		recommendation: 'Web Development suits you if you enjoy creating user experiences and seeing immediate results.',
		whyRecommended: [
			'High demand and consistent opportunities',
			'Immediate visual feedback on your work',
			'Fast-paced learning environment',
			'Strong community and resources'
		],
		chooseIfWeb: [
			'You enjoy creating user experiences',
			'You want to see immediate results',
			'You prefer visual and creative work',
			'You enjoy collaborative development'
		],
		chooseIfOther: [
			'You prefer backend systems and logic',
			'You want to work on intelligent systems',
			'You are interested in data analysis'
		],
		finalSuggestion: 'Web Development is ideal if you love creating interactive experiences. Perfect entry point into tech with continuous learning opportunities.',
	},
	fullstack: {
		name: 'Full Stack Development',
		description: 'Master both frontend and backend technologies for complete application development',
		analysis: 'Comprehensive approach requiring expertise across multiple layers of technology stack',
		salary: '₹7–22 LPA',
		salaryRange: [7, 22],
		growth: 'Very High 🚀',
		growthScore: 86,
		demand: 'Extremely high across startups and enterprises',
		demandScore: 92,
		skills: ['JavaScript/TypeScript', 'React', 'Node.js', 'Databases', 'APIs', 'DevOps Basics'],
		recommendation: 'Full Stack is perfect if you want versatility and the ability to own projects end-to-end.',
		whyRecommended: [
			'Extremely high market demand',
			'Full ownership of product features',
			'Better salary prospects',
			'Versatile across industries'
		],
		chooseIfFullstack: [
			'You want complete control over projects',
			'You prefer end-to-end development',
			'You enjoy learning diverse technologies',
			'You aspire to leadership roles'
		],
		chooseIfOther: [
			'You prefer specialization over generalization',
			'You want to focus on specific areas',
			'You prefer deeper expertise in one area'
		],
		finalSuggestion: 'Full Stack Development offers maximum flexibility and growth. Best for ambitious developers who want to own entire features and lead projects.',
	},
	cybersec: {
		name: 'Cyber Security',
		description: 'Protect systems, networks, and data from security threats and vulnerabilities',
		analysis: 'Specialized field with growing importance in digital transformation and compliance',
		salary: '₹8–24 LPA',
		salaryRange: [8, 24],
		growth: 'Extremely High 🔒',
		growthScore: 93,
		demand: 'Rapidly increasing with critical need',
		demandScore: 91,
		skills: ['Network Security', 'Ethical Hacking', 'Linux/Windows', 'Python', 'Cryptography', 'Security Tools'],
		recommendation: "Cyber Security is ideal if you're passionate about protecting systems and preventing attacks.",
		whyRecommended: [
			'Critical and growing field globally',
			'Highest growth trajectory in tech',
			'Well-compensated roles',
			'Meaningful work protecting systems'
		],
		chooseIfCybersec: [
			'You\'re passionate about protecting systems',
			'You enjoy problem-solving and investigation',
			'You want to work in a critical field',
			'You prefer security and compliance focus'
		],
		chooseIfOther: [
			'You prefer development and building',
			'You want user-facing work',
			'You prefer data analysis'
		],
		finalSuggestion: 'Cyber Security is ideal for those passionate about protection and defense. Offers critical role in digital transformation with premium compensation.',
	},
};

export default function ParallelInsights() {
	const [domain1, setDomain1] = useState<string>('ai');
	const [domain2, setDomain2] = useState<string>('ml');
	const [showComparison, setShowComparison] = useState(false);

	const handleCompare = () => {
		if (domain1 !== domain2) {
			setShowComparison(true);
		} else {
			alert('Please select different domains to compare');
		}
	};

	const handleDownloadPDF = () => {
		window.print();
	};

	const data1 = comparisonData[domain1];
	const data2 = comparisonData[domain2];
	const chooseIfKeyByDomain: Record<string, string> = {
		ai: 'chooseIfAI',
		ml: 'chooseIfML',
		ds: 'chooseIfDS',
		web: 'chooseIfWeb',
		fullstack: 'chooseIfFullstack',
		cybersec: 'chooseIfCybersec',
	};
	const chooseForDomain1: string[] = data1?.[chooseIfKeyByDomain[domain1]] ?? [];
	const chooseForDomain2: string[] = data2?.[chooseIfKeyByDomain[domain2]] ?? [];

	return (
		<section className="parallelInsights">
			{!showComparison ? (
				// Selection View
				<div className="selectionView">
					<div className="selectionHeading">
						<h1>Parallel Career Insights</h1>
						<p>Compare different career paths and choose the best one based on data and AI analysis</p>
					</div>

					<div className="domainSelectors">
						<div className="selectorGroup">
							<label htmlFor="domain1">Select Domain 1</label>
							<select id="domain1" value={domain1} onChange={(e) => setDomain1(e.target.value)}>
								{careerDomains.map((domain) => (
									<option key={domain.id} value={domain.id}>
										{domain.name}
									</option>
								))}
							</select>
						</div>

						<div className="selectorGroup">
							<label htmlFor="domain2">Select Domain 2</label>
							<select id="domain2" value={domain2} onChange={(e) => setDomain2(e.target.value)}>
								{careerDomains.map((domain) => (
									<option key={domain.id} value={domain.id}>
										{domain.name}
									</option>
								))}
							</select>
						</div>
					</div>

					<button className="compareBtn" onClick={handleCompare}>
						Compare Now
					</button>
				</div>
			) : (
				// Comparison Results View
				<div className="comparisonView">
					<button className="backBtn" onClick={() => setShowComparison(false)}>
						← Back to Selection
					</button>

					<div className="comparisonHeader">
						<h1>Career Comparison Results</h1>
					</div>

					<div className="comparisonGrid">
						{/* Domain 1 */}
						<div className="domainCard domain1">
							<h2>{data1.name}</h2>

							<div className="section">
								<h3>Career Path Description</h3>
								<p>{data1.description}</p>
							</div>

							<div className="section">
								<h3>Analysis</h3>
								<p>{data1.analysis}</p>
							</div>

							<div className="section">
								<h3>Salary Comparison</h3>
								<div className="salaryBox">
									<p className="salaryText">{data1.salary}</p>
									<div className="salaryBar">
										<div 
											className="salaryFill" 
											style={{ width: `${(data1.salaryRange[1] / 30) * 100}%` }}
										></div>
									</div>
								</div>
							</div>

							<div className="section">
								<h3>Future Growth</h3>
								<p className="growthText">{data1.growth}</p>
								<div className="scoreBar">
									<div className="scoreFill" style={{ width: `${data1.growthScore}%` }}></div>
								</div>
							</div>

							<div className="section">
								<h3>Market Demand</h3>
								<p>{data1.demand}</p>
								<div className="scoreBar demandBar">
									<div className="scoreFill" style={{ width: `${data1.demandScore}%` }}></div>
								</div>
							</div>

							<div className="section">
								<h3>Required Skills</h3>
								<div className="skillsList">
									{data1.skills.map((skill: string) => (
										<span key={skill} className="skillPill">
											{skill}
										</span>
									))}
								</div>
							</div>
						</div>

						{/* Domain 2 */}
						<div className="domainCard domain2">
							<h2>{data2.name}</h2>

							<div className="section">
								<h3>Career Path Description</h3>
								<p>{data2.description}</p>
							</div>

							<div className="section">
								<h3>Analysis</h3>
								<p>{data2.analysis}</p>
							</div>

							<div className="section">
								<h3>Salary Comparison</h3>
								<div className="salaryBox">
									<p className="salaryText">{data2.salary}</p>
									<div className="salaryBar">
										<div 
											className="salaryFill" 
											style={{ width: `${(data2.salaryRange[1] / 30) * 100}%` }}
										></div>
									</div>
								</div>
							</div>

							<div className="section">
								<h3>Future Growth</h3>
								<p className="growthText">{data2.growth}</p>
								<div className="scoreBar">
									<div className="scoreFill" style={{ width: `${data2.growthScore}%` }}></div>
								</div>
							</div>

							<div className="section">
								<h3>Market Demand</h3>
								<p>{data2.demand}</p>
								<div className="scoreBar demandBar">
									<div className="scoreFill" style={{ width: `${data2.demandScore}%` }}></div>
								</div>
							</div>

							<div className="section">
								<h3>Required Skills</h3>
								<div className="skillsList">
									{data2.skills.map((skill: string) => (
										<span key={skill} className="skillPill">
											{skill}
										</span>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* AI Recommendations */}
					<div className="recommendationsSection">
						<h2>🔥 AI Recommendation</h2>
						<div className="recommendationCard singleCard">
							<h3>{data1.name}</h3>
							<p>{data1.recommendation}</p>
						</div>
					</div>

					{/* AI Recommendation */}
					<div className="aiRecommendationSection">
						<h2>🔥 AI Recommendation (How to Choose)</h2>

						<div className="recommendationBlock">
							<h3 className="blockTitle">🟢 Best Fit for You</h3>
							<p className="blockContent">
								Based on your profile, <strong>{data1.name}</strong> is the better choice.
							</p>
						</div>

						<div className="recommendationBlock">
							<h3 className="blockTitle">💡 Why This is Recommended</h3>
							<ul className="reasonsList">
								{data1.whyRecommended?.map((reason: string, idx: number) => (
									<li key={idx}>{reason}</li>
								))}
							</ul>
						</div>

						<div className="recommendationBlock">
							<h3 className="blockTitle">⚖️ When to Choose Each Domain</h3>
							<div className="chooseGrid">
								<div className="chooseCard">
									<h4>🤖 Choose {data1.name} if:</h4>
									<ul className="chooseList">
										{chooseForDomain1.map((item: string, idx: number) => (
											<li key={idx}>{item}</li>
										))}
									</ul>
								</div>
								<div className="chooseCard">
									<h4>📊 Choose {data2.name} if:</h4>
									<ul className="chooseList">
										{chooseForDomain2.map((item: string, idx: number) => (
											<li key={idx}>{item}</li>
										))}
									</ul>
								</div>
							</div>
						</div>

						<div className="recommendationBlock finalBlock">
							<h3 className="blockTitle">🎯 Final Suggestion</h3>
							<p className="blockContent finalSuggestion">
								{data1.finalSuggestion}
							</p>
						</div>
					</div>

					{/* Download Section */}
					<div className="downloadSection">
						<button className="downloadBtn" onClick={handleDownloadPDF}>
							📥 Download Full Report (PDF)
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
