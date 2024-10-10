from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
import json
import random
from django.conf import settings
from django.utils import timezone
from django.core.mail import send_mail
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from .models import User, Profile, EmailVerification,  Client, Skills, Freelancer, FreelancerProject, ProjectPicture, ActiveJob, AssignedJobAttachments, Proposal, AssignedJob, DeliverableJob, Feedback, FeedbackToClient, FeedbackToFreelancer
from django.db import transaction
import numpy as np

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


# Create your views here.
def sign_up(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status = 400)
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError as e:
        return JsonResponse({"error": f"Invalid Json {str(e)}"}, status = 400)
    if data:
        role = data.get("role")
        firstName = data.get("firstName")
        lastName = data.get("lastName")
        email = data.get("email")
        password = data.get("password")
        country = data.get("country")
    else:
        return JsonResponse({"error": "JSON is empty"}, status = 400)
    
    try:
        user = User.objects.get(email = email)
    except User.DoesNotExist:
        return JsonResponse({"error": "email verification error"}, status = 400)
    user.first_name = firstName
    user.last_name = lastName
    user.set_password(password)
    user.save()
    create_profile(user, country, role)
    return JsonResponse({"success": "Account Created Successfully"}, status = 400)

        
def create_profile(user, location, role):
    profile = Profile.objects.get_or_create(user = user, location = location, available_balance = 100)
    profile.save()
    if role == "client":
        client = Client.objects.get_or_create(profile = profile)
        client.save()
    else:
        freelancer = Freelancer.objects.get_or_create(profile = profile)
        freelancer.save()


def is_authenticated(request):
    if request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': True})
    else:
        return JsonResponse({'isAuthenticated': False})
    
def get_country(request):
    countries = [location for _, location in Profile.LocationChoices.choices]
    data = []
    for country in countries:
        data.append(country)
    if data:
        return JsonResponse({'countries' : data}, status = 201)
    return JsonResponse({"error" : "Empty list"})

def get_csrf_token(request):
    # Get CSRF token
    csrf_token = get_token(request)
    # Return CSRF token as JSON response
    return JsonResponse({'csrfToken': csrf_token})

def generate_otp():
    otp = np.random.choice(range(10), size = 6)
    otp_str = ""
    for i in range(6):
        otp_str += str(otp[i])
    print(otp_str)
    

def send_otp_email(email, otp):
    subject = "OTP Code for Hire-Hive"
    message = f"Your OTP code is {otp} for Hire-Hive email verification. It is valid for 2 minutes."
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)

def send_otp(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status = 400)
    data = json.loads(request.body)
    email = data.get('email')
    otp = generate_otp()
    expired_at = timezone.now() + timezone.timedelta(minutes=2)
    email_verification, created = EmailVerification.objects.update_or_create(
        email = email, 
        defaults={'otp': otp, 'expired_at' : expired_at}
    )
    send_otp_email(email, otp)
    return JsonResponse({"message": "otp sent successfully"})



def verify_otp(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status = 400)
    data = json.loads(request.body)
    sign_up_data = data.get('signUpData')
    email = sign_up_data.get('email')
    otp = data.get('otp')

    try:
        email_verification = EmailVerification.objects.get(email = email, otp = otp)
    except EmailVerification.DoesNotExist:
        return JsonResponse({"error": "Invalid otp or email"}, status = 400)
    if email_verification.expired_at < timezone.now():
        return JsonResponse({"error": "otp expired"}, status = 400)
    
    role = sign_up_data.get("role")
    first_name = sign_up_data.get("firstName")
    last_name = sign_up_data.get("lastName")
    email = sign_up_data.get("email")
    password = sign_up_data.get("password")
    country = sign_up_data.get("country")

    try:
        user = User.objects.create(firstname = first_name.strip(), lastname = last_name.strip(), email = email)
        user.set_password(password.strip())
        user.save()
    except IntegrityError:
        return JsonResponse({"error": "email already exist"}, status = 400)
    
    country_abr = country_abbreviations.get(country)
    create_profile(user, country_abr, role.strip())
    login(request, user)
    return JsonResponse({"Success": "Account Created"}, status = 203)
    