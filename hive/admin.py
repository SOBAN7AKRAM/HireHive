from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.User)
admin.site.register(models.EmailVerification)
admin.site.register(models.Profile)
admin.site.register(models.Client)
admin.site.register(models.Freelancer)

