from ninja import Schema


class DomainOptionOut(Schema):
	id: str
	name: str
	color: str


class DomainComparisonOut(Schema):
	name: str
	description: str
	analysis: str
	salary: str
	salaryRange: list[int]
	growth: str
	growthScore: int
	demand: str
	demandScore: int
	skills: list[str]
	recommendation: str
	whyRecommended: list[str]
	chooseIfPrimary: list[str]
	chooseIfOther: list[str]
	finalSuggestion: str


class ParallelInsightsConfigOut(Schema):
	domains: list[DomainOptionOut]
	comparison: dict[str, DomainComparisonOut]


class ParallelInsightsCompareIn(Schema):
	domain1: str
	domain2: str


class ParallelInsightsCompareOut(Schema):
	domain1: str
	domain2: str
	bestDomain: str
	whyRecommended: list[str]
	chooseIfDomain1: list[str]
	chooseIfDomain2: list[str]
	finalSuggestion: str
	aiSummary: str | None = None
