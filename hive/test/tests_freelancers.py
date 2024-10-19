from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from ..models import User, Profile, Freelancer, Client, ActiveJob, Skills
from rest_framework.authtoken.models import Token
from urllib.parse import urlencode
class ProposalTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="soban@gmail.com", password="helloworld;", first_name = "soban", last_name = "Akram")
        self.user1 = User.objects.create_user(email="numan@gmail.com", password="helloworld;", first_name = "numan", last_name = "akram")
        self.profile = Profile.objects.create(user = self.user)
        self.profile1 = Profile.objects.create(user = self.user1)
        self.freelancer = Freelancer.objects.create(profile = self.profile)
        self.freelancer1 = Freelancer.objects.create(profile = self.profile1)
        self.token = Token.objects.create(user = self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)
        self.url = reverse("get_freelancers")
        
    def test_getting_freelancer_by_search(self):
        query_params = urlencode({
            "search": "numan",  # Searching for jobs with these skills
            "page": 1  # Add pagination if needed
        })
        url_with_query = f"{self.url}?{query_params}"
        response = self.client.get(url_with_query, format="json")
        self.assertEqual(len(response.data["results"]), 1)
    
    