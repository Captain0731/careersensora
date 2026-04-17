from django.db import models


class MapperSkill(models.Model):
	"""Suggested skill chips (base list shown on the Career Mapper UI)."""

	name = models.CharField(max_length=128, unique=True)
	sort_order = models.PositiveIntegerField(default=0)
	is_base = models.BooleanField(
		default=True,
		help_text="If true, the skill appears in the default skill chip list.",
	)

	class Meta:
		ordering = ["sort_order", "id"]
		verbose_name = "Mapper skill"

	def __str__(self) -> str:
		return self.name


class MapperInterest(models.Model):
	"""Interest options (e.g. Problem Solving, Designing)."""

	key = models.CharField(max_length=128, unique=True)
	sort_order = models.PositiveIntegerField(default=0)

	class Meta:
		ordering = ["sort_order", "id"]
		verbose_name = "Mapper interest"

	def __str__(self) -> str:
		return self.key


class MapperCareerPath(models.Model):
	"""A career path template with matching hints and roadmap steps."""

	slug = models.SlugField(max_length=64, unique=True)
	title = models.CharField(max_length=255)
	summary = models.TextField()
	sort_order = models.PositiveIntegerField(default=0)
	skill_matches = models.JSONField(default=list)
	interest_matches = models.JSONField(default=list)
	best_for = models.JSONField(default=list)
	roadmap = models.JSONField(default=list)

	class Meta:
		ordering = ["sort_order", "id"]
		verbose_name = "Career path"

	def __str__(self) -> str:
		return self.title
