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
    path("freelancers/<int:freelancer_id>/update", views.update_freelancer, name="update_freelancer"), 
    path("client/<int:client_id>/update", views.update_client, name="update_client"),
    path("create_portfolio_project", views.create_portolio_project, name="create_portfolio_project"),
    path("update_portfolio_project/<int:project_id>", views.update_portfolio_project, name="update_portfolio_project"),
    path("get_freelancer_profile_page/<int:freelancer_id>", views.get_freelancer_profile_page, name="get_freelancer_profile_page"),
    path("get_client_profile_page/<int:client_id>", views.get_client_profile_page, name="get_client_profile_page"),
    path("job_posting", views.job_posting, name="job_posting"),
    path("get_active_jobs/", views.get_active_jobs, name="get_active_jobs"),
    path("submit_proposal", views.submit_proposal, name="submit_proposal"),
    path("get_freelancers/", views.get_freelancers, name="get_freelancers")
]