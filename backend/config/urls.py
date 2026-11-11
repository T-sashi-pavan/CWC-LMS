from django.contrib import admin
from django.urls import include, path

from apps.accounts.views import root

urlpatterns = [
    path("", root),
    path("admin/", admin.site.urls),
    path("api/", include("apps.accounts.urls")),
    path("api/", include("apps.content.urls")),
]
