from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from ..models import User, EmailVerification, Profile, Freelancer, Client
from unittest.mock import patch
from django.utils import timezone
from rest_framework.authtoken.models import Token

class UserSignUpTests(APITestCase):
    def setUp(self):
        self.url = reverse('sign_up')
        self.data = {
            "role" : "freelancer",
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'password': 'testpassword123',
            'location' : "Germany",
        }
        
    def test_freelancer_signup(self):
        email_verif_succ = EmailVerification.objects.create(
            email = 'john.doe@example.com',
            otp = '123456',
            expired_at = timezone.now(),
            is_verified = True
            )
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'john.doe@example.com')
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(Profile.objects.get().user, User.objects.get())
        self.assertEqual(Freelancer.objects.count(), 1)
        self.assertEqual(Freelancer.objects.get().profile, Profile.objects.get())
        
    def test_client_signup(self):
        email_verif_succ = EmailVerification.objects.create(
            email = 'john.doe@example.com',
            otp = '123456',
            expired_at = timezone.now(),
            is_verified = True
            )
        client_data = self.data
        client_data['role'] = 'client'
        response = self.client.post(self.url, client_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().email, 'john.doe@example.com')
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(Profile.objects.get().user, User.objects.get())
        self.assertEqual(Client.objects.count(), 1)
        self.assertEqual(Client.objects.get().profile, Profile.objects.get())
        
    def test_invalid_role(self):
        email_verif_succ = EmailVerification.objects.create(
            email = 'john.doe@example.com',
            otp = '123456',
            expired_at = timezone.now(),
            is_verified = True
            )
        client_data = self.data
        client_data['role'] = 'clien'
        response = self.client.post(self.url, client_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        self.assertEqual(Client.objects.count(), 0)
        self.assertEqual(Freelancer.objects.count(), 0)
        self.assertEqual(Profile.objects.count(), 0)
        
    
    
    def test_signup_duplicate_email(self):
        User.objects.create_user(email='john.doe@example.com', password='testpassword123')
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

       
    def test_signup_short_password(self):
        # Test signup with a short password
        email_verif_succ = EmailVerification.objects.create(
            email = 'john.doe@example.com',
            otp = '123456',
            expired_at = timezone.now(),
            is_verified = True
            )
        data = {
            'role' : 'client',
            'first_name': 'Alice',
            'last_name': 'Smith',
            'email': 'john.doe@example.com',
            'password': 'short',
            'location' : 'Pakistan'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)
        

class SendOtpTests(APITestCase):
    def setUp(self):
        self.url = reverse("send_otp")
    
    @patch('hive.views.generate_otp', return_value = "123456")
    @patch("hive.views.send_otp_email")
    
    def test_send_otp_success(self, mock_send_otp_email, mock_generate_otp):
        data = {
            'email': 'msobanakram7@gmail.com',
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(EmailVerification.objects.filter(email='msobanakram7@gmail.com').exists())
        self.assertEqual(EmailVerification.objects.filter(email='msobanakram7@gmail.com').count(), 1)

        # Second request to resend OTP
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(EmailVerification.objects.filter(email='msobanakram7@gmail.com').count(), 1)
        self.assertEqual(mock_generate_otp.call_count, 2)
        self.assertEqual(mock_send_otp_email.call_count, 2)
        
class VerifyOtpTests(APITestCase):
    def setUp(self):
        self.url = reverse('verify_otp')
        self.email_verification = EmailVerification.objects.create(
            email = "msobanakram7@gmail.com", 
            otp = "123456", 
            expired_at = timezone.now() + timezone.timedelta(minutes=2)
            )
        
    def test_verify_otp_success(self):
        data = {
            "email" : "msobanakram7@gmail.com",
            "otp" : "123456"
        }
        response = self.client.post(self.url, data, format='json')
        em_v = EmailVerification.objects.get(email = data['email'])
        self.assertEqual(em_v.is_verified, True)
        
    def test_verify_otp_failure(self):
        data = {
            "email" : "msobanakram7@gmail.com",
            "otp" : "123458"
        }
        response = self.client.post(self.url, data, format='json')
        em_v = EmailVerification.objects.get(email = data['email'])
        self.assertEqual(em_v.is_verified, False)

class LogoutTestCase(APITestCase):

    def setUp(self):
        self.url = reverse("logout")
        # Set up a user and generate a token
        self.user = User.objects.create_user(email='testuser@example.com', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_logout_success(self):
        """Test that a user can log out successfully."""
        response = self.client.post(self.url)  # Call the logout endpoint
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"success": "Logged out successfully"})

        # Verify that the token is deleted after logout
        with self.assertRaises(Token.DoesNotExist):
            Token.objects.get(user=self.user)

    def test_logout_without_token(self):
        """Test logout without sending token."""
        # Clear the credentials, so no token is passed in the request
        self.client.credentials()
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Invalid token or user not logged in"})

class SignInTests(APITestCase):
    
    def setUp(self):
        self.url = reverse("sign_in")
        self.user = User(email='testuser@example.com', first_name = 'a', last_name = 'b')
        self.user.set_password('testpassword')
        self.user.save()
        self.profile = Profile.objects.create(user = self.user, available_balance = 100, location = "PK")
    
    def test_success_signIn_freelancer(self):
        freelancer = Freelancer.objects.create(profile = self.profile)
        data = {
            "email" : 'testuser@example.com',
            "password" : 'testpassword'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_failure(self):
        freelancer = Client.objects.create(profile = self.profile)
        data = {
            "email" : 'testuser@example.com',
            "password" : 'test'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    