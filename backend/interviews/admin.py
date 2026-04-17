from django.contrib import admin

from interviews.models import InterviewAnswer, InterviewQuestion, InterviewSession


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "domain", "difficulty", "mode", "completed", "overall_score", "created_at")


@admin.register(InterviewQuestion)
class InterviewQuestionAdmin(admin.ModelAdmin):
	list_display = ("id", "session", "order", "question_text")


@admin.register(InterviewAnswer)
class InterviewAnswerAdmin(admin.ModelAdmin):
	list_display = ("id", "question", "score")
