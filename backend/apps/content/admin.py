from django.contrib import admin

from .models import Interview, Job, Roadmap, Testimonial


@admin.register(Roadmap)
class RoadmapAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "featured", "is_pro", "order")
    list_filter = ("category", "featured", "is_pro")
    list_editable = ("featured",)
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "level", "is_pro", "order")
    list_filter = ("kind", "is_pro")


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "location", "is_pro", "posted_at")
    list_filter = ("is_pro", "job_type")
    search_fields = ("title", "company")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "order")
