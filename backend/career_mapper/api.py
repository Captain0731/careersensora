from django.db.models import Max
from ninja import Router
from ninja.errors import HttpError

from hireonix.groq_client import groq_chat_completion
from career_mapper.models import MapperCareerPath, MapperInterest, MapperSkill
from career_mapper.schemas import (
	AddSkillIn,
	CareerMapperConfigOut,
	CareerMapperDetailIn,
	CareerMapperDetailOut,
	CareerMapperGenerateIn,
	CareerMapperGenerateOut,
	SkillSavedOut,
)

router = Router(tags=["career-mapper"])


def _parse_ai_json_object(text: str) -> dict:
	import json
	import re

	raw = (text or "").strip()
	if raw.startswith("```"):
		raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.IGNORECASE)
		raw = re.sub(r"\s*```\s*$", "", raw)
	raw = raw.strip()
	try:
		return json.loads(raw)
	except json.JSONDecodeError:
		start = raw.find("{")
		end = raw.rfind("}")
		if start != -1 and end != -1 and end > start:
			return json.loads(raw[start : end + 1])
		raise


def _infer_language_choice(skills: list[str]) -> str:
	joined = " ".join(skills).lower()
	choices = []
	if "react" in joined:
		choices.append("React")
	if "javascript" in joined or "js" in joined:
		choices.append("JavaScript")
	if "typescript" in joined or "ts" in joined:
		choices.append("TypeScript")
	if "python" in joined:
		choices.append("Python")
	if "java" in joined:
		choices.append("Java")
	if "sql" in joined:
		choices.append("SQL")
	if not choices:
		return ", ".join(skills[:2]) if skills else "General Tech Stack"
	return " + ".join(choices[:3])


@router.get("/config", response=CareerMapperConfigOut)
def career_mapper_config(request):
	skills = MapperSkill.objects.order_by("sort_order", "id")
	interests = MapperInterest.objects.order_by("sort_order", "id")
	paths = MapperCareerPath.objects.order_by("sort_order", "id")
	return {
		"base_skills": [s.name for s in skills],
		"interests": [{"id": i.key} for i in interests],
		"experience_levels": ["Beginner", "Intermediate", "Advanced"],
		"career_paths": [
			{
				"id": p.slug,
				"title": p.title,
				"summary": p.summary,
				"skillMatches": p.skill_matches,
				"interestMatches": p.interest_matches,
				"bestFor": p.best_for,
				"roadmap": p.roadmap,
			}
			for p in paths
		],
	}


@router.post("/skills", response=SkillSavedOut)
def add_custom_skill(request, data: AddSkillIn):
	name = (data.name or "").strip()
	if not name:
		raise HttpError(400, "Skill name is required.")
	if len(name) > 128:
		raise HttpError(400, "Skill name is too long.")

	existing = MapperSkill.objects.filter(name__iexact=name).first()
	if existing:
		return {"name": existing.name, "created": False}

	max_order = MapperSkill.objects.aggregate(m=Max("sort_order"))["m"]
	next_order = (max_order or 0) + 1
	skill = MapperSkill.objects.create(name=name, sort_order=next_order, is_base=False)
	return {"name": skill.name, "created": True}


@router.post("/generate", response=CareerMapperGenerateOut)
def generate_career_matches(request, data: CareerMapperGenerateIn):
	skills = [s.strip() for s in data.skills if s.strip()]
	interests = [i.strip() for i in data.interests if i.strip()]
	experience_level = (data.experienceLevel or "").strip()
	if not skills or not interests or not experience_level:
		raise HttpError(400, "skills, interests, and experienceLevel are required.")

	try:
		inferred_language = _infer_language_choice(skills)
		response_text = groq_chat_completion(
			system_prompt=(
				"You are a career advisor. Return ONLY JSON with key `matches` as an array "
				"of exactly 4 objects. Each object must include fields: "
				"id,title,level,score,fitReason,roadmapHint,languageChoice,matchScore,"
				"successProbability,successTrack,salaryInsights,jobAvailability,"
				"nextBestSkillsToLearn,skillBasedImprovementRate,missingSkills."
			),
			user_prompt=(
				f"Skills: {skills}\n"
				f"Interests: {interests}\n"
				f"Experience Level: {experience_level}\n"
				"Level must be one of: High Match, Medium Match, Good Match. "
				"score/matchScore/successProbability must be integers between 60 and 95. "
				"nextBestSkillsToLearn and missingSkills must contain 3-6 short skill names each. "
				"salaryInsights and successTrack must be short and practical. "
				"IMPORTANT: languageChoice must stay aligned to selected skills only."
			),
			temperature=0.3,
			json_object=True,
		)

		payload = _parse_ai_json_object(response_text)
		matches = payload.get("matches", [])
		if not isinstance(matches, list) or len(matches) == 0:
			raise ValueError("No matches generated.")
		normalized = []
		for idx, match in enumerate(matches[:4]):
			if not isinstance(match, dict):
				continue
			score = int(match.get("score", 70))
			match_score = int(match.get("matchScore", score))
			success_probability = int(match.get("successProbability", score))
			normalized.append(
				{
					"id": str(match.get("id", f"career-{idx+1}")).strip() or f"career-{idx+1}",
					"title": str(match.get("title", "Career Path")).strip() or "Career Path",
					"level": str(match.get("level", "Medium Match")).strip() or "Medium Match",
					"score": max(60, min(95, score)),
					"fitReason": str(match.get("fitReason", "Matches your current profile.")),
					"roadmapHint": str(match.get("roadmapHint", "Build one strong project in this track.")),
					"languageChoice": inferred_language,
					"matchScore": max(60, min(95, match_score)),
					"successProbability": max(60, min(95, success_probability)),
					"successTrack": str(match.get("successTrack", "6-12 month guided track with weekly milestones.")),
					"salaryInsights": str(match.get("salaryInsights", "Strong salary upside for consistent portfolio builders.")),
					"jobAvailability": str(match.get("jobAvailability", "High demand in product and service companies.")),
					"nextBestSkillsToLearn": list(match.get("nextBestSkillsToLearn", ["System Design", "APIs", "Testing"])),
					"skillBasedImprovementRate": str(match.get("skillBasedImprovementRate", "+12% every 3 months with project practice.")),
					"missingSkills": list(match.get("missingSkills", ["Advanced DSA", "Cloud Deployment", "CI/CD"])),
				}
			)
		if not normalized:
			raise ValueError("No valid matches generated.")
		return {"matches": normalized}
	except Exception as exc:
		raise HttpError(502, f"Unable to generate AI career matches: {exc}")


