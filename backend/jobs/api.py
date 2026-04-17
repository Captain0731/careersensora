import json

from django.db.models import Count
from django.shortcuts import get_object_or_404
from ninja import File, Form, Query, Router
from ninja.errors import HttpError
from ninja.files import UploadedFile

from jobs.models import JobApplication, JobListing, ResumeAnalysis
from jobs.schemas import (
	ApplyIn,
	ApplyOut,
	JobListResponse,
	JobManageCreateIn,
	JobManageListResponse,
	JobManageOut,
	JobManageUpdateIn,
	JobMetaOut,
	JobOut,
	ResumeAnalyzeOut,
	ResumePageAnalyzeOut,
)
from users.auth_jwt import jwt_auth

router = Router(tags=["jobs"])

META_CATEGORIES = [
	"All",
	"Web Development",
	"Data Science",
	"AI / ML",
	"Mobile Development",
	"UI/UX Design",
	"Cyber Security",
]
META_LOCATIONS = ["All Locations", "Remote", "Ahmedabad", "Bangalore"]
META_EXPERIENCE = ["All Levels", "Fresher", "1-3 Years", "3-5 Years", "3+ Years"]
META_WORK_TYPES = ["All Work Types", "Remote", "Part Time", "Full Time", "Night Job", "Contract", "Internship"]

LISTING_STATUS = frozenset({"open", "paused", "closed"})
REQUIRED_KEYWORDS = ["React.js", "Next.js", "REST APIs", "GraphQL", "TypeScript"]
RESUME_PAGE_KEYWORDS = ["react", "nextjs", "typescript", "node", "python", "sql", "docker", "aws", "api", "testing"]


def _query_means_all_category(value: str | None) -> bool:
	if value is None:
		return True
	s = value.strip().lower()
	return s == "" or s == "all"


def _query_means_all_experience(value: str | None) -> bool:
	if value is None:
		return True
	s = value.strip().lower()
	return s == "" or s in ("all levels", "all")


def _query_means_all_work_type(value: str | None) -> bool:
	if value is None:
		return True
	s = value.strip().lower()
	return s == "" or s in ("all work types", "all")


def _query_means_all_location(value: str | None) -> bool:
	if value is None:
		return True
	s = value.strip().lower()
	return s == "" or s in ("all locations", "all")


def _serialize_job(row: JobListing) -> dict:
	return {
		"id": row.id,
		"title": row.title,
		"company": row.company,
		"location": row.location,
		"salary": row.salary,
		"workType": row.work_type,
		"experience": row.experience,
		"category": row.category,
		"skills": row.skills or [],
		"description": row.description,
		"responsibilities": row.responsibilities or [],
		"requirements": row.requirements or [],
		"niceToHave": row.nice_to_have or [],
		"badge": row.badge or "",
	}


def _normalize_listing_status(raw: str) -> str:
	st = (raw or "open").strip().lower()
	if st not in LISTING_STATUS:
		raise HttpError(400, "listing_status must be open, paused, or closed.")
	return st


def _clean_non_empty_list(items: list[str] | None) -> list[str]:
	return [item.strip() for item in (items or []) if item and item.strip()]


def _serialize_manage(row: JobListing) -> dict:
	base = _serialize_job(row)
	base["applications"] = int(getattr(row, "applications_count", 0))
	base["listingStatus"] = row.listing_status
	return base


def _calculate_resume_scores(candidate_skills: list[str], uploaded_resume_name: str) -> dict:
	normalized = [skill.strip().lower() for skill in candidate_skills if skill and skill.strip()]
	matched = [kw for kw in REQUIRED_KEYWORDS if kw.lower() in normalized]
	keyword_score = round((len(matched) / len(REQUIRED_KEYWORDS)) * 100)
	skills_depth_score = min(100, round((len(normalized) / 8) * 100))
	resume_quality_score = 90 if uploaded_resume_name.strip() else 0
	overall_score = round((keyword_score * 0.6) + (skills_depth_score * 0.25) + (resume_quality_score * 0.15))
	eligible = overall_score >= 70
	return {
		"matched": matched,
		"keywordScore": keyword_score,
		"skillsDepthScore": skills_depth_score,
		"resumeQualityScore": resume_quality_score,
		"overallScore": overall_score,
		"eligible": eligible,
	}


def _seeded_value(seed: int, min_value: int, max_value: int, offset: int) -> int:
	range_size = max_value - min_value + 1
	return min_value + ((seed + offset * 97) % range_size)


