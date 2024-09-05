from django.test import TestCase, Client
from .models import User, Profile, Skills, Freelancer, FreelancerProject, ProjectPicture, ActiveJob, ActiveJobAttachement, Proposal, AssignedJob, DeliverableJob, Feedback, FeedbackToClient, FeedbackToFreelancer


class ModelsTestCases(TestCase):
    
    # def setUp(self):
        # create user objects
        # self.u1 = User.objects.create_user(username = 'david', email = 'd@gmail.com', password = 'david')
        # self.u2 = User.objects.create_user(username = 'harry', email = 'h@gmail.com', password = 'harry')
        # self.u2 = User.objects.create_user(username = 'client', email = 'client@gmail.com', password = 'client')
        # # create profile objects
        # self.p1 = Profile.objects.create(user = self.u1, bio =  "I am a C programmer",available_balance = 200, location = 'United State')
        # self.p2 = Profile.objects.create(user = self.u2, bio =  "I am a web developer", available_balance = 100, location = 'India')
        # self.p3 = Profile.objects.create(user = self.u3, bio =  "I am a client", available_balance = 500, location = 'Pakistan')
        
        
        # # create Client object
        # self.c1 = Client.objects.create(profile = self.p3, company_name = "7t world")
        
        # # create skills object
        # self.s1 = Skills.objects.create(name = "C")
        # self.s2 = Skills.objects.create(name = "C++")
        # self.s3 = Skills.objects.create(name = "Django")
        # self.s4 = Skills.objects.create(name = "python")
        # self.s5 = Skills.objects.create(name = "JavaScript")
        
        # # create freelancer object
        # self.f1 = Freelancer.objects.create(profile = self.p1, bio_skill = "C programmer", hourly_rate = 10, skills = [self.s1, self.s2])
        # self.f2 = Freelancer.objects.create(profile = self.p1, bio_skill = "Web developer", hourly_rate = 15, skills = [self.s3, self.s4, self.s5])
        
    # def test_freelancer_profile(self):
    #     p = Profile.objects.get()
    #     f = Freelancer.objects.get(profile = p)
    #     self.assertEqual()
    def test_country_api(self):
        c = Client()
        response = c.get('/get_country')
        self.assertEqual(response.status_code, 201)
        country = response.json()
        self.assertNotEqual(len(country["countries"]), 0)