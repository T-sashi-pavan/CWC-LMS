from django.urls import path

from . import views

urlpatterns = [
    path("health/", views.health),
    path("me/", views.MeView.as_view()),
]