def _build_resume_page_analysis(uploaded_resume_name: str, candidate_skills: list[str]) -> dict:
	lower_name = uploaded_resume_name.lower()
	seed = sum(ord(ch) * (idx + 1) for idx, ch in enumerate(lower_name))
	normalized_skills = [s.strip().lower() for s in candidate_skills if s and s.strip()]

	extracted_skills = [
		kw for kw in RESUME_PAGE_KEYWORDS if (kw in lower_name) or (kw in normalized_skills)
	]
	if not extracted_skills:
		extracted_skills = ["javascript", "communication", "problem solving"]

	missing_keywords = [kw for kw in RESUME_PAGE_KEYWORDS if kw not in extracted_skills][:4]
	base_score = _seeded_value(seed, 68, 88, 1)
	keyword_bonus = min(10, len(extracted_skills) * 2)
	score = min(96, base_score + keyword_bonus)
	ats_score = min(98, _seeded_value(seed, 64, 86, 2) + keyword_bonus)

	strengths = [
		"Strong technical skill coverage for modern roles" if len(extracted_skills) >= 4 else "Good technical base with relevant capabilities",
		"Resume appears structured and readable" if score >= 70 else "Resume has foundational structure that can be improved",
		"Clear potential for ATS optimization",
	]
	weaknesses = [
		f"Missing high-value keywords: {', '.join(missing_keywords)}" if missing_keywords else "Few keyword gaps detected",
		"Impact statements need stronger quantifiable outcomes" if score < 78 else "Project outcomes can be made more measurable",
		"Formatting consistency can be refined for faster scanning",
	]
	suggestions = [
		"Add measurable project and work achievements with numbers.",
		"Align skills and summary with your target job title keywords.",
		"Use consistent section hierarchy and concise bullet points.",
		"Keep resume within 1 to 2 pages and remove unrelated content.",
	]

	return {
		"score": int(score),
		"atsScore": int(ats_score),
		"strengths": strengths,
		"weaknesses": weaknesses,
		"suggestions": suggestions,
		"extractedSkills": extracted_skills,
		"missingKeywords": missing_keywords,
	}


@router.get("/meta", response=JobMetaOut)
def jobs_meta(request):
	return {
		"categories": META_CATEGORIES,
		"locationOptions": META_LOCATIONS,
		"experienceOptions": META_EXPERIENCE,
		"workTypeOptions": META_WORK_TYPES,
	}


@router.get("/", response=JobListResponse)
def list_jobs(
	request,
	category: str | None = Query(None),
	location: str | None = Query(None),
	experience: str | None = Query(None),
	work_type: str | None = Query(None),
):
	qs = JobListing.objects.filter(listing_status=JobListing.ListingStatus.OPEN)

	if not _query_means_all_category(category):
		qs = qs.filter(category=category.strip())

	if not _query_means_all_experience(experience):
		qs = qs.filter(experience=experience.strip())

	if not _query_means_all_work_type(work_type):
		qs = qs.filter(work_type=work_type.strip())

	if not _query_means_all_location(location):
		needle = location.strip()
		qs = qs.filter(location__icontains=needle)

	rows = list(qs.order_by("-created_at"))
	data = [_serialize_job(r) for r in rows]
	return {"jobs": data, "count": len(data)}


@router.post("/apply", response=ApplyOut)
def apply_to_job(request, data: ApplyIn):
	job = get_object_or_404(JobListing, id=data.job_id, listing_status=JobListing.ListingStatus.OPEN)
	if not data.full_name.strip():
		raise HttpError(400, "Full name is required.")
	if not data.email.strip():
		raise HttpError(400, "Email is required.")

	app = JobApplication.objects.create(
		job=job,
		full_name=data.full_name.strip(),
		email=data.email.strip().lower(),
		phone=(data.phone or "").strip(),
		message=(data.message or "").strip(),
	)
	return {"ok": True, "application_id": app.id}


@router.post("/applications/{application_id}/resume-analysis", response=ResumeAnalyzeOut)
def analyze_resume(
	request,
	application_id: int,
	candidate_skills: str = Form(...),
	resume: UploadedFile = File(...),
):
	app = get_object_or_404(JobApplication, id=application_id)
	if not resume or not getattr(resume, "name", "").strip():
		raise HttpError(400, "Resume file is required.")

	try:
		payload = json.loads(candidate_skills)
	except json.JSONDecodeError as exc:
		raise HttpError(400, "candidate_skills must be a valid JSON array.") from exc

	if not isinstance(payload, list):
		raise HttpError(400, "candidate_skills must be a JSON array.")

	cleaned_skills = [str(skill).strip() for skill in payload if str(skill).strip()]
	score = _calculate_resume_scores(cleaned_skills, resume.name)

	row = ResumeAnalysis.objects.create(
		application=app,
		uploaded_resume_name=resume.name.strip(),
		matched_keywords=score["matched"],
		keyword_score=score["keywordScore"],
		skills_depth_score=score["skillsDepthScore"],
		resume_quality_score=score["resumeQualityScore"],
		overall_score=score["overallScore"],
		eligible=score["eligible"],
	)

	return {
		"ok": True,
		"analysis_id": row.id,
		**score,
	}


