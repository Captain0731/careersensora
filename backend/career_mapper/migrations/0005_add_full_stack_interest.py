from django.db import migrations


def add_full_stack_interest(apps, schema_editor):
	MapperInterest = apps.get_model("career_mapper", "MapperInterest")

	existing = MapperInterest.objects.filter(key__iexact="Full Stack").first()
	if existing:
		return

	max_order = MapperInterest.objects.order_by("-sort_order").values_list("sort_order", flat=True).first()
	next_order = (max_order or 0) + 1
	MapperInterest.objects.create(key="Full Stack", sort_order=next_order)


def noop_reverse(apps, schema_editor):
	return


class Migration(migrations.Migration):
	dependencies = [
		("career_mapper", "0004_add_more_interests"),
	]

	operations = [
		migrations.RunPython(add_full_stack_interest, noop_reverse),
	]
