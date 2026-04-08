
from django.contrib import admin
from .models import Resume
from .models import ResumeAnalysis

admin.site.register(ResumeAnalysis)
admin.site.register(Resume)