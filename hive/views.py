from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, EmailVerificationSerializer, ProfileSerializer, ClientSerializer, FreelancerSerializer
from rest_framework import serializers
from .models import Profile, EmailVerification, User, Freelancer, Client
import numpy as np
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.middleware.csrf import get_token
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

country_abbreviations = {
    'United State': 'US',
    'Pakistan':'PK', 
    'India': 'IN',
    'United Kingdom':'GB', 
    'Germany':'DE', 
    'Russia': 'RU', 
    "Saudi Arabia":'SA',
    "Qatar":'QA', 
    'China': 'CN',
}

@api_view(["GET"])
def get_csrf_token(request):
    # Get CSRF token
    csrf_token = get_token(request)
    # Return CSRF token as JSON response
    return Response({'csrfToken': csrf_token})

@api_view(['POST'])
def sign_up(request):
    data = request.data
    
    try:
        email_verification = EmailVerification.objects.get(email=data.get('email'))
        if not email_verification.is_verified:
            return Response({"email": "Not verified"}, status=status.HTTP_400_BAD_REQUEST)
    except EmailVerification.DoesNotExist:
        return Response({"email": "Not verified"}, status=status.HTTP_400_BAD_REQUEST)
    
    user_serializer = UserSerializer(data=data)
    if user_serializer.is_valid():
        try:
            with transaction.atomic():    
                user = user_serializer.save()
                profile_data = {
                    "user" : user.id, 
                    "location" : country_abbreviations.get(data.get("location")),
                    "available_balance" : 100
                }
                profile_serializer = ProfileSerializer(data = profile_data)
                if profile_serializer.is_valid():
                    profile = profile_serializer.save()
                else:
                    return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
                role = data.get('role')
                if role == "freelancer":
                    freelancer_data = {
                        "profile" : profile.id
                    }
                    freelancer_serializer = FreelancerSerializer(data = freelancer_data)
                    if freelancer_serializer.is_valid():
                        freelancer_serializer.save()    
                    else:
                        return Response(freelancer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                elif role == "client":
                    client_data = {
                        "profile" : profile.id
                    }
                    client_serializer = ClientSerializer(data = client_data)
                    if client_serializer.is_valid():
                        client_serializer.save()
                    else:
                        return Response(client_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                        raise ValueError("Invalid Role")
                    
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    "success": "Account created successfully",
                    "token": token.key,
                    "user_id": user.id,
                    "email": user.email,
                    "location" : profile.location,
                    "role" : role,
                    "first_name" : user.first_name,
                    "last_name" : user.last_name,
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def log_out(request):
    try:
        request.user.auth_token.delete()
        return Response({"success": "Logged out successfully"}, status=status.HTTP_200_OK)
    except (AttributeError, Token.DoesNotExist):
        return Response({"error": "Invalid token or user not logged in"}, status=status.HTTP_400_BAD_REQUEST)
  
@api_view(["POST"])
def sign_in(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')
    try:
        user = User.objects.get(email = email)
        if not user.check_password(password):
            return Response({"error": "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)
        profile = Profile.objects.get(user = user)
        if Freelancer.objects.filter(profile = profile).exists():
            role = 'freelancer'
        elif Client.objects.filter(profile = profile).exists():
            role = 'client'
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
                    "success": "Account created successfully",
                    "token": token.key,
                    "user_id": user.id,
                    "email": user.email,
                    "location" : profile.location,
                    "role" : role,
                    "first_name" : user.first_name,
                    "last_name" : user.last_name,
                }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error" : "Invalid Credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def is_authenticated(request):
    if request.user.is_authenticated:
        return Response({'isAuthenticated': True})
    else:
        return Response({'isAuthenticated': False})
    
@api_view(["GET"])
def get_country(request):
    countries =  [choice.label for choice in Profile.LocationChoices]
    return Response(countries)

def generate_otp():
    otp = np.random.choice(range(10), size = 6)
    otp_str = ""
    for i in range(6):
        otp_str += str(otp[i])
    return otp_str

def send_otp_email(email, otp):
    subject = "OTP Code for Hire-Hive"
    message = f"Your OTP code is {otp} for Hire-Hive email verification. It is valid for 2 minutes."
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)
    
@api_view(["POST"])
def send_otp(request):
    data = request.data
    email = data.get('email')
    otp = generate_otp()
    expired_at = timezone.now() + timezone.timedelta(minutes = 2)
    email_verification_serializer = EmailVerificationSerializer(data = {"email" : email, "otp" : otp, "expired_at" : expired_at})
    if email_verification_serializer.is_valid():
        email_verification_serializer.save()
        send_otp_email(email, otp)
        return Response({"success": "otp sent successfully"}, status=status.HTTP_200_OK)
    return Response(email_verification_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def verify_otp(request):
    data = request.data
    email = data.get('email')
    otp = data.get('otp')
    
    email_verification_serializer = EmailVerificationSerializer()
    
    try:
        verified_instance = email_verification_serializer.verify_otp(email= email, otp = otp)
        return Response({'success' : "otp verified successfully"}, status=status.HTTP_200_OK)
    except serializers.ValidationError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
   
    