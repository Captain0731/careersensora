from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = [
		("jobs", "0004_joblisting_detail_sections"),
	]

	operations = [
		migrations.CreateModel(
			name="ResumeAnalysis",
			fields=[
				("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
				("uploaded_resume_name", models.CharField(max_length=255)),
				("matched_keywords", models.JSONField(default=list)),
				("keyword_score", models.PositiveSmallIntegerField(default=0)),
				("skills_depth_score", models.PositiveSmallIntegerField(default=0)),
				("resume_quality_score", models.PositiveSmallIntegerField(default=0)),
				("overall_score", models.PositiveSmallIntegerField(default=0)),
				("eligible", models.BooleanField(default=False)),
				("created_at", models.DateTimeField(auto_now_add=True)),
				(
					"application",
					models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="resume_analyses", to="jobs.jobapplication"),
				),
			],
			options={
				"verbose_name": "Resume analysis",
				"verbose_name_plural": "Resume analyses",
				"ordering": ["-created_at"],
			},
		),
	]
