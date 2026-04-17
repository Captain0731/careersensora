from ninja import Schema


class InterestOut(Schema):
	id: str


class CareerPathOut(Schema):
	id: str
	title: str
	summary: str
	skillMatches: list[str]
	interestMatches: list[str]
	bestFor: list[str]
	roadmap: list[str]


class CareerMapperConfigOut(Schema):
	base_skills: list[str]
	interests: list[InterestOut]
	experience_levels: list[str]
	career_paths: list[CareerPathOut]


class AddSkillIn(Schema):
	name: str


class SkillSavedOut(Schema):
	name: str
	created: bool


class CareerMapperGenerateIn(Schema):
	skills: list[str]
	interests: list[str]
	experienceLevel: str


class CareerMapperMatchOut(Schema):
	id: str
	title: str
	level: str
	score: int
	fitReason: str
	roadmapHint: str
	languageChoice: str
	matchScore: int
	successProbability: int
	successTrack: str
	salaryInsights: str
	jobAvailability: str
	nextBestSkillsToLearn: list[str]
	skillBasedImprovementRate: str
	missingSkills: list[str]


class CareerMapperGenerateOut(Schema):
	matches: list[CareerMapperMatchOut]


class CareerMapperDetailIn(Schema):
	skills: list[str]
	interests: list[str]
	experienceLevel: str
	careerId: str
	title: str
	matchScore: int | None = None
	successProbability: int | None = None
	fitReason: str | None = None
	roadmapHint: str | None = None
	nextBestSkillsToLearn: list[str] | None = None
	missingSkills: list[str] | None = None
	languageChoice: str | None = None


class CareerMapperDetailOut(Schema):
	id: str
	title: str
	matchScore: int
	successProbability: int
	selectedSkills: list[str]
	salaryInsight: str
	growthPotential: str
	jobAvailability: str
	availabilityHint: str
	nextSkills: list[str]
	learningSpeed: str
	improvementRate: str
	successFactors: list[str]
	missingSkills: list[str]
