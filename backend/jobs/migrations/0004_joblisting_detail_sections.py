from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = [
		("jobs", "0003_joblisting_listing_status"),
	]

	operations = [
		migrations.AddField(
			model_name="joblisting",
			name="nice_to_have",
			field=models.JSONField(default=list),
		),
		migrations.AddField(
			model_name="joblisting",
			name="requirements",
			field=models.JSONField(default=list),
		),
		migrations.AddField(
			model_name="joblisting",
			name="responsibilities",
			field=models.JSONField(default=list),
		),
	]
