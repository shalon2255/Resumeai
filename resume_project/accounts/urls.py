from django.urls import path
from .views import current_user, csrf_token_view, login_view, register_view  

urlpatterns = [
    path("user/",     current_user),
    path("csrf/",     csrf_token_view),
    path("login/",    login_view),
    path("register/", register_view), 
]