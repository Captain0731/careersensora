from django.db import migrations


def add_more_interests(apps, schema_editor):
	MapperInterest = apps.get_model("career_mapper", "MapperInterest")

	required_interests = [
		"Software Development",
		"Data Science",
		"Design",
		"Business",
		"Marketing",
		"Sales",
		"Finance",
		"Healthcare",
		"Education",
		"Engineering",
		"Creative Arts",
		"Consulting",
	]

	max_order = MapperInterest.objects.order_by("-sort_order").values_list("sort_order", flat=True).first()
	next_order = (max_order or 0) + 1

	for interest_name in required_interests:
		existing = MapperInterest.objects.filter(key__iexact=interest_name).first()
		if existing:
			continue
		MapperInterest.objects.create(key=interest_name, sort_order=next_order)
		next_order += 1


def noop_reverse(apps, schema_editor):
	return


class Migration(migrations.Migration):
	dependencies = [
		("career_mapper", "0003_add_more_skill_chips"),
	]

	operations = [
		migrations.RunPython(add_more_interests, noop_reverse),
	]
