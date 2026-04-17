from ninja import NinjaAPI
from ninja.errors import HttpError
from ninja import Schema

from career_mapper.api import router as career_mapper_router
from hireonix.groq_client import groq_chat_completion
from interviews.api import router as interviews_router
from jobs.api import router as jobs_router
from parallel_insights.api import router as parallel_insights_router
from users.api import router as auth_router

api = NinjaAPI(
	title="Hireonix API",
	version="1.0.0",
	description="Auth and AI interview endpoints for the Hireonix app.",
)

api.add_router("/auth", auth_router)
api.add_router("/interviews", interviews_router)
api.add_router("/career-mapper", career_mapper_router)
api.add_router("/parallel-insights", parallel_insights_router)
api.add_router("/jobs", jobs_router)


class FaqChatIn(Schema):
	message: str


class FaqChatOut(Schema):
	reply: str


@api.post("/faq-chat", response=FaqChatOut, tags=["faq"])
def faq_chat(request, data: FaqChatIn):
	message = (data.message or "").strip()
	if not message:
		raise HttpError(400, "Message is required.")
	try:
		reply = groq_chat_completion(
			system_prompt=(
				"You are Hireonix FAQ Assistant. Give concise, practical advice for careers, "
				"resume, interviews, and skills in under 120 words."
			),
			user_prompt=message,
			temperature=0.4,
		)
		return {"reply": reply}
	except RuntimeError as exc:
		raise HttpError(502, f"Unable to get AI response: {exc}")


@api.get("/health", tags=["health"])
def health(request):
	return {"ok": True}
