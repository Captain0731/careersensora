from django.contrib import admin

from parallel_insights.models import ParallelDomainInsight

# Placeholder content for new domains until you edit raw data (e.g. via DB or future admin).
_NEW_DOMAIN_DEFAULTS = {
	"description": "Update this domain description (Django admin full access or database).",
	"analysis": "Update analysis text for this domain.",
	"salary_text": "—",
	"salary_min": 1,
	"salary_max": 10,
	"growth": "TBD",
	"growth_score": 50,
	"demand": "TBD",
	"demand_score": 50,
	"skills": [],
	"recommendation": "Update recommendation copy for this domain.",
	"why_recommended": [],
	"choose_if_primary": [],
	"choose_if_other": [],
	"final_suggestion": "Update final suggestion for this domain.",
}


@admin.register(ParallelDomainInsight)
class ParallelDomainInsightAdmin(admin.ModelAdmin):
	list_display = ("name", "slug", "color", "sort_order")
	list_display_links = ("name",)
	search_fields = ("name", "slug")
	ordering = ("sort_order", "id")

	fieldsets = (
		(
			"Domain name",
			{
				"fields": ("name", "slug", "color", "sort_order"),
				"description": (
					"When adding: set Domain name, Slug (short id, e.g. devops), color hex, and sort order. "
					"When editing an existing domain, only the name can be changed here."
				),
			},
		),
	)

	def get_readonly_fields(self, request, obj=None):
		if obj:
			return ("slug", "color", "sort_order")
		return ()

	def save_model(self, request, obj, form, change):
		if not change:
			for key, value in _NEW_DOMAIN_DEFAULTS.items():
				setattr(obj, key, value)
		super().save_model(request, obj, form, change)

	def has_delete_permission(self, request, obj=None):
		return request.user.is_superuser
