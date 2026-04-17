from django.db import models


class JobListing(models.Model):
	"""Published job openings shown on the Job Apply page."""

	class ListingStatus(models.TextChoices):
		OPEN = "open", "Open"
		PAUSED = "paused", "Paused"
		CLOSED = "closed", "Closed"

	title = models.CharField(max_length=255)
	company = models.CharField(max_length=255)
	location = models.CharField(max_length=255)
	salary = models.CharField(max_length=128)
	work_type = models.CharField(max_length=32)
	experience = models.CharField(max_length=64)
	category = models.CharField(max_length=64)
	skills = models.JSONField(default=list)
	description = models.TextField()
	responsibilities = models.JSONField(default=list)
	requirements = models.JSONField(default=list)
	nice_to_have = models.JSONField(default=list)
	badge = models.CharField(max_length=64, blank=True)
	is_active = models.BooleanField(default=True)
	listing_status = models.CharField(
		max_length=16,
		choices=ListingStatus.choices,
		default=ListingStatus.OPEN,
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created_at"]
		verbose_name = "Job listing"
		verbose_name_plural = "Job listings"

	def __str__(self) -> str:
		return f"{self.title} @ {self.company}"


class JobApplication(models.Model):
	"""Candidate application for a job listing."""

	job = models.ForeignKey(JobListing, on_delete=models.CASCADE, related_name="applications")
	full_name = models.CharField(max_length=255)
	email = models.EmailField()
	phone = models.CharField(max_length=32, blank=True)
	message = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["-created_at"]
		verbose_name = "Job application"
		verbose_name_plural = "Job applications"

	def __str__(self) -> str:
		return f"{self.full_name} → {self.job.title}"


class ResumeAnalysis(models.Model):
	"""AI-style resume analysis result for a specific job application."""

	application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name="resume_analyses", null=True, blank=True)
	uploaded_resume_name = models.CharField(max_length=255)
	matched_keywords = models.JSONField(default=list)
	keyword_score = models.PositiveSmallIntegerField(default=0)
	skills_depth_score = models.PositiveSmallIntegerField(default=0)
	resume_quality_score = models.PositiveSmallIntegerField(default=0)
	overall_score = models.PositiveSmallIntegerField(default=0)
	eligible = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ["-created_at"]
		verbose_name = "Resume analysis"
		verbose_name_plural = "Resume analyses"

	def __str__(self) -> str:
		return f"Resume analysis #{self.id} for application #{self.application_id}"