@router.post("/resume-analysis", response=ResumePageAnalyzeOut)
def analyze_resume_page(
	request,
	candidate_skills: str = Form("[]"),
	resume: UploadedFile = File(...),
):
	if not resume or not getattr(resume, "name", "").strip():
		raise HttpError(400, "Resume file is required.")

	try:
		payload = json.loads(candidate_skills)
	except json.JSONDecodeError as exc:
		raise HttpError(400, "candidate_skills must be a valid JSON array.") from exc

	if not isinstance(payload, list):
		raise HttpError(400, "candidate_skills must be a JSON array.")

	cleaned_skills = [str(skill).strip() for skill in payload if str(skill).strip()]
	result = _build_resume_page_analysis(resume.name.strip(), cleaned_skills)

	row = ResumeAnalysis.objects.create(
		application=None,
		uploaded_resume_name=resume.name.strip(),
		matched_keywords=result["extractedSkills"],
		keyword_score=result["score"],
		skills_depth_score=min(100, len(cleaned_skills) * 10),
		resume_quality_score=result["atsScore"],
		overall_score=result["score"],
		eligible=result["score"] >= 70,
	)

	return {
		"ok": True,
		"analysis_id": row.id,
		**result,
	}


@router.get("/manage/list", response=JobManageListResponse, auth=jwt_auth)
def manage_list_jobs(request):
	rows = list(
		JobListing.objects.annotate(applications_count=Count("applications")).order_by("-created_at")
	)
	data = [_serialize_manage(r) for r in rows]
	return {"jobs": data, "count": len(data)}


@router.post("/manage", response=JobManageOut, auth=jwt_auth)
def manage_create_job(request, data: JobManageCreateIn):
	st = _normalize_listing_status(data.listing_status)
	if not data.title.strip():
		raise HttpError(400, "Title is required.")
	if not data.company.strip():
		raise HttpError(400, "Company is required.")
	skills = _clean_non_empty_list(data.skills)
	responsibilities = _clean_non_empty_list(data.responsibilities)
	requirements = _clean_non_empty_list(data.requirements)
	nice_to_have = _clean_non_empty_list(data.nice_to_have)
	if not skills:
		raise HttpError(400, "At least one skill is required.")
	if not responsibilities:
		raise HttpError(400, "At least one responsibility is required.")
	if not requirements:
		raise HttpError(400, "At least one requirement is required.")
	row = JobListing.objects.create(
		title=data.title.strip(),
		company=data.company.strip(),
		location=data.location.strip(),
		salary=data.salary.strip(),
		work_type=data.work_type.strip(),
		experience=data.experience.strip(),
		category=data.category.strip(),
		skills=skills,
		description=data.description.strip(),
		responsibilities=responsibilities,
		requirements=requirements,
		nice_to_have=nice_to_have,
		badge=(data.badge or "").strip(),
		listing_status=st,
		is_active=st == JobListing.ListingStatus.OPEN,
	)
	out = _serialize_job(row)
	out["applications"] = 0
	out["listingStatus"] = row.listing_status
	return out


@router.patch("/manage/{job_id}", response=JobManageOut, auth=jwt_auth)
def manage_update_job(request, job_id: int, data: JobManageUpdateIn):
	row = get_object_or_404(JobListing, id=job_id)
	if data.title is not None:
		row.title = data.title.strip()
	if data.company is not None:
		row.company = data.company.strip()
	if data.location is not None:
		row.location = data.location.strip()
	if data.salary is not None:
		row.salary = data.salary.strip()
	if data.work_type is not None:
		row.work_type = data.work_type.strip()
	if data.experience is not None:
		row.experience = data.experience.strip()
	if data.category is not None:
		row.category = data.category.strip()
	if data.skills is not None:
		skills = _clean_non_empty_list(data.skills)
		if not skills:
			raise HttpError(400, "At least one skill is required.")
		row.skills = skills
	if data.description is not None:
		row.description = data.description.strip()
	if data.responsibilities is not None:
		responsibilities = _clean_non_empty_list(data.responsibilities)
		if not responsibilities:
			raise HttpError(400, "At least one responsibility is required.")
		row.responsibilities = responsibilities
	if data.requirements is not None:
		requirements = _clean_non_empty_list(data.requirements)
		if not requirements:
			raise HttpError(400, "At least one requirement is required.")
		row.requirements = requirements
	if data.nice_to_have is not None:
		row.nice_to_have = _clean_non_empty_list(data.nice_to_have)
	if data.badge is not None:
		row.badge = data.badge.strip()
	if data.listing_status is not None:
		st = _normalize_listing_status(data.listing_status)
		row.listing_status = st
		row.is_active = st == JobListing.ListingStatus.OPEN
	row.save()
	row = JobListing.objects.annotate(applications_count=Count("applications")).filter(pk=row.pk).first()
	return _serialize_manage(row)


@router.get("/{job_id}", response=JobOut)
def job_detail(request, job_id: int):
	row = get_object_or_404(JobListing, id=job_id, listing_status=JobListing.ListingStatus.OPEN)
	return _serialize_job(row)
