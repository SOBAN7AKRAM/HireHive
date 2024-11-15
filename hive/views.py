from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, EmailVerificationSerializer, ProfileSerializer, ClientSerializer, FreelancerSerializer, FreelancerProjectSerializer, FreelancerProfilePageSerializer
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
from rest_framework.pagination import PageNumberPagination
import google.auth.transport.requests
from django.db.models import Q, Sum
import re
import base64
from django.core.files.base import ContentFile

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
    email = data.get('email')
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    role = data.get("role")
    print(data)

    try:
        user = User.objects.get(email=email)
        new_user = False
    except User.DoesNotExist:
        new_user = True
        with transaction.atomic():
            try:
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
                    "location": country_abbreviations.get("Pakistan"), 
                    "available_balance": 100 
                }
                profile_serializer = ProfileSerializer(data=profile_data)
                profile_serializer.is_valid(raise_exception=True)  # Raises an exception if validation fails
                profile = profile_serializer.save()

                # Create Freelancer or Client model based on role
                if role == "freelancer":
                    Freelancer.objects.create(profile=profile)
                elif role == "client":
                    Client.objects.create(profile=profile)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # If user exists, check for profile
    try:
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        return Response({"error": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)

    # Determine role based on existing profile
    try:
        freelancer = Freelancer.objects.get(profile=profile)
        role = "freelancer"
    except Freelancer.DoesNotExist:
        try:
            client = Client.objects.get(profile=profile)
            role = "client"
        except Client.DoesNotExist:
            return Response({"error": "User has no associated role."}, status=status.HTTP_404_NOT_FOUND)

    # Retrieve or create an authentication token for the user
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "success": "Account created successfully" if new_user else "Signed in successfully",
        "token": token.key,
        "user_id": user.id,
        "email": user.email,
        "location": profile.location,
        f"{role}": freelancer.id if role == "freelancer" else client.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }, status=status.HTTP_201_CREATED if new_user else status.HTTP_200_OK)



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
                    "profile" : profile.id,
                    "token": token.key,
                    "user_id": user.id,
                    "email": user.email,
                    "location" : profile.location,
                    f"{role}" : freelancer_serializer.data.get("id") if role =="freelancer" else client_serializer.data.get("id"),
                    "first_name" : user.first_name,
                    "last_name" : user.last_name,
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 
    return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(["GET"])
