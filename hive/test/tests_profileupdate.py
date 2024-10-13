from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from ..models import User, Profile, Freelancer, Client, Skills
from rest_framework.authtoken.models import Token

class ProfileUpdateTestCases(APITestCase):
    def setUp(self):
        self.url = reverse("update_profile")
        self.user = User.objects.create_user(email='testuser@example.com', password='testpassword')
        self.profile = Profile.objects.create(user = self.user, location = "PK")
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
    def test_location_update(self):
        response = self.client.put(self.url, {'location': "germany", "user_id" : self.user.pk}, format="json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(Profile.objects.get(user = self.user).location, "DE")
        
    # def test_picture_update(self):
    #     response = self.client.put(self.url, {'location': "germany", "user_id" : self.user.pk}, format="json")
        
class FreelancerUpdateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='testpassword')
        self.profile = Profile.objects.create(user = self.user, location = "PK")
        self.freelancer = Freelancer.objects.create(profile = self.profile, bio = "initial bio")
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.url = reverse("update_freelancer", kwargs={"freelancer_id" : self.freelancer.id})
        
    def test_bio_update_success(self):
        response = self.client.put(self.url, {"bio" : "Hello, world"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Freelancer.objects.count(), 1)
        self.assertEqual(Freelancer.objects.get(id = self.freelancer.id).bio, "Hello, world")
        self.assertEqual(response.data.get("bio"), Freelancer.objects.get(id = self.freelancer.id).bio)
        
    def test_hourly_rate_update_success(self):
        response = self.client.put(self.url, {"hourly_rate" : "76"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Freelancer.objects.count(), 1)
        self.assertEqual(response.data.get("hourly_rate"), str(Freelancer.objects.get(id = self.freelancer.id).hourly_rate))
        
    def test_skills_update_success(self):
        response = self.client.put(self.url, {"skills" : ["python", "javascript", "react"]}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Freelancer.objects.count(), 1)
        self.assertEqual(Skills.objects.count(), 3)
        self.assertEqual(response.data.get("skills"), [skill.name for skill in Freelancer.objects.get(id = self.freelancer.id).skills.all()])
        
        # adding new skills
        response = self.client.put(self.url, {"skills" : ["python", "javascript", "django"]}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Freelancer.objects.count(), 1)
        self.assertEqual(Skills.objects.count(), 4)
        self.assertEqual(response.data.get("skills"), [skill.name for skill in Freelancer.objects.get(id = self.freelancer.id).skills.all()])
        self.assertEqual(["python", "javascript", "react", "django"].sort(), [skill.name for skill in Freelancer.objects.get(id = self.freelancer.id).skills.all()].sort())
        
    def test_invalid_user(self):
        invalid_freelancer_id = reverse("update_freelancer", kwargs={"freelancer_id" : 10})
        response = self.client.put(invalid_freelancer_id, {"skills" : ["python", "javascript", "react"]}, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Skills.objects.count(), 0)
        
    def test_not_profile_freelancer(self):
        user1 = User.objects.create_user(email='test@example.com', password='testpassword')
        profile1 = Profile.objects.create(user = user1, location = "PK")
        freelancer1 = Freelancer.objects.create(profile = profile1)
        token1 = Token.objects.create(user=user1)
        client1 = APIClient()
        client1.credentials(HTTP_AUTHORIZATION='Token ' + token1.key)
        
        response = client1.put(self.url, {"bio", "Hello, world"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        