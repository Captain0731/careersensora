from django.contrib import admin
from django.urls import path

from hireonix.api import api
from hireonix.views import root

urlpatterns = [
	path("", root),
	path("admin/", admin.site.urls),
	path("api/v1/", api.urls),
]
