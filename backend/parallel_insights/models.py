from django.db import models


class ParallelDomainInsight(models.Model):
	"""Career domain comparison data for Parallel Career Insights UI."""

	slug = models.SlugField(
		max_length=64,
		unique=True,
		help_text="Stable id used in the API and URL (e.g. ai, ml, web). Do not change lightly.",
	)
	name = models.CharField(
		"Domain name",
		max_length=255,
		help_text="Shown in the Parallel Career Insights dropdowns and comparison cards.",
	)
	color = models.CharField(
		max_length=32,
		help_text="Hex color for UI accents, e.g. #FF6B6B",
	)
	sort_order = models.PositiveIntegerField(
		default=0,
		help_text="Order in the domain lists (lower = first).",
	)
	description = models.TextField()
	analysis = models.TextField()
	salary_text = models.CharField(max_length=64)
	salary_min = models.PositiveIntegerField()
	salary_max = models.PositiveIntegerField()
	growth = models.CharField(max_length=255)
	growth_score = models.PositiveIntegerField()
	demand = models.TextField()
	demand_score = models.PositiveIntegerField()
	skills = models.JSONField(default=list)
	recommendation = models.TextField()
	why_recommended = models.JSONField(default=list)
	choose_if_primary = models.JSONField(default=list)
	choose_if_other = models.JSONField(default=list)
	final_suggestion = models.TextField()

	class Meta:
		ordering = ["sort_order", "id"]
		verbose_name = "Parallel Career Insights domain"
		verbose_name_plural = "Parallel Career Insights domains"

	def __str__(self) -> str:
		return self.name
