from django.db import migrations


def seed(apps, schema_editor):
	ParallelDomainInsight = apps.get_model("parallel_insights", "ParallelDomainInsight")
	if ParallelDomainInsight.objects.exists():
		return
	from parallel_insights.seed_data import SEED_DOMAINS

	for d in SEED_DOMAINS:
		ParallelDomainInsight.objects.create(**d)


def unseed(apps, schema_editor):
	ParallelDomainInsight = apps.get_model("parallel_insights", "ParallelDomainInsight")
	ParallelDomainInsight.objects.all().delete()


class Migration(migrations.Migration):
	dependencies = [
		("parallel_insights", "0001_initial"),
	]

	operations = [
		migrations.RunPython(seed, unseed),
	]
