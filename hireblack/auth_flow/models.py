from auth_flow.user_manager import SiteUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

class SiteUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, blank=False)
    role = models.CharField(max_length=40, default='job_seeker')
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'

    objects = SiteUserManager()

    def get_full_name(self):
        return self.email

    def get_short_name(self):
        return self.email