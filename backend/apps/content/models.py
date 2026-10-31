from django.db import models


class Tiered(models.Model):
    """Base for anything that can be Free or Pro-only."""

    is_pro = models.BooleanField(default=False, help_text="Tick for subscription (₹499) content")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True
        ordering = ["order", "id"]


class Roadmap(Tiered):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=120)
    summary = models.CharField(max_length=300)
    duration = models.CharField(max_length=40, blank=True, help_text="e.g. 8 weeks")
    steps = models.JSONField(default=list, help_text='List of {"title": "...", "detail": "..."}')

    def __str__(self):
        return self.title


class Interview(Tiered):
    class Kind(models.TextChoices):
        MOCK = "mock", "Mock interview"
        AI = "ai", "AI interview"
        VIDEO = "video", "Video simulation"

    kind = models.CharField(max_length=10, choices=Kind.choices)
    title = models.CharField(max_length=120)
    description = models.CharField(max_length=300)
    level = models.CharField(max_length=40, blank=True)
    duration_min = models.PositiveIntegerField(default=30)

    def __str__(self):
        return f"[{self.kind}] {self.title}"


class Job(Tiered):
    title = models.CharField(max_length=140)
    company = models.CharField(max_length=120)
    location = models.CharField(max_length=120)
    job_type = models.CharField(max_length=40, default="Full-time")
    salary = models.CharField(max_length=60, blank=True)
    apply_url = models.URLField(blank=True)
    posted_at = models.DateField(auto_now_add=True)

    class Meta(Tiered.Meta):
        ordering = ["-posted_at", "order", "id"]

    def __str__(self):
        return f"{self.title} @ {self.company}"


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=140, help_text="e.g. Software Engineer at XYZ")
    quote = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name
