from rest_framework import serializers
from .models import User, Profile, EmailVerification, Client, Freelancer, Skills, FreelancerProject, ProjectPicture, ActiveJob, Proposal, AssignedJob
from django.utils import timezone
from django.db.models import Sum

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
        fields = ["id", 'first_name', 'last_name', 'email', 'password']
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
        fields = ["id", "user", "picture", "available_balance", "location"]
        
    def update(self, instance, validated_data):
        instance.picture = validated_data.get('picture', instance.picture)
        instance.location = validated_data.get("location", instance.location)
        instance.available_balance = validated_data.get('available_balance', instance.available_balance)
        
        instance.save()
        return instance
    def get_picture(self, obj):
        request = self.context.get('request')  # Access the request object to build the full URL
        if obj.picture and hasattr(obj.picture, 'url'):
            return request.build_absolute_uri(obj.picture.url) if request else obj.picture.url
        return None
        
class ClientSerializer(serializers.ModelSerializer):
    total_spent = serializers.ReadOnlyField()
    total_jobs_posted = serializers.ReadOnlyField()
    class Meta:
        model = Client
        fields = ["id", "profile", "company_name", "total_spent", "total_jobs_posted"]
    
    def update(self, instance, validated_data):
        instance.company_name = validated_data.get("company_name", instance.profile)
        instance.save()
        return instance
   
class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skills
        fields = ["id", "name"]   

class FreelancerSerializer(serializers.ModelSerializer):
    total_earning = serializers.SerializerMethodField()
    total_jobs_completed = serializers.ReadOnlyField()
    skills = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)  # For updates
    skills_display = serializers.SerializerMethodField()  # For GET requests

    class Meta:
        model = Freelancer
        fields = ["id", "profile", "bio", "bio_skill", "hourly_rate", "skills", "skills_display", "total_earning", "total_jobs_completed"]

    def get_total_earning(self, obj):
        if hasattr(obj, 'total_earning'):
            return obj.total_earning
        return obj.assigned_jobs.filter(deliverables__status='delivered').aggregate(
            total_earning=Sum('deliverables__assigned_job__job__amount')
        )['total_earning'] or 0

    def get_skills_display(self, obj):
        # Return a list of skill names
        return [skill.name for skill in obj.skills.all()]

    def create(self, validated_data):
        skills_data = validated_data.pop("skills", [])
        freelancer = super().create(validated_data)
        if skills_data:
            skills_objects = [Skills.objects.get_or_create(name=name.lower())[0] for name in skills_data]
            freelancer.skills.set(skills_objects)
        return freelancer

    def update(self, instance, validated_data):
        skills_data = validated_data.pop("skills", None)  # Use skills for updates
        instance = super().update(instance, validated_data)
        if skills_data is not None:
            skills_objects = [Skills.objects.get_or_create(name=name.lower())[0] for name in skills_data]
            instance.skills.set(skills_objects)  # Update the skills relationship
        return instance

  


    

class ProjectPicturesSerializers(serializers.ModelSerializer):
    class Meta:
        model = ProjectPicture
        fields = ["image"]
        
class FreelancerProjectSerializer(serializers.ModelSerializer):
    project_pictures = ProjectPicturesSerializers(many=True, read_only=True)
    pictures = serializers.ListField(
        child = serializers.ImageField(),
        write_only = True,
        required = False
    )
    id = serializers.ReadOnlyField()
    class Meta:
        model = FreelancerProject
        fields = ["id", "freelancer", "title", "description", "thumbnail", "link", "project_pictures", "pictures"]
        
    def validated_project_pictures(self, value):
        if len(value) > 3:
            raise serializers.ValidationError("Maximum 3 pictures allowed")
        return value
        
    def create(self, validated_data):
        pictures_data = validated_data.pop("pictures", [])
        project = FreelancerProject.objects.create(**validated_data)
        for picture_data in pictures_data:
            ProjectPicture.objects.create(project = project, image = picture_data)
        return project

    
    def to_representation(self, instance):
        """Customize the output of project_pictures to return only a list of image URLs."""
        representation = super().to_representation(instance)

        # Customize project_pictures to return a list of URLs
        representation['project_pictures'] = [picture.image.url for picture in instance.project_pictures.all()]

        return representation
    
    def update(self, instance, validated_data):
        pictures_data = validated_data.pop("pictures", [])
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.thumbnail = validated_data.get("thumbnail", instance.thumbnail)
        instance.link = validated_data.get("link", instance.link)
        if pictures_data:
            instance.project_pictures.all().delete()
        
            for picture_data in pictures_data:
                ProjectPicture.objects.create(project = instance, image = picture_data)
        
        instance.save()
        return instance
                
class FreelancerProfilePageSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    freelancer = serializers.SerializerMethodField()
    projects = serializers.SerializerMethodField()
    
    class Meta:
        model = Freelancer
        fields = ['user', 'profile', 'freelancer', 'projects']
        
    def get_user(self, obj):
        user_serializer = UserSerializer(obj.profile.user)
        return user_serializer.data
        
    def get_profile(self, obj):
        profile_serializer = ProfileSerializer(obj.profile, context = self.context)
        return profile_serializer.data
    def get_freelancer(self, obj):
        Freelancer_serializer = FreelancerSerializer(obj)
        return Freelancer_serializer.data
    def get_projects(self, obj):
        projects = obj.projects.all()
        projects_serializer = FreelancerProjectSerializer(projects, many = True)
        return projects_serializer.data
    
class ClientProfilePageSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    client = serializers.SerializerMethodField()
    
    class Meta:
        model = Freelancer
        fields = ['user', 'profile', 'client']
        
    def get_user(self, obj):
        user_serializer = UserSerializer(obj.profile.user)
        return {
            "first_name" : user_serializer.data["first_name"],
            "last_name" : user_serializer.data["last_name"],
        }
        
    def get_profile(self, obj):
        profile_serializer = ProfileSerializer(obj.profile)
        return profile_serializer.data
    def get_client(self, obj):
        client_serializer = ClientSerializer(obj)
        return client_serializer.data
    
class ActiveJobSerializer(serializers.ModelSerializer):
    skills_required = serializers.ListField(child = serializers.CharField())
    class Meta:
        model = ActiveJob
        fields = "__all__"
    
    def validate(self, data):
        if "client" not in data:
            raise serializers.ValidationError({"client": "This field is required."})
        client = data["client"]
        available_balance =  client.profile.available_balance
        if data["duration"] < 0 or data["amount"] < 0:
            raise serializers.ValidationError({"duration/amount" : "should be greater than zero"})
        if data["amount"] > available_balance:
            raise serializers.ValidationError({"erorr" : "Insufficient amount"})
        return data
    
    def create(self, validated_data):
        amount = validated_data.get("amount")
        client = validated_data.get("client")
        client.profile.available_balance -= amount
        client.profile.save()
        return super().create(validated_data)
    
class ProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = "__all__"
        
class AssignedJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignedJob
        fields = "__all__"
        
    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if end_date and start_date and end_date <= start_date:
            raise serializers.ValidationError("End date must be after start date.")
        
        return data