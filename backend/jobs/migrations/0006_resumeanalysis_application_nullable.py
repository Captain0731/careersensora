from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = [
		("jobs", "0005_resumeanalysis"),
	]

	operations = [
		migrations.AlterField(
			model_name="resumeanalysis",
			name="application",
			field=models.ForeignKey(
				blank=True,
				null=True,
				on_delete=models.deletion.CASCADE,
				related_name="resume_analyses",
				to="jobs.jobapplication",
			),
		),
	]