def get_user(request):
    if request.user.is_authenticated:
        user = request.user
        profile = Profile.objects.get(user = user)
        try:
            freelancer = Freelancer.objects.get(profile = profile)
            role = "freelancer"
        except Freelancer.DoesNotExist:
            pass
        try:
            client = Client.objects.get(profile = profile)
            role = "client"
        except Client.DoesNotExist:
            pass
        return Response({
                    "success": "User loaded successfully",
                    "profile" : profile.id,
                    "user_id": user.id,
                    "email": user.email,
                    "location" : profile.location,
                    f"{role}" : freelancer.id if role =="freelancer" else client.id,
                    "first_name" : user.first_name,
                    "last_name" : user.last_name,
        }, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_401_UNAUTHORIZED)
    
        

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
        try:
            freelancer = Freelancer.objects.get(profile = profile)
            role = "freelancer"
        except Freelancer.DoesNotExist:
            pass
        try:
            client = Client.objects.get(profile = profile)
            role = "client"
        except Client.DoesNotExist:
            pass
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
                    "success": "Signed in successfully",
                    "profile" : profile.id,
                    "user_id": user.id,
                    "email": user.email,
                    "token": token.key,
                    "location" : profile.location,
                    f"{role}" : freelancer.id if role =="freelancer" else client.id,
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
        user_id = data.get("user")
        if not user_id:
            print("user not found")
            return Response({'error': "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(pk = user_id)
            profile = Profile.objects.get(user = user)
        except (User.DoesNotExist, Profile.DoesNotExist):
            return Response({'error': "profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        picture_data = data.get("picture")
        if picture_data and picture_data.startswith("data:image/"):
            format, imgstr = picture_data.split(';base64,')  # Split the data
            ext = format.split('/')[-1]  # Extract the file extension (e.g., jpg, png)
            data['picture'] = ContentFile(base64.b64decode(imgstr), name=f"profile_picture.{ext}")
        profile_ser = ProfileSerializer(profile, data = data, partial = True, context={'request': request})
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
    serializer = FreelancerProfilePageSerializer(freelancer, context={'request': request})
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
    
@api_view(["POST"])
def job_posting(request):
    data = request.data
    client_id = data.get("client")
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        client = Client.objects.get(id = client_id)
    except Freelancer.DoesNotExist:
        return Response({"error" : "client not found!"}, status=status.HTTP_404_NOT_FOUND)
    if client.profile.user != request.user:
        return Response({"error" : "You are not allowed to post job of this client"}, status=status.HTTP_403_FORBIDDEN)
    serializer = ActiveJobSerializer(data = data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ActiveJobPagination(PageNumberPagination):
    page_size = 10
    
@api_view(["GET"])
def get_active_jobs(request):
    queryset = ActiveJob.objects.filter(is_active = True).order_by("-posted_at")
    search_skills = request.query_params.get('skills', None)
    if search_skills:
        sk = re.split(r'\W+', search_skills)
        search_skills_list = [skill.strip().lower() for skill in sk if skill]
        skills_filter = Q()
        for skill in search_skills_list:
            skills_filter |= Q(skills_required__icontains = skill)
        queryset = queryset.filter(skills_filter)
        
    elif request.user.is_authenticated:
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"error": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            client = Client.objects.get(profile = profile)
            queryset = queryset.filter(client = client)
        except Client.DoesNotExist:
            pass
        try:
            freelancer = Freelancer.objects.get(profile = profile)
            if freelancer.skills:
                freelancer_skills = freelancer.skills.values_list('name', flat=True)
                if freelancer_skills:
                    skills_filter = Q()
                    for skill in freelancer_skills:
                        skills_filter |= Q(skills_required__icontains = skill.lower())
                    queryset = queryset.filter(skills_filter)
        except Freelancer.DoesNotExist:
            pass
    paginator = ActiveJobPagination()
    paginator_queryset = paginator.paginate_queryset(queryset, request)
    serializer = ActiveJobSerializer(paginator_queryset, many = True)
    return paginator.get_paginated_response(serializer.data)

@api_view(["GET"])
def get_freelancers(request):
    freelancers = Freelancer.objects.all()
    
    # Annotate total earning by accessing deliverables through assigned jobs
    queryset = Freelancer.objects.annotate(
        total_earning=Sum('assigned_jobs__deliverables__assigned_job__job__amount', 
                          filter=Q(assigned_jobs__deliverables__status='delivered'))
    )
    
    queryset = queryset.order_by('-total_earning')
    search_query = request.query_params.get('search', '')
    if search_query:
        search_terms = re.split(r'\W+', search_query)
        search_filter = Q()
        
        for term in search_terms:
            search_filter |= Q(profile__user__first_name__icontains=term) | Q(profile__user__last_name__icontains=term)
            search_filter |= Q(skills__name__icontains=term)
        queryset = queryset.filter(search_filter).distinct()
    paginator = ActiveJobPagination()
    paginator_queryset = paginator.paginate_queryset(queryset, request)
    serializer = FreelancerProfilePageSerializer(paginator_queryset, many=True)
    
    return paginator.get_paginated_response(serializer.data)


@api_view(["POST"])
def submit_proposal(request):
    data = request.data
    job_id = data.get("job")
    freelancer_id = data.get("freelancer")
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        active_job = ActiveJob.objects.get(id = job_id)
    except ActiveJob.DoesNotExist:
        return Response({"error" : "job not found!"}, status=status.HTTP_404_NOT_FOUND)
    try:
        freelancer = Freelancer.objects.get(id = freelancer_id)
    except Freelancer.DoesNotExist:
        return Response({"error" : "only authenticated freelancer can apply"}, status=status.HTTP_404_NOT_FOUND)
   
    if active_job.is_active != True:
        return Response({"close" : "job is not active"}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = ProposalSerializer(data = data)
    if serializer.is_valid():
        serializer.save()
        return Response({"success" : "Proposal submit"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
def assigned_job(request):
    data = request.data
    client_id = data.get("client")
    freelancer_id = data.get("freelancer")
    job_id = data.get("job")   
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    if client_id is None or freelancer_id is None or job_id is None:
        return Response({"error": "client, freelancer, and job are required fields."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        client = Client.objects.get(id = client_id)
    except Client.DoesNotExist:
        return Response({"error": "client does not exist"}, status=status.HTTP_400_BAD_REQUEST)
    if client.profile.user != request.user:
        return Response({"": "you are not allowed to assigned_jobs"}, status=status.HTTP_403_FORBIDDEN)
    serializer = AssignedJobSerializer(data = data)
    if serializer.is_valid():
        active_job = ActiveJob.objects.get(id = job_id)
        active_job.is_active = False
        active_job.save()
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
         