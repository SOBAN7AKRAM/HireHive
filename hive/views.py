from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# from .serializers import UserSerializer, EmailVerificationSerializer, ProfileSerializer, ClientSerializer, FreelancerSerializer, FreelancerProjectSerializer, FreelancerProfilePageSerializer, 
from .serializers import *
from rest_framework import serializers
from .models import Profile, EmailVerification, User, Freelancer, Client, FreelancerProject
import numpy as np
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.middleware.csrf import get_token
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from allauth.socialaccount.models import SocialAccount
from django.db.models.signals import post_save
from django.dispatch import receiver
from google.oauth2 import id_token
import google.auth.transport.requests

GOOGLE_CLIENT_ID = '38015767059-coktn4rrad60pj0n9b38ojrb4cpe3sn7.apps.googleusercontent.com'

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
def google_sign_up_or_sign_in(request):
    data = request.data
    google_token = data.get('token')  # The ID token sent from the front-end

    try:
        idinfo = id_token.verify_oauth2_token(google_token, google.auth.transport.requests.Request(), settings.GOOGLE_CLIENT_ID)
        email = idinfo['email']
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        role = data.get('role')

        try:
            user = User.objects.get(email=email)
            new_user = False 
        except User.DoesNotExist:
            new_user = True 

            with transaction.atomic():
                user = User.objects.create_user(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                )
                user.set_unusable_password()  # No password, since it's Google sign-up
                user.save()

                # Create user profile as part of sign-up
                profile_data = {
                    "user": user.id,
                    "location": country_abbreviations.get("PK"), 
                    "available_balance": 100 
                }
                profile_serializer = ProfileSerializer(data=profile_data)
                if profile_serializer.is_valid():
                    profile = profile_serializer.save()
                else:
                    return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                # Create Freelancer or Client model based on role
                if role == "freelancer":
                    Freelancer.objects.create(profile=profile)
                elif role == "client":
                    Client.objects.create(profile=profile)

        if not new_user:
            # Check if Profile exists for the existing user
            try:
                profile = Profile.objects.get(user=user)
                if Freelancer.objects.filter(profile = profile).exists():
                    role = 'freelancer'
                elif Client.objects.filter(profile = profile).exists():
                    role = 'client'
            except Profile.DoesNotExist:
                return Response({"error": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve or create an authentication token for the user
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "success": "Account created successfully" if new_user else "Signed in successfully",
            "token": token.key,
            "user_id": user.id,
            "email": user.email,
            "location" : profile.location,
            "role" : role,
            "first_name" : user.first_name,
            "last_name" : user.last_name,
        }, status=status.HTTP_201_CREATED if new_user else status.HTTP_200_OK)
    
    except ValueError:
        return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
                        "profile" : profile.id, 
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
                    "success": "Signed in successfully",
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
   
@api_view(["PUT"])
def update_profile(request):
    if request.user.is_authenticated:
        data = request.data
        user_id = data.get("user_id")
        if not user_id:
            print("id")
            return Response({'error': "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(pk = user_id)
            profile = Profile.objects.get(user = user)
        except (User.DoesNotExist, Profile.DoesNotExist):
            return Response({'error': "profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if data.get("location"):
            data["location"] = country_abbreviations.get(data["location"].title())
        profile_ser = ProfileSerializer(profile, data = data, partial = True)
        if profile_ser.is_valid():
            profile_ser.save()
            return Response(profile_ser.data, status=status.HTTP_200_OK)
        print(profile_ser.errors)
        return Response(profile_ser.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error" : "Access denied"}, status=status.HTTP_401_UNAUTHORIZED)
            
@api_view(["PUT"])
def update_freelancer(request, freelancer_id):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        freelancer = Freelancer.objects.get(id = freelancer_id)
    except Freelancer.DoesNotExist:
        return Response({"error" : "Freelancer not found!"}, status=status.HTTP_404_NOT_FOUND)
    
    # validate the user if it his profile or not
    if freelancer.profile.user != request.user:
        return Response({"error" : "You are not allowed to update this freelancer"}, status=status.HTTP_403_FORBIDDEN)
    
    freelancer_ser = FreelancerSerializer(freelancer, data = request.data, partial = True)
    if freelancer_ser.is_valid():
        freelancer_ser.save()
        # return only the update fields
        updated_fields = request.data.keys()
        updated_data = {field : freelancer_ser.data[field] for field in updated_fields if field in freelancer_ser.data}
        if 'skills' in updated_fields:
            updated_data['skills'] = [skill.name for skill in freelancer.skills.all()]
        return Response(updated_data, status=status.HTTP_200_OK)
    return Response(freelancer_ser.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
def update_client(request, client_id):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        client = Client.objects.get(id = client_id)
    except Client.DoesNotExist:
        return Response({"error" : "Freelancer not found!"}, status=status.HTTP_404_NOT_FOUND)
    
    # validate the user if it his profile or not
    if client.profile.user != request.user:
        return Response({"error" : "You are not allowed to update this client"}, status=status.HTTP_403_FORBIDDEN)
    
    client_ser = ClientSerializer(client, data = request.data, partial = True)
    if client_ser.is_valid():
        client_ser.save()
        return Response(client_ser.data["company_name"], status=status.HTTP_200_OK)
    return Response(client_ser.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get_freelancer_profile_page(request, freelancer_id):
    try:
        freelancer = Freelancer.objects.get(id = freelancer_id)
    except Freelancer.DoesNotExist:
        return Response({"error" : "Freelancer not found!"}, status=status.HTTP_404_NOT_FOUND)
    serializer = FreelancerProfilePageSerializer(freelancer)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_client_profile_page(request, client_id):
    try:
        client = Client.objects.get(id = client_id)
    except Client.DoesNotExist:
        return Response({"error" : "Client not found!"}, status=status.HTTP_404_NOT_FOUND)
    serializer = ClientProfilePageSerializer(client)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(["POST"])
def create_portolio_project(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        freelancer = Freelancer.objects.get(id = request.data.get('freelancer'))
    except Freelancer.DoesNotExist:
        return Response({"error" : "Freelancer not found!"}, status=status.HTTP_404_NOT_FOUND)
    
    if freelancer.profile.user != request.user:
        return Response({"error" : "You are not allowed to add this freelancer project"}, status=status.HTTP_403_FORBIDDEN)
    
    project_ser = FreelancerProjectSerializer(data = request.data)
    if project_ser.is_valid():
        project_ser.save()
        return Response(project_ser.data, status=status.HTTP_201_CREATED)
    print(project_ser.errors)
    return Response(project_ser.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT", "PATCH"])
def update_portfolio_project(request, project_id):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        project = FreelancerProject.objects.get(id = project_id)
    except Freelancer.DoesNotExist:
        return Response({"error" : "project not found!"}, status=status.HTTP_404_NOT_FOUND)
    if project.freelancer.profile.user != request.user:
        return Response({"error" : "You are not allowed to edit this freelancer project"}, status=status.HTTP_403_FORBIDDEN)
    
    project_ser = FreelancerProjectSerializer(project, data = request.data, partial = True)
    if project_ser.is_valid():
        project_ser.save()
        return Response(project_ser.data, status=status.HTTP_200_OK)
    return Response(project_ser.errors, status=status.HTTP_400_BAD_REQUEST)
    
