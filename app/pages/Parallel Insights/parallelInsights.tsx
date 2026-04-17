"use client";

import { useEffect, useState } from 'react';
import { apiClient, ApiError } from '../../utils/apiClient';
import './parallelInsights.scss';

type DomainOption = {
	id: string;
	name: string;
	color: string;
};

type DomainComparison = {
	name: string;
	description: string;
	analysis: string;
	salary: string;
	salaryRange: number[];
	growth: string;
	growthScore: number;
	demand: string;
	demandScore: number;
	skills: string[];
	recommendation: string;
	whyRecommended: string[];
	chooseIfPrimary: string[];
	chooseIfOther: string[];
	finalSuggestion: string;
};

type ParallelInsightsConfig = {
	domains: DomainOption[];
	comparison: Record<string, DomainComparison>;
};

type CompareResult = {
	domain1: string;
	domain2: string;
	bestDomain: string;
	whyRecommended: string[];
	chooseIfDomain1: string[];
	chooseIfDomain2: string[];
	finalSuggestion: string;
	aiSummary?: string | null;
};

export default function ParallelInsights() {
	const [config, setConfig] = useState<ParallelInsightsConfig | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);

	const [domain1, setDomain1] = useState<string>('ai');
	const [domain2, setDomain2] = useState<string>('ml');
	const [showComparison, setShowComparison] = useState(false);
	const [compareLoading, setCompareLoading] = useState(false);
	const [compareError, setCompareError] = useState<string | null>(null);
	const [compareResult, setCompareResult] = useState<CompareResult | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const data = await apiClient.get<ParallelInsightsConfig>('/parallel-insights/config', { skipAuth: true });
				if (cancelled) {
					return;
				}
				setConfig(data);
				setLoadError(null);
				if (data.domains.length >= 2) {
					setDomain1(data.domains[0].id);
					setDomain2(data.domains[1].id);
				} else if (data.domains.length === 1) {
					setDomain1(data.domains[0].id);
					setDomain2(data.domains[0].id);
				}
			} catch (err) {
				if (!cancelled) {
					const msg =
						err instanceof ApiError
							? err.message
							: 'Could not load Parallel Insights. Is the API running on port 8000?';
					setLoadError(msg);
					setConfig(null);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const comparisonData = config?.comparison ?? {};
	const careerDomains = config?.domains ?? [];

	const handleCompare = async () => {
		if (domain1 !== domain2) {
			setCompareLoading(true);
			setCompareError(null);
			try {
				const result = await apiClient.post<CompareResult>(
					'/parallel-insights/compare',
					{ domain1, domain2 },
					{ skipAuth: true }
				);
				setCompareResult(result);
				setShowComparison(true);
			} catch (err) {
				const msg = err instanceof ApiError ? err.message : 'Could not compare selected domains.';
				setCompareError(msg);
			} finally {
				setCompareLoading(false);
			}
		} else {
			alert('Please select different domains to compare');
		}
	};

	const handleDownloadPDF = () => {
		window.print();
	};

	const data1 = comparisonData[domain1];
	const data2 = comparisonData[domain2];
	const chooseForDomain1: string[] = compareResult?.chooseIfDomain1 ?? data1?.chooseIfPrimary ?? [];
	const chooseForDomain2: string[] = compareResult?.chooseIfDomain2 ?? data2?.chooseIfPrimary ?? [];
	const bestDomainId = compareResult?.bestDomain;
	const bestDomainData = bestDomainId ? comparisonData[bestDomainId] : data1;

	if (loading) {
		return (
			<section className="parallelInsights">
				<div className="selectionView">
					<div className="selectionHeading">
						<h1>Parallel Career Insights</h1>
						<p>Loading comparison data…</p>
					</div>
				</div>
			</section>
		);
	}

	if (loadError || !config || !data1 || !data2) {
		return (
			<section className="parallelInsights">
				<div className="selectionView">
					<div className="selectionHeading">
						<h1>Parallel Career Insights</h1>
						<p className="parallelInsightsError">{loadError || 'No domain data available.'}</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="parallelInsights">
			{!showComparison ? (
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
						{compareLoading ? 'Comparing...' : 'Compare Now'}
					</button>
					{compareError ? <p className="parallelInsightsError">{compareError}</p> : null}
				</div>
			) : (
				<div className="comparisonView">
					<button className="backBtn" onClick={() => setShowComparison(false)}>
						← Back to Selection
					</button>

					<div className="comparisonHeader">
						<h1>Career Comparison Results</h1>
					</div>

					<div className="comparisonGrid">
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
										/>
									</div>
								</div>
							</div>

							<div className="section">
								<h3>Future Growth</h3>
								<p className="growthText">{data1.growth}</p>
								<div className="scoreBar">
									<div className="scoreFill" style={{ width: `${data1.growthScore}%` }} />
								</div>
							</div>

							<div className="section">
								<h3>Market Demand</h3>
								<p>{data1.demand}</p>
								<div className="scoreBar demandBar">
									<div className="scoreFill" style={{ width: `${data1.demandScore}%` }} />
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
										/>
									</div>
								</div>
							</div>

							<div className="section">
								<h3>Future Growth</h3>
								<p className="growthText">{data2.growth}</p>
								<div className="scoreBar">
									<div className="scoreFill" style={{ width: `${data2.growthScore}%` }} />
								</div>
							</div>

							<div className="section">
								<h3>Market Demand</h3>
								<p>{data2.demand}</p>
								<div className="scoreBar demandBar">
									<div className="scoreFill" style={{ width: `${data2.demandScore}%` }} />
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

					<div className="recommendationsSection">
						<h2>🔥 AI Recommendation</h2>
						<div className="recommendationCard singleCard">
							<h3>{bestDomainData?.name || data1.name}</h3>
							<p>{bestDomainData?.recommendation || data1.recommendation}</p>
						</div>
					</div>

					<div className="aiRecommendationSection">
						<h2>🔥 AI Recommendation (How to Choose)</h2>

						<div className="recommendationBlock">
							<h3 className="blockTitle">🟢 Best Fit for You</h3>
							<p className="blockContent">
								Based on your profile, <strong>{bestDomainData?.name || data1.name}</strong> is the better choice.
							</p>
						</div>

						<div className="recommendationBlock">
							<h3 className="blockTitle">💡 Why This is Recommended</h3>
						{compareResult?.aiSummary ? <p className="blockContent">{compareResult.aiSummary}</p> : null}
							<ul className="reasonsList">
								{(compareResult?.whyRecommended || bestDomainData?.whyRecommended || []).map((reason: string, idx: number) => (
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
							<p className="blockContent finalSuggestion">{compareResult?.finalSuggestion || bestDomainData?.finalSuggestion || data1.finalSuggestion}</p>
						</div>
					</div>

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
