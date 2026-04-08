from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User            
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

def csrf_token_view(request):  
    return JsonResponse({'csrfToken': get_token(request)})

@login_required
def current_user(request):
    return JsonResponse({
        "username": request.user.username,
        "email": request.user.email,
    })

@api_view(["POST"])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")
    user = authenticate(username=email, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key})
    return Response({"error": "Invalid credentials"}, status=400)

@api_view(["POST"])
def register_view(request):
    email      = request.data.get("email")
    password   = request.data.get("password")
    first_name = request.data.get("first_name", "")
    last_name  = request.data.get("last_name", "")

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key})