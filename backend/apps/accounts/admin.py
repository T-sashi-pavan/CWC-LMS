from django.contrib import admin

from .models import Profile, PushSubscription


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("email", "full_name", "plan", "pro_until", "created_at")
    list_filter = ("plan",)
    search_fields = ("email", "full_name")


@admin.register(PushSubscription)
class PushSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user_id", "endpoint", "created_at")
    search_fields = ("endpoint", "user_id")
