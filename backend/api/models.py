from django.db import models
from django.contrib.auth.models import User


class PredictionHistory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="predictions"
    )

    image = models.ImageField(upload_to="uploads/")
    heatmap = models.ImageField(
        upload_to="heatmaps/",
        blank=True,
        null=True
    )

    predicted_disease = models.CharField(max_length=120)
    confidence = models.FloatField()
    severity = models.CharField(max_length=50)
    doctor_priority = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.predicted_disease}"
