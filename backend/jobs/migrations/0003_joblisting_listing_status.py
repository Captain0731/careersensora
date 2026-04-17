from django.db import migrations, models


def forwards(apps, schema_editor):
	JobListing = apps.get_model("jobs", "JobListing")
	for row in JobListing.objects.all():
		if not row.is_active:
			row.listing_status = "closed"
			row.save(update_fields=["listing_status"])


class Migration(migrations.Migration):
	dependencies = [
		("jobs", "0002_seed_job_listings"),
	]

	operations = [
		migrations.AddField(
			model_name="joblisting",
			name="listing_status",
			field=models.CharField(
				choices=[("open", "Open"), ("paused", "Paused"), ("closed", "Closed")],
				default="open",
				max_length=16,
			),
		),
		migrations.RunPython(forwards, migrations.RunPython.noop),
	]
