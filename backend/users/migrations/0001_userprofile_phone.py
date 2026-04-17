from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = []

	operations = [
		migrations.CreateModel(
			name="UserProfile",
			fields=[
				("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
				("phone", models.CharField(blank=True, max_length=32)),
				(
					"user",
					models.OneToOneField(on_delete=models.deletion.CASCADE, related_name="profile", to="auth.user"),
				),
			],
		),
	]
