from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from ..models import User, Profile, Freelancer, Client, Skills, ProjectPicture, FreelancerProject, Skills
from rest_framework.authtoken.models import Token
from django.core.files.uploadedfile import SimpleUploadedFile
import io
from PIL import Image

def generate_test_image():
    # Create a simple image using PIL for testing
    image = io.BytesIO()
    img = Image.new('RGB', (100, 100), color = (73, 109, 137))
    img.save(image, format='JPEG')
    image.seek(0)
    return SimpleUploadedFile("test_image.jpg", image.getvalue(), content_type="image/jpeg")

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
        invalid_freelancer_id = reverse("update_freelancer", kwargs={"freelancer_id" : 100})
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
        
class ClientUpdateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='testpassword')
        self.profile = Profile.objects.create(user = self.user, location = "PK")
        self.clint = Client.objects.create(profile = self.profile, company_name = "7tworld")
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.url = reverse("update_client", kwargs={"client_id" : self.clint.id})
        
    def test_bio_update_success(self):
        response = self.client.put(self.url, {"company_name" : "openai"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Client.objects.count(), 1)
        self.assertEqual(Client.objects.get(id = self.clint.id).company_name, "openai")
        
class FreelancerProjectAddTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='testpassword')
        self.user2 = User.objects.create_user(email='test@example.com', password='testpassword')
        self.profile = Profile.objects.create(user = self.user, location = "PK")
        self.profile2 = Profile.objects.create(user = self.user2, location = "PK")
        self.freelancer = Freelancer.objects.create(profile = self.profile)
        self.freelancer2 = Freelancer.objects.create(profile = self.profile2)
        self.token = Token.objects.create(user=self.user)
        self.token2 = Token.objects.create(user=self.user2)
        self.client = APIClient()
        self.client2 = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.client2.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)
        self.url = reverse("create_portfolio_project")
        
    def test_success_add(self):
        image1 = generate_test_image()
        image2 = generate_test_image()
        data = {
            "freelancer" : self.freelancer.id,
            "title" : "project one",
            "description" : "web based project",
            "thumbnail" : generate_test_image(),
            "link" : "https://chatgpt.com/c/670d50fa-b158-800d-a786-28efe211a352",
            "pictures" : [image1, image2]
        }
        response = self.client.post(self.url,data=data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ProjectPicture.objects.count(), 2)
        
        data = {
            "freelancer" : self.freelancer2.id,
            "title" : "project one",
            "description" : "web based project",
            "thumbnail" : generate_test_image(),
            "link" : "https://chatgpt.com/c/670d50fa-b158-800d-a786-28efe211a352",
            "pictures" : [generate_test_image()]
        }
        response = self.client2.post(self.url, data = data, format = "multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ProjectPicture.objects.count(), 3)
        freelncer_project = FreelancerProject.objects.filter(freelancer = self.freelancer2).first()
        self.assertEqual(freelncer_project.project_pictures.count(), 1)
        
    def test_invalid_freelancer(self):
        data = {
            "freelancer" : self.freelancer2.id,
            "title" : "project one",
            "description" : "web based project",
            "thumbnail" : generate_test_image(),
            "link" : "https://chatgpt.com/c/670d50fa-b158-800d-a786-28efe211a352",
            "pictures" : [generate_test_image()]
        }
        response = self.client.post(self.url,data=data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(ProjectPicture.objects.count(), 0)
        
class FreelancerProjectUpdateTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='testpassword')
        self.profile = Profile.objects.create(user = self.user, location = "PK")
        self.freelancer = Freelancer.objects.create(profile = self.profile)
        self.freelancerProject = FreelancerProject.objects.create(freelancer = self.freelancer, title = "project1", description = "Hello, World")
        self.projectPictures = ProjectPicture.objects.create(project = self.freelancerProject, image = generate_test_image())
        self.projectPictures1 = ProjectPicture.objects.create(project = self.freelancerProject, image = generate_test_image())
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.url = reverse("update_portfolio_project", kwargs={"project_id" : self.freelancerProject.id})
        
    def test_success_update(self):
        data = {
            "freelancer" : self.freelancer.id,
            "title" : "Project2", 
            "description" : "Hello", 
            "pictures" : [generate_test_image()]
        }
        response = self.client.put(self.url, data = data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(FreelancerProject.objects.count(), 1)
        self.assertEqual(ProjectPicture.objects.count(), 1)
        self.assertEqual(response.data["title"], data["title"])
        
class GetFreelancerProfilePageTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='testpassword', first_name = "soban", last_name = "akram")
        self.profile = Profile.objects.create(user = self.user, location = "PK", available_balance = 700)
        self.freelancer = Freelancer.objects.create(profile = self.profile, bio_skill = "web devloper", bio = "I am a web developer", hourly_rate = 500)
        self.freelancerProject = FreelancerProject.objects.create(freelancer = self.freelancer, title = "project1", description = "Hello, World")
        self.projectPictures = ProjectPicture.objects.create(project = self.freelancerProject, image = generate_test_image())
        self.projectPictures1 = ProjectPicture.objects.create(project = self.freelancerProject, image = generate_test_image())
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.url = reverse("get_freelancer_profile_page", kwargs={"freelancer_id" : self.freelancer.id})
        
    def test_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)
        
class GetClientProfilePageTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='testpassword', first_name = "soban", last_name = "akram")
        self.profile = Profile.objects.create(user = self.user, location = "PK", available_balance = 700)
        self.clint = Client.objects.create(profile = self.profile, company_name = "web devloper")
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.url = reverse("get_client_profile_page", kwargs={"client_id" : self.clint.id})
        
    def test_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)
        