from django.urls import path

from . import views

urlpatterns = [
    path("health/", views.health),
    path("me/", views.MeView.as_view()),
    path("me/progress/", views.MeProgressView.as_view()),
    path("push/subscribe/", views.PushSubscribeView.as_view()),
    path("push/unsubscribe/", views.PushUnsubscribeView.as_view()),
    path("push/test/", views.PushTestView.as_view()),
]
