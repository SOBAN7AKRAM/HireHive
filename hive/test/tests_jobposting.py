from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from ..models import User, Profile, Freelancer, Client, ActiveJob, Skills
from rest_framework.authtoken.models import Token
from urllib.parse import urlencode

class JobPostingTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="test@gmail.com", password="helloworld;")
        self.profile = Profile.objects.create(user = self.user)
        self.clint = Client.objects.create(profile = self.profile)
        self.token = Token.objects.create(user = self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)
        self.url = reverse("job_posting")
    def test_success(self):
        data = {
            "client" : self.clint.id, 
            "title" : "react job", 
            "description" : "create two pages", 
            "duration" : 45,
            "amount" : 70,
            "skills_required" : ["python", "javascript"]
        }
        response = self.client.post(self.url, data = data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ActiveJob.objects.count(), 1)
        self.assertEqual(ActiveJob.objects.get(client = self.clint).skills_required, data["skills_required"])
        self.assertEqual(Client.objects.get(id = self.clint.id).profile.available_balance, 30)
        
    def test_invalid_data(self):
        data = {
            "client" : self.clint.id, 
            "title" : "react job", 
            "description" : "create two pages", 
            "duration" : -10,
            "amount" : 70,
            "skills_required" : ["python", "javascript"]
        }
        response = self.client.post(self.url, data = data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ActiveJob.objects.count(), 0)
        
    def test_insufficient_amount(self):
        data = {
            "client" : self.clint.id, 
            "title" : "react job", 
            "description" : "create two pages", 
            "duration" : 10,
            "amount" : 170,
            "skills_required" : ["python", "javascript"]
        }
        response = self.client.post(self.url, data = data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ActiveJob.objects.count(), 0)
        self.assertEqual(Client.objects.get(id = self.clint.id).profile.available_balance, 100)
        
        
class GetActiveJobTesting(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="test@gmail.com", password="helloworld;")
        self.profile = Profile.objects.create(user = self.user)
        self.clint = Client.objects.create(profile = self.profile)
        for i in range(1, 23):
            activejob = ActiveJob.objects.create(
            client=self.clint,  # Fix the 'client' field (it was 'clint')
            title=f"hello {i}",
            description="h",
            duration=2,
            amount=5
            )
        setattr(self, f'activejob{i}', activejob)
        self.token = Token.objects.create(user = self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)
        
    def test_success(self):
        url_without_query = reverse("get_active_jobs")
        query_params = urlencode({"page": 1})
        url_with_query = f"{url_without_query}?{query_params}"
        response = self.client.get(url_with_query)
        
    def test_get_jobs_by_search(self):
        
        ac1 = ActiveJob.objects.create(
            client=self.clint,
            title=f"hello world",
            description="h",
            duration=2,
            amount=5,
            skills_required = ["python", "javascript"]
            )
        ac2 = ActiveJob.objects.create(
            client=self.clint, 
            title=f"hello wod",
            description="h",
            duration=2,
            amount=5,
            skills_required = ["python"]
            )
        url = reverse("get_active_jobs")
        query_params = urlencode({
            "skills": "python,javascript",  # Searching for jobs with these skills
            "page": 1  # Add pagination if needed
        })
        url_with_query = f"{url}?{query_params}"
        response = self.client.get(url_with_query, format="json")
        self.assertEqual(len(response.data["results"]), 2)
        # print(response.data)
        
class ProposalTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="test@gmail.com", password="helloworld;")
        self.user1 = User.objects.create_user(email="test1@gmail.com", password="helloworld;")
        self.profile = Profile.objects.create(user = self.user)
        self.profile1 = Profile.objects.create(user = self.user1)
        self.clien = Client.objects.create(profile = self.profile1)
        self.freelancer = Freelancer.objects.create(profile = self.profile)
        self.token = Token.objects.create(user = self.user)
        self.activejob = ActiveJob.objects.create(
            client=self.clien,
            title=f"hello",
            description="h",
            duration=2,
            amount=5
        )
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)
        self.url = reverse("submit_proposal")
        
    def test_success(self):
        data = {
            "job" : self.activejob.id, 
            "freelancer" : self.freelancer.id,
            "content" : "available",
        }
        response = self.client.post(self.url, data = data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_failure(self):
        data = {
            "job" : self.activejob.id, 
            "freelancer" : self.freelancer.id,
        }
        response = self.client.post(self.url, data = data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
 
class AssignedJobTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="test@gmail.com", password="helloworld;")
        self.user1 = User.objects.create_user(email="test1@gmail.com", password="helloworld;")
        self.profile = Profile.objects.create(user = self.user)
        self.profile1 = Profile.objects.create(user = self.user1)
        self.clien = Client.objects.create(profile = self.profile1)
        self.freelancer = Freelancer.objects.create(profile = self.profile)
        self.token = Token.objects.create(user = self.user1)
        self.activejob = ActiveJob.objects.create(
            client=self.clien,
            title=f"hello",
            description="h",
            duration=2,
            amount=5
        )
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION = "Token " + self.token.key)
        self.url = reverse("assigned_job")
        
    def test_success(self):
        data = {
            "client" : self.clien.id, 
            "freelancer" : self.freelancer.id,
            "job" : self.activejob.id, 
        }
        response = self.client.post(self.url, data = data, format = "json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ActiveJob.objects.get(id = self.activejob.id).is_active, False)
    
    