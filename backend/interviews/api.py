from datetime import datetime, timezone

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from ninja import Router

from interviews.models import InterviewAnswer, InterviewQuestion, InterviewSession
from interviews.questions_bank import get_questions
from interviews.schemas import AnswerOut, ResultsOut, SessionOut, StartInterviewIn, SubmitAnswerIn

router = Router(tags=["interviews"])


def _mode_prefix(mode: str) -> str:
	return {"text": "Text interview", "voice": "Voice interview", "video": "Video interview"}.get(mode, "Interview")


def _evaluate_answer(answer_text: str, keywords: list) -> tuple[float, str]:
	normalized = answer_text.lower()
	keyword_hits = sum(1 for kw in keywords if str(kw).lower() in normalized)
	length_score = min(25, len(answer_text.strip()) // 8)
	score = min(100, 40 + keyword_hits * 20 + length_score)
	if score >= 80:
		feedback = "Excellent response! You demonstrated strong understanding and covered key concepts well."
	elif score >= 60:
		feedback = "Good response. Consider adding more specific examples and technical depth."
	else:
		feedback = "Your answer could be improved. Try to include more relevant technical details and structure your response better."
	return float(score), feedback


def _get_suggestions(score: float) -> list[str]:
	if score >= 80:
		return [
			"Keep tightening your examples with measurable results.",
			"Practice concise closing statements.",
			"Add more leadership and impact language.",
		]
	if score >= 60:
		return [
			"Use the STAR method more consistently.",
			"Include metrics, tools, and outcomes in answers.",
			"Slow down and structure your response clearly.",
		]
	return [
		"Answer in shorter structured points.",
		"Prepare a few strong project stories before retrying.",
		"Review fundamentals for the selected difficulty level.",
	]


def _get_guest_user() -> User:
	guest, _created = User.objects.get_or_create(
		username="guest_ai_interview",
		defaults={
			"first_name": "Guest",
			"last_name": "AI Interview",
			"email": "guest.ai.interview@hireonix.local",
			"is_active": True,
		},
	)
	return guest


def _get_strengths(score: float) -> list[str]:
	if score >= 80:
		return ["Strong clarity and structure", "Relevant technical depth", "Good interview confidence"]
	if score >= 60:
		return ["Clear intent in answers", "Good topic coverage", "Room for stronger examples"]
	return ["Basic understanding of the topic", "Good start on communication", "Can improve structure and depth"]


def _get_weak_areas(score: float) -> list[str]:
	if score >= 80:
		return ["Add more impact metrics", "Speak a little slower in delivery"]
	if score >= 60:
		return ["Need more concrete examples", "Stronger technical detail needed"]
	return ["Response structure", "Domain-specific detail", "Confidence under pressure"]


@router.post("/start", response=SessionOut)
def start_interview(request, data: StartInterviewIn):
	user = _get_guest_user()
	raw = get_questions(data.domain, data.difficulty)
	session = InterviewSession.objects.create(
		user=user,
		domain=data.domain,
		difficulty=data.difficulty,
		mode=data.mode,
	)
	prefix = _mode_prefix(data.mode)
	db_questions: list[InterviewQuestion] = []
	for i, q in enumerate(raw):
		db_q = InterviewQuestion.objects.create(
			session=session,
			question_text=f"{prefix} {i + 1}: {q['prompt']}",
			keywords=q["keywords"],
			order=i,
		)
		db_questions.append(db_q)
	session.total_questions = len(db_questions)
	session.save()
	return {
		"id": session.id,
		"domain": session.domain,
		"difficulty": session.difficulty,
		"mode": session.mode,
		"total_questions": session.total_questions,
		"questions": [{"id": q.id, "question_text": q.question_text, "order": q.order} for q in db_questions],
		"created_at": session.created_at,
	}


@router.post("/{session_id}/answer", response=AnswerOut)
def submit_answer(request, session_id: int, data: SubmitAnswerIn):
	question = get_object_or_404(InterviewQuestion.objects.select_related("session"), id=data.question_id, session_id=session_id)
	score, feedback = _evaluate_answer(data.answer_text, question.keywords)
	if question.session.mode in ("voice", "video"):
		score = max(65.0, score)
	answer, _created = InterviewAnswer.objects.update_or_create(
		question=question,
		defaults={
			"answer_text": data.answer_text,
			"score": score,
			"feedback": feedback,
		},
	)
	return {
		"question_id": question.id,
		"question_text": question.question_text,
		"answer_text": answer.answer_text,
		"score": answer.score,
		"feedback": answer.feedback,
	}


@router.get("/{session_id}/results", response=ResultsOut)
def get_results(request, session_id: int):
	session = get_object_or_404(InterviewSession, id=session_id)
	questions = list(session.questions.all().order_by("order"))
	answers_data = []
	total_score = 0.0
	answered_count = 0
	for q in questions:
		ans = InterviewAnswer.objects.filter(question=q).first()
		if ans:
			answers_data.append(
				{
					"question_id": q.id,
					"question_text": q.question_text,
					"answer_text": ans.answer_text,
					"score": ans.score,
					"feedback": ans.feedback,
				}
			)
			total_score += float(ans.score)
			answered_count += 1
		else:
			answers_data.append(
				{
					"question_id": q.id,
					"question_text": q.question_text,
					"answer_text": "",
					"score": 0.0,
					"feedback": "No answer submitted.",
				}
			)
	overall = total_score / max(1, answered_count)
	if not session.completed:
		session.completed = True
		session.overall_score = overall
		session.completed_at = datetime.now(timezone.utc)
		session.save()
	return {
		"session_id": session.id,
		"domain": session.domain,
		"difficulty": session.difficulty,
		"mode": session.mode,
		"overall_score": overall,
		"total_questions": session.total_questions,
		"answers": answers_data,
		"strengths": _get_strengths(overall),
		"weak_areas": _get_weak_areas(overall),
		"suggestions": _get_suggestions(overall),
		"completed_at": session.completed_at,
	}
