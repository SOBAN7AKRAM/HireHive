from django.urls import path
from . import views

urlpatterns = [
    path("is_authenticated", views.is_authenticated, name="is_authenticated"), 
    path("get_country", views.get_country, name="get_country"),
    path("get_csrf_token", views.get_csrf_token, name="get_csrf_token"),
    path("sign_up", views.sign_up, name="sign_up"),
    path("send_otp", views.send_otp, name="send_otp"),
    path("verify_otp", views.verify_otp, name="verify_otp"),
    path("logout", views.log_out, name="logout"), 
    path("sign_in", views.sign_in, name="sign_in"),
    path("google/signin_signup", views.google_sign_up_or_sign_in, name="google/signin_signup"), 
    path("update_profile", views.update_profile, name="update_profile"), 
    path("freelancers/<int:freelancer_id>/update", views.update_freelancer, name="update_freelancer")
]