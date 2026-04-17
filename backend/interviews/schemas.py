from datetime import datetime

from ninja import Schema


class StartInterviewIn(Schema):
	domain: str
	difficulty: str
	mode: str


class QuestionOut(Schema):
	id: int
	question_text: str
	order: int


class SessionOut(Schema):
	id: int
	domain: str
	difficulty: str
	mode: str
	total_questions: int
	questions: list[QuestionOut]
	created_at: datetime


class SubmitAnswerIn(Schema):
	question_id: int
	answer_text: str


class AnswerOut(Schema):
	question_id: int
	question_text: str
	answer_text: str
	score: float
	feedback: str


class AnswerRowOut(Schema):
	question_id: int
	question_text: str
	answer_text: str
	score: float
	feedback: str


class ResultsOut(Schema):
	session_id: int
	domain: str
	difficulty: str
	mode: str
	overall_score: float
	total_questions: int
	answers: list[AnswerRowOut]
	strengths: list[str]
	weak_areas: list[str]
	suggestions: list[str]
	completed_at: datetime | None
