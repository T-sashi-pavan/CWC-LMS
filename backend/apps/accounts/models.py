import uuid

from django.db import models


class Profile(models.Model):
    """App-side profile for a Supabase Auth user (keyed by the Supabase user UUID)."""

    class Plan(models.TextChoices):
        FREE = "free", "Free"
        PRO = "pro", "Pro (₹499)"

    user_id = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(blank=True)
    full_name = models.CharField(max_length=150, blank=True)
    plan = models.CharField(max_length=10, choices=Plan.choices, default=Plan.FREE)
    pro_until = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email or str(self.user_id)

    @property
    def is_pro(self):
        return self.plan == self.Plan.PRO
