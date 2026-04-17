from ninja import Router
from ninja.errors import HttpError

from hireonix.groq_client import groq_chat_completion
from parallel_insights.models import ParallelDomainInsight
from parallel_insights.schemas import (
	ParallelInsightsCompareIn,
	ParallelInsightsCompareOut,
	ParallelInsightsConfigOut,
)

router = Router(tags=["parallel-insights"])


def _row_to_comparison(row: ParallelDomainInsight) -> dict:
	return {
		"name": row.name,
		"description": row.description,
		"analysis": row.analysis,
		"salary": row.salary_text,
		"salaryRange": [row.salary_min, row.salary_max],
		"growth": row.growth,
		"growthScore": row.growth_score,
		"demand": row.demand,
		"demandScore": row.demand_score,
		"skills": row.skills,
		"recommendation": row.recommendation,
		"whyRecommended": row.why_recommended,
		"chooseIfPrimary": row.choose_if_primary,
		"chooseIfOther": row.choose_if_other,
		"finalSuggestion": row.final_suggestion,
	}


def _score_domain(row: ParallelDomainInsight) -> float:
	avg_salary = (row.salary_min + row.salary_max) / 2
	salary_score = min(100.0, (avg_salary / 30.0) * 100.0)
	skills_score = min(100.0, float(len(row.skills) * 10))
	return (row.growth_score * 0.4) + (row.demand_score * 0.35) + (salary_score * 0.2) + (skills_score * 0.05)


@router.get("/config", response=ParallelInsightsConfigOut)
def parallel_insights_config(request):
	rows = ParallelDomainInsight.objects.order_by("sort_order", "id")
	domains = [{"id": r.slug, "name": r.name, "color": r.color} for r in rows]
	comparison = {r.slug: _row_to_comparison(r) for r in rows}
	return {"domains": domains, "comparison": comparison}


@router.post("/compare", response=ParallelInsightsCompareOut)
def compare_parallel_domains(request, data: ParallelInsightsCompareIn):
	d1 = data.domain1.strip().lower()
	d2 = data.domain2.strip().lower()
	if not d1 or not d2:
		raise HttpError(400, "Both domain1 and domain2 are required.")
	if d1 == d2:
		raise HttpError(400, "Please select different domains to compare.")

	row1 = ParallelDomainInsight.objects.filter(slug=d1).first()
	row2 = ParallelDomainInsight.objects.filter(slug=d2).first()
	if not row1 or not row2:
		raise HttpError(404, "One or both selected domains were not found.")

	score1 = _score_domain(row1)
	score2 = _score_domain(row2)
	best = row1 if score1 >= score2 else row2
	ai_summary = None
	try:
		ai_summary = groq_chat_completion(
			system_prompt="You are a concise career advisor.",
			user_prompt=(
				"Compare these two domains and provide a 2-3 sentence recommendation.\n"
				f"Domain 1: {row1.name}; growth={row1.growth}; demand={row1.demand}; salary={row1.salary_text}; skills={row1.skills}\n"
				f"Domain 2: {row2.name}; growth={row2.growth}; demand={row2.demand}; salary={row2.salary_text}; skills={row2.skills}\n"
				f"Current best pick: {best.name}"
			),
			temperature=0.3,
		)
	except RuntimeError:
		ai_summary = None

	return {
		"domain1": row1.slug,
		"domain2": row2.slug,
		"bestDomain": best.slug,
		"whyRecommended": best.why_recommended,
		"chooseIfDomain1": row1.choose_if_primary,
		"chooseIfDomain2": row2.choose_if_primary,
		"finalSuggestion": best.final_suggestion,
		"aiSummary": ai_summary,
	}
