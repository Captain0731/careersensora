from django.contrib import admin

from jobs.models import JobApplication, JobListing, ResumeAnalysis


class JobApplicationInline(admin.TabularInline):
	model = JobApplication
	extra = 0
	fields = ("full_name", "email", "phone", "message", "created_at")
	readonly_fields = ("created_at",)
	show_change_link = True


class ResumeAnalysisInline(admin.TabularInline):
	model = ResumeAnalysis
	extra = 0
	fields = ("uploaded_resume_name", "overall_score", "eligible", "created_at")
	readonly_fields = ("created_at",)
	show_change_link = True


@admin.register(JobListing)
class JobListingAdmin(admin.ModelAdmin):
	list_display = (
		"title",
		"company",
		"category",
		"location",
		"work_type",
		"experience",
		"listing_status",
		"is_active",
		"created_at",
	)
	list_filter = ("category", "work_type", "experience", "listing_status", "is_active")
	search_fields = ("title", "company", "location", "description")
	ordering = ("-created_at",)
	readonly_fields = ("created_at", "updated_at")
	inlines = (JobApplicationInline,)
	fieldsets = (
		(
			"Basic Info",
			{
				"fields": (
					"title",
					"company",
					"location",
					"salary",
					"work_type",
					"experience",
					"category",
					"badge",
				)
			},
		),
		(
			"Content",
			{
				"fields": (
					"description",
					"skills",
					"responsibilities",
					"requirements",
					"nice_to_have",
				)
			},
		),
		(
			"Status",
			{
				"fields": ("listing_status", "is_active", "created_at", "updated_at")
			},
		),
	)


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
	list_display = ("full_name", "email", "phone", "job", "created_at")
	list_filter = ("created_at", "job")
	search_fields = ("full_name", "email", "phone", "job__title", "message")
	readonly_fields = ("created_at",)
	ordering = ("-created_at",)
	inlines = (ResumeAnalysisInline,)
	fieldsets = (
		(
			"Applicant",
			{
				"fields": ("job", "full_name", "email", "phone")
			},
		),
		(
			"Application",
			{
				"fields": ("message", "created_at")
			},
		),
	)


@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
	list_display = ("id", "application", "uploaded_resume_name", "overall_score", "eligible", "created_at")
	list_filter = ("eligible", "created_at")
	search_fields = ("application__full_name", "application__email", "uploaded_resume_name")
	readonly_fields = ("created_at",)
	ordering = ("-created_at",)
