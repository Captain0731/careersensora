from ninja import Schema


class JobManageCreateIn(Schema):
	title: str
	company: str
	location: str
	salary: str
	work_type: str
	experience: str
	category: str
	skills: list[str]
	description: str
	responsibilities: list[str] = []
	requirements: list[str] = []
	nice_to_have: list[str] = []
	badge: str = ""
	listing_status: str = "open"


class JobManageUpdateIn(Schema):
	title: str | None = None
	company: str | None = None
	location: str | None = None
	salary: str | None = None
	work_type: str | None = None
	experience: str | None = None
	category: str | None = None
	skills: list[str] | None = None
	description: str | None = None
	responsibilities: list[str] | None = None
	requirements: list[str] | None = None
	nice_to_have: list[str] | None = None
	badge: str | None = None
	listing_status: str | None = None


class JobOut(Schema):
	id: int
	title: str
	company: str
	location: str
	salary: str
	workType: str
	experience: str
	category: str
	skills: list[str]
	description: str
	responsibilities: list[str]
	requirements: list[str]
	niceToHave: list[str]
	badge: str


class JobListResponse(Schema):
	jobs: list[JobOut]
	count: int


class JobMetaOut(Schema):
	categories: list[str]
	locationOptions: list[str]
	experienceOptions: list[str]
	workTypeOptions: list[str]


class ApplyIn(Schema):
	job_id: int
	full_name: str
	email: str
	phone: str = ""
	message: str = ""


class ApplyOut(Schema):
	ok: bool
	application_id: int


class JobManageOut(JobOut):
	applications: int
	listingStatus: str


class JobManageListResponse(Schema):
	jobs: list[JobManageOut]
	count: int


class ResumeAnalyzeOut(Schema):
	ok: bool
	analysis_id: int
	matched: list[str]
	keywordScore: int
	skillsDepthScore: int
	resumeQualityScore: int
	overallScore: int
	eligible: bool


class ResumePageAnalyzeOut(Schema):
	ok: bool
	analysis_id: int
	score: int
	atsScore: int
	strengths: list[str]
	weaknesses: list[str]
	suggestions: list[str]
	extractedSkills: list[str]
	missingKeywords: list[str]
