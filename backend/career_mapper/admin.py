from django.contrib import admin

from career_mapper.models import MapperCareerPath, MapperInterest, MapperSkill


@admin.register(MapperSkill)
class MapperSkillAdmin(admin.ModelAdmin):
	list_display = ("name", "sort_order", "is_base")
	list_filter = ("is_base",)
	search_fields = ("name",)
	ordering = ("sort_order", "id")


@admin.register(MapperInterest)
class MapperInterestAdmin(admin.ModelAdmin):
	list_display = ("key", "sort_order")
	search_fields = ("key",)
	ordering = ("sort_order", "id")


@admin.register(MapperCareerPath)
class MapperCareerPathAdmin(admin.ModelAdmin):
	list_display = ("title", "slug", "sort_order")
	search_fields = ("title", "slug")
	ordering = ("sort_order", "id")