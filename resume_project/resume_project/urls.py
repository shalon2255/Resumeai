from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from analyzer.views import analyze_resume, rewrite_resume_ai
from analyzer.views import analyze_resume  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('analyze/', analyze_resume),
    path('rewrite/', rewrite_resume_ai),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)