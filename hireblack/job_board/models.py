from django.db import models
from auth_flow.models import SiteUser

# Create your models here.
class Job(models.Model):
    title = models.CharField(max_length=40)
    description = models.TextField()
    employer = models.ForeignKey(SiteUser, on_delete=models.CASCADE)

class Application(models.Model):
    cover_letter = models.TextField(null=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applicant = models.ForeignKey(SiteUser, on_delete=models.CASCADE)


