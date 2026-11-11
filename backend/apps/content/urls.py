from django.urls import path

from . import views

urlpatterns = [
    path("roadmaps/", views.RoadmapList.as_view()),
    path("roadmaps/<slug:slug>/", views.RoadmapDetail.as_view()),
    path("interviews/", views.InterviewList.as_view()),
    path("jobs/", views.JobList.as_view()),
    path("testimonials/", views.TestimonialList.as_view()),
    path("plans/", views.PlanList.as_view()),
]
