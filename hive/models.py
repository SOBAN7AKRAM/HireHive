from django.db import models, migrations
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)
    
class User(AbstractUser):
    email = models.EmailField(unique = True)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    
class EmailVerification(models.Model):
    email = models.EmailField(default='default@example.com')
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expired_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)
    
    
class Profile(models.Model):
    
    class LocationChoices(models.TextChoices):
        United_State = 'US', 'United State'
        Pakistan = 'PK', 'Pakistan'
        India = 'IN', 'India'
        United_Kingdom = 'GB', 'United Kingdom'
        Germany = 'DE', 'Germany'
        Russia = 'RU', 'Russia'
        Saudi_Arabia = 'SA', "Saudi Arabia"
        Qatar = 'QA', "Qatar"
        China  = 'CN', 'China'
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(default='', upload_to='profile/images')
    available_balance = models.DecimalField(max_digits=8, decimal_places=2, default = 100)
    location = models.CharField(
        max_length=2, 
        choices=LocationChoices.choices,
        default=LocationChoices.Pakistan
    )

class Client(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100, null=True, blank=True)
    @property
    def total_spent(self):
        total_spent = 0
        for assigned_job in self.assigned_jobs.filter(status='completed'):
            total_spent += assigned_job.job.amount
        return total_spent

    @property
    def total_jobs_posted(self):
        return self.active_jobs.count()
    
class Skills(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name
    

    
class Freelancer(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    bio_skill = models.CharField(max_length=100, blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    skills = models.ManyToManyField(Skills, blank=True)
    # @property
    # def total_earning(self):
    #     total_earning = 0
    #     for deliverable_job in self.deliverables.filter(status='delivered'):
    #         total_earning += deliverable_job.assigned_job.job.amount
    #     return total_earning
    @property
    def total_jobs_completed(self):
        return self.assigned_jobs.filter(status='completed').count()
    
    
    def __str__(self):
        return f"{self.bio_skill} hourly_rate {self.hourly_rate}"
   
    
class FreelancerProject(models.Model):
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=100)
    description = models.TextField()
    link = models.URLField(blank=True, null=True)
    thumbnail = models.ImageField(default="", upload_to='projects/thumbnails')
    def __str__(self):
        return f"{self.title} project of {self.freelancer.profile.user.username}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['freelancer', 'title'], name='unique_project_title_per_freelancer')
        ]
    
class ProjectPicture(models.Model):
    project = models.ForeignKey(FreelancerProject, on_delete=models.CASCADE, related_name="project_pictures")
    image = models.ImageField(default='', upload_to='projects/pictures')
   
 
    
class ActiveJob(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="active_jobs")
    description = models.TextField()
    title = models.CharField(max_length=100)
    skills_required = models.JSONField(blank=True, null=True)
    duration = models.FloatField()
    posted_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    link = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.title} posted by {self.client.profile.user.username}"
        
   
class Proposal(models.Model):
    job = models.ForeignKey(ActiveJob, on_delete=models.CASCADE, related_name="proposals")
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name="proposals")
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Sent by {self.freelancer.profile.user.username} on job {self.job.title}"
     
class AssignedJob(models.Model):
    job = models.OneToOneField(ActiveJob, on_delete=models.CASCADE)
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name="assigned_jobs")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="assigned_jobs")
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('ongoing', 'Ongoing'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='ongoing')
    
    def __str__(self):
        return f"Assigned Job: {self.job.title} to {self.freelancer.profile.user.username}"
    
class AssignedJobAttachments(models.Model):
    job = models.ForeignKey(AssignedJob, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to='jobs/attachments') 
    
class DeliverableJob(models.Model):
    assigned_job = models.ForeignKey(AssignedJob, on_delete=models.CASCADE, related_name="deliverables")
    file = models.FileField(upload_to='deliverablesJob/files')
    delivered_at = models.DateTimeField(auto_now_add=True)    
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('delivered', 'Delivered')], default='pending')
    
class Feedback(models.Model):
    deliverable_job = models.OneToOneField(DeliverableJob, on_delete=models.CASCADE)
    feedback = models.TextField()
    feedback_star = models.IntegerField(choices=[(1, '1 Star'), (2, '2 Stars'), (3, '3 Stars'), (4, '4 Stars'), (5, '5 Stars')])
    
class FeedbackToClient(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name="feedback_to_client")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="client_feedback")
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name="freelancer_given_feedback")

class FeedbackToFreelancer(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name="feedback_to_freelancer")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="client_given_feedback")
    freelancer = models.ForeignKey(Freelancer, on_delete=models.CASCADE, related_name="freelancer_feedback")


class Chat(models.Model):
    participants = models.ManyToManyField(User, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat between {', '.join([user.email for user in self.participants.all()])}"


class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    content = models.TextField()
    file = models.FileField(upload_to='messages/files/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender.email} at {self.timestamp}"
