from django.db import migrations


def seed(apps, schema_editor):
	MapperSkill = apps.get_model("career_mapper", "MapperSkill")
	MapperInterest = apps.get_model("career_mapper", "MapperInterest")
	MapperCareerPath = apps.get_model("career_mapper", "MapperCareerPath")

	if MapperSkill.objects.exists():
		return

	base_skills = [
		"JavaScript",
		"Python",
		"React.js",
		"Machine Learning",
		"UI/UX Design",
		"TypeScript",
		"Node.js",
		"SQL",
		"Data Visualization",
		"Product Thinking",
		"Figma",
		"Cloud Basics",
	]
	for i, name in enumerate(base_skills):
		MapperSkill.objects.create(name=name, sort_order=i, is_base=True)

	interest_keys = [
		"Problem Solving",
		"Designing",
		"Data Analysis",
		"Building Applications",
		"Research & Innovation",
	]
	for i, key in enumerate(interest_keys):
		MapperInterest.objects.create(key=key, sort_order=i)

	paths = [
		{
			"slug": "frontend",
			"title": "Frontend Engineer",
			"summary": "Focus on building high-performance interfaces and delightful user experiences.",
			"skill_matches": ["JavaScript", "React.js", "TypeScript", "UI/UX Design"],
			"interest_matches": ["Designing", "Building Applications", "Problem Solving"],
			"best_for": ["Beginner", "Intermediate", "Advanced"],
			"roadmap": [
				"Master modern HTML/CSS/JS foundations and component patterns.",
				"Build 3 production-grade React projects with responsive design.",
				"Learn testing, performance optimization, and accessibility.",
				"Deploy portfolio projects and prepare for frontend system design.",
			],
		},
		{
			"slug": "datascience",
			"title": "Data Scientist",
			"summary": "Turn raw data into actionable insights and predictive models.",
			"skill_matches": ["Python", "SQL", "Machine Learning", "Data Visualization"],
			"interest_matches": ["Data Analysis", "Problem Solving", "Research & Innovation"],
			"best_for": ["Intermediate", "Advanced"],
			"roadmap": [
				"Strengthen statistics, probability, and data cleaning workflows.",
				"Practice end-to-end ML projects with real-world datasets.",
				"Learn model evaluation, feature engineering, and experiment tracking.",
				"Create business-focused case studies and storytelling dashboards.",
			],
		},
		{
			"slug": "fullstack",
			"title": "Full Stack Developer",
			"summary": "Build complete products from frontend experiences to backend APIs.",
			"skill_matches": ["JavaScript", "React.js", "Node.js", "SQL", "Cloud Basics"],
			"interest_matches": ["Building Applications", "Problem Solving", "Research & Innovation"],
			"best_for": ["Beginner", "Intermediate", "Advanced"],
			"roadmap": [
				"Build API-driven apps with authentication and database support.",
				"Learn backend architecture, caching, and API security patterns.",
				"Deploy full stack projects using CI/CD and cloud tooling.",
				"Practice scalable architecture and production debugging.",
			],
		},
		{
			"slug": "ux",
			"title": "UI/UX Product Designer",
			"summary": "Design intuitive digital products backed by research and usability.",
			"skill_matches": ["UI/UX Design", "Figma", "Product Thinking", "Data Visualization"],
			"interest_matches": ["Designing", "Research & Innovation", "Problem Solving"],
			"best_for": ["Beginner", "Intermediate", "Advanced"],
			"roadmap": [
				"Build strong design fundamentals: hierarchy, typography, and spacing.",
				"Run user research and convert insights into wireframes and flows.",
				"Create clickable prototypes and conduct usability testing.",
				"Build portfolio case studies that show process and measurable impact.",
			],
		},
	]
	for i, p in enumerate(paths):
		MapperCareerPath.objects.create(
			slug=p["slug"],
			title=p["title"],
			summary=p["summary"],
			sort_order=i,
			skill_matches=p["skill_matches"],
			interest_matches=p["interest_matches"],
			best_for=p["best_for"],
			roadmap=p["roadmap"],
		)


def unseed(apps, schema_editor):
	MapperSkill = apps.get_model("career_mapper", "MapperSkill")
	MapperInterest = apps.get_model("career_mapper", "MapperInterest")
	MapperCareerPath = apps.get_model("career_mapper", "MapperCareerPath")
	MapperCareerPath.objects.all().delete()
	MapperInterest.objects.all().delete()
	MapperSkill.objects.all().delete()


class Migration(migrations.Migration):
	dependencies = [
		("career_mapper", "0001_initial"),
	]

	operations = [
		migrations.RunPython(seed, unseed),
	]