@router.post("/detail", response=CareerMapperDetailOut)
def career_match_detail(request, data: CareerMapperDetailIn):
	skills = [s.strip() for s in data.skills if s.strip()]
	interests = [i.strip() for i in data.interests if i.strip()]
	experience_level = (data.experienceLevel or "").strip()
	career_id = (data.careerId or "").strip()
	title = (data.title or "").strip()
	if not skills or not interests or not experience_level or not career_id or not title:
		raise HttpError(400, "skills, interests, experienceLevel, careerId, and title are required.")

	snapshot = (
		f"Target role title: {title}\n"
		f"Career card id: {career_id}\n"
	)
	if data.matchScore is not None:
		snapshot += f"Prior match score: {data.matchScore}%\n"
	if data.successProbability is not None:
		snapshot += f"Prior success probability: {data.successProbability}%\n"
	if data.fitReason:
		snapshot += f"Fit summary: {data.fitReason}\n"
	if data.roadmapHint:
		snapshot += f"Roadmap hint: {data.roadmapHint}\n"
	if data.nextBestSkillsToLearn:
		snapshot += f"Suggested next skills: {data.nextBestSkillsToLearn}\n"
	if data.missingSkills:
		snapshot += f"Suggested missing skills: {data.missingSkills}\n"
	if data.languageChoice:
		snapshot += f"Stack focus: {data.languageChoice}\n"

	try:
		response_text = groq_chat_completion(
			system_prompt=(
				"You are a career analyst. Return ONLY one JSON object with keys exactly: "
				"title, matchScore, successProbability, salaryInsight, growthPotential, jobAvailability, "
				"availabilityHint, nextSkills, learningSpeed, improvementRate, successFactors, missingSkills. "
				"matchScore and successProbability must be integers 60-95. "
				"nextSkills and missingSkills must be arrays of 3-6 short strings. "
				"successFactors must be an array of 3-5 short strings. "
				"salaryInsight should be a realistic India-style range like ₹X–Y LPA when possible. "
				"Do not include selectedSkills in JSON."
			),
			user_prompt=(
				f"User skills (must stay consistent with analysis): {skills}\n"
				f"User interests: {interests}\n"
				f"Experience level: {experience_level}\n"
				f"{snapshot}\n"
				"Tailor everything to this role title and the user's actual skills."
			),
			temperature=0.35,
			json_object=True,
		)
		out = _parse_ai_json_object(response_text)
		ms = int(out.get("matchScore", data.matchScore or 75))
		sp = int(out.get("successProbability", data.successProbability or 75))
		next_skills = out.get("nextBestSkillsToLearn") or out.get("nextSkills") or []
		if isinstance(next_skills, str):
			next_skills = [next_skills]
		missing = out.get("missingSkills") or []
		if isinstance(missing, str):
			missing = [missing]
		factors = out.get("successFactors") or []
		if isinstance(factors, str):
			factors = [factors]
		return {
			"id": career_id,
			"title": str(out.get("title", title)),
			"matchScore": max(60, min(95, ms)),
			"successProbability": max(60, min(95, sp)),
			"selectedSkills": skills,
			"salaryInsight": str(out.get("salaryInsight", "Varies by city and company; strong upside with portfolio.")),
			"growthPotential": str(out.get("growthPotential", "High with consistent learning.")),
			"jobAvailability": str(out.get("jobAvailability", "Healthy demand for skilled candidates.")),
			"availabilityHint": str(out.get("availabilityHint", "Remote and hybrid roles are common.")),
			"nextSkills": [str(x) for x in next_skills][:8] if next_skills else ["Communication", "Portfolio Projects", "Interview Practice"],
			"learningSpeed": str(out.get("learningSpeed", "Moderate to fast with structured practice.")),
			"improvementRate": str(out.get("improvementRate", "+10% to +15% profile strength per quarter.")),
			"successFactors": [str(x) for x in factors][:6] if factors else ["Skill fit", "Portfolio depth", "Market demand"],
			"missingSkills": [str(x) for x in missing][:8] if missing else ["Advanced projects", "System thinking", "Interview depth"],
		}
	except Exception as exc:
		raise HttpError(502, f"Unable to generate AI career detail: {exc}")
