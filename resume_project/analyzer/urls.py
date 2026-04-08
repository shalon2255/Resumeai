from django.urls import path
from .views import analyze_resume, get_history

urlpatterns = [
    path('analyze/', analyze_resume),
    path('history/', get_history),
]