from django.contrib.auth.models import User
from django.db import models


class InterviewSession(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="interview_sessions")
	domain = models.CharField(max_length=255)
	difficulty = models.CharField(max_length=32)
	mode = models.CharField(max_length=32)
	total_questions = models.PositiveIntegerField(default=0)
	completed = models.BooleanField(default=False)
	overall_score = models.FloatField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	completed_at = models.DateTimeField(null=True, blank=True)

	class Meta:
		ordering = ["-created_at"]


class InterviewQuestion(models.Model):
	session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name="questions")
	question_text = models.TextField()
	keywords = models.JSONField(default=list)
	order = models.PositiveIntegerField(default=0)

	class Meta:
		ordering = ["order"]


class InterviewAnswer(models.Model):
	question = models.OneToOneField(InterviewQuestion, on_delete=models.CASCADE, related_name="answer")
	answer_text = models.TextField()
	score = models.FloatField()
	feedback = models.TextField()
