from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = [
		("users", "0001_userprofile_phone"),
	]

	operations = [
		migrations.AddField(
			model_name="userprofile",
			name="is_recruiter",
			field=models.BooleanField(default=False),
		),
	]
