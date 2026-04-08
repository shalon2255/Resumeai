from django.db import models


class Resume(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    resume_file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

from django.db import models
from django.contrib.auth.models import User

class ResumeAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    resume_name = models.CharField(max_length=255)

    ats_score = models.FloatField()
    job_fit_score = models.FloatField()

    matched_skills = models.JSONField()
    missing_skills = models.JSONField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.resume_name    