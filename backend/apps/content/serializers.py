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
    protected_fields = ("steps",)

    class Meta:
        model = Roadmap
        fields = ("id", "slug", "title", "summary", "duration", "steps", "is_pro", "locked")


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
