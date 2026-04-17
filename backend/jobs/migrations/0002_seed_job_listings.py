from django.db import migrations


def seed(apps, schema_editor):
	JobListing = apps.get_model("jobs", "JobListing")
	if JobListing.objects.exists():
		return
	JobListing.objects.create(
		title="Frontend Developer (React.js)",
		company="TechNova Pvt Ltd",
		location="Remote / Ahmedabad",
		salary="₹6–10 LPA",
		work_type="Remote",
		experience="1-3 Years",
		category="Web Development",
		skills=["React.js", "Next.js", "TypeScript", "REST APIs"],
		description=(
			"Build modern, scalable web applications using React and Next.js. "
			"Work with APIs and create responsive UI components."
		),
		badge="Featured",
		is_active=True,
	)
	JobListing.objects.create(
		title="Data Analyst",
		company="Insight Analytics",
		location="Bangalore",
		salary="₹5–8 LPA",
		work_type="Full Time",
		experience="Fresher",
		category="Data Science",
		skills=["Python", "SQL", "Power BI", "Excel"],
		description=(
			"Analyze data trends, create dashboards, and support business decisions using actionable insights."
		),
		badge="Hiring Fast",
		is_active=True,
	)


def unseed(apps, schema_editor):
	JobListing = apps.get_model("jobs", "JobListing")
	JobListing.objects.all().delete()


class Migration(migrations.Migration):
	dependencies = [
		("jobs", "0001_initial"),
	]

	operations = [
		migrations.RunPython(seed, unseed),
	]
