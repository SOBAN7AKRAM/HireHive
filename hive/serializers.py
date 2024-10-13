from rest_framework import serializers
from .models import User, Profile, EmailVerification, Client, Freelancer, Skills
from django.utils import timezone

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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password']
        extra_kwargs = {
            'password' : {'write_only': True}
        }
        
    def validate(self, data):
        data['first_name'] = data['first_name'].strip()
        data['last_name'] = data['last_name'].strip()
        
        password = data.get('password')
        if len(password) < 8:
            raise serializers.ValidationError({"password": "Password must be atleast 8 characters long"})  
        return data
              
    def create(self, validated_data):
        user = User(
            email = validated_data['email'], 
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class EmailVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailVerification
        fields = ["email", "otp", "created_at", "expired_at", "is_verified"]
        
    def create(self, validated_data):
        email_verification= EmailVerification.objects.update_or_create(
            email = validated_data['email'],
            defaults={
                'otp': validated_data['otp'],
                'expired_at': validated_data['expired_at'],
            }
        )
        return email_verification
        
    def verify_otp(self, email, otp):
        try:
            instance = EmailVerification.objects.get(email = email)
            if instance.otp == otp and instance.expired_at > timezone.now():
                instance.is_verified = True
                instance.save()
                return instance
            else:
                raise serializers.ValidationError("Invalid or Expired OTP")
        except EmailVerification.DoesNotExist:
            raise serializers.ValidationError("Email not found")
        
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["user", "picture", "available_balance", "location"]
        
    def update(self, instance, validated_data):
        instance.picture = validated_data.get('picture', instance.picture)
        instance.location = validated_data.get("location", instance.location)
        instance.available_balance = validated_data.get('available_balance', instance.available_balance)
        
        instance.save()
        return instance
        
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["profile", "company_name"]
   
class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = ["name"]   
        
class FreelancerSerializer(serializers.ModelSerializer):
    
    skills = serializers.ListField(child=serializers.CharField(), write_only=True)
    
    class Meta:
        model = Freelancer
        fields = ["profile", "bio", "bio_skill", "hourly_rate", "skills"]
        
    def update(self, instance, validated_data):
        instance.bio = validated_data.get("bio", instance.bio)
        instance.bio_skill = validated_data.get("bio_skill", instance.bio)
        instance.hourly_rate = validated_data.get("hourly_rate", instance.hourly_rate)

        skills_data = validated_data.get("skills")
        if skills_data is not None:
            skills_objects = []
            for name in skills_data:
                skill, created = Skills.objects.get_or_create(name = name.lower())
                skills_objects.append(skill)
            instance.skills.set(skills_objects)
        instance.save()
        
        return instance
        

                
        