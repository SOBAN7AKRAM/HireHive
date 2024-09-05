from django.urls import path
from . import views

urlpatterns = [
    path("is_authenticated", views.is_authenticated, name="is_authenticated"), 
    path("get_country", views.get_country, name="get_country"),
    path("get_csrf_token", views.get_csrf_token, name="get_csrf_token"),
    path("sign_up", views.sign_up, name="sign_up"),
    path("send_otp", views.send_otp, name="send_otp"),
    path("verify_otp", views.verify_otp, name="verify_otp"),
]