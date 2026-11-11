from rest_framework import serializers

from .models import Interview, Job, Roadmap, Testimonial


class TieredSerializer(serializers.ModelSerializer):
    """Adds `locked`; strips protected fields for Pro content when the viewer is on Free."""

    locked = serializers.SerializerMethodField()
    protected_fields: tuple = ()

    def get_locked(self, obj):
        return obj.is_pro and not self.context.get("is_pro", False)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data["locked"]:
            for f in self.protected_fields:
                data[f] = [] if isinstance(data.get(f), list) else ""
        return data


class RoadmapSerializer(TieredSerializer):
    """List card for a roadmap. Never contains the full content: that is the detail endpoint's job."""

    protected_fields = ("steps",)
    gated = serializers.SerializerMethodField()
    phase_count = serializers.SerializerMethodField()
    lab_count = serializers.SerializerMethodField()
    highlights = serializers.SerializerMethodField()

    def get_gated(self, obj):
        """Visitor is not logged in and this roadmap is not one of the few shown publicly."""
        return not self.context.get("authed", False) and not obj.featured

    def get_phase_count(self, obj):
        return (obj.content or {}).get("phase_count", 0)

    def get_lab_count(self, obj):
        return (obj.content or {}).get("lab_count", 0)

    def get_highlights(self, obj):
        """A few tools for the card chips (public teaser, not the full stack)."""
        items = [i for row in (obj.content or {}).get("tech_stack", []) for i in row["items"]]
        return items[:6]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data["gated"]:
            data["steps"] = []
        return data

    class Meta:
        model = Roadmap
        fields = (
            "id", "slug", "title", "tagline", "summary", "duration", "category", "featured",
            "phase_count", "lab_count", "highlights", "steps", "is_pro", "locked", "gated",
        )


class InterviewSerializer(TieredSerializer):
    class Meta:
        model = Interview
        fields = ("id", "kind", "title", "description", "level", "duration_min", "is_pro", "locked")


class JobSerializer(TieredSerializer):
    protected_fields = ("apply_url",)

    class Meta:
        model = Job
        fields = (
            "id", "title", "company", "location", "job_type", "salary",
            "apply_url", "posted_at", "is_pro", "locked",
        )


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ("id", "name", "role", "quote")
