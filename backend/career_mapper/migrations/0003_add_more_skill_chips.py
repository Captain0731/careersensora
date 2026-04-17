from django.db import migrations


def add_more_skills(apps, schema_editor):
	MapperSkill = apps.get_model("career_mapper", "MapperSkill")

	required_skills = [
		"JavaScript",
		"Python",
		"Java",
		"React",
		"Node.js",
		"SQL",
		"Data Analysis",
		"UI/UX Design",
		"Project Management",
		"Marketing",
		"Content Writing",
		"Digital Marketing",
		"Machine Learning",
		"Cloud Computing",
		"HTML",
		"CSS",
		"Excel",
		"Communication",
		"Creativity",
		"Leadership",
		"Figma",
		"Photoshop",
		"Illustrator",
		"TypeScript",
		"MongoDB",
		"AWS",
	]

	max_order = MapperSkill.objects.order_by("-sort_order").values_list("sort_order", flat=True).first()
	next_order = (max_order or 0) + 1

	for skill_name in required_skills:
		existing = MapperSkill.objects.filter(name__iexact=skill_name).first()
		if existing:
			if not existing.is_base:
				existing.is_base = True
				existing.save(update_fields=["is_base"])
			continue
		MapperSkill.objects.create(name=skill_name, sort_order=next_order, is_base=True)
		next_order += 1


def noop_reverse(apps, schema_editor):
	# Keep user/admin-added skills intact on rollback.
	return


class Migration(migrations.Migration):
	dependencies = [
		("career_mapper", "0002_seed_career_mapper_defaults"),
	]

	operations = [
		migrations.RunPython(add_more_skills, noop_reverse),
	]
