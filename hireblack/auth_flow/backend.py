from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login
from auth_flow.models import SiteUser

class MyBackend(object):
    """
    Authenticate against the settings ADMIN_LOGIN and ADMIN_PASSWORD.

    Use the login name and a hash of the password. For example:

    ADMIN_LOGIN = 'admin'
    ADMIN_PASSWORD = 'pbkdf2_sha256$30000$Vo0VlMnkR4Bk$qEvtdyZRWTcOsCnI/oQ7fVOu1XAURIZYoOZ3iq8Dr4M='
    """

    def authenticate(self, request, email=None, password=None):
        try:
            user = SiteUser.objects.get(email=email)
            if user is not None:
                if user.password == password:
                    login(request, user)
                    return user
            return None
        except SiteUser.DoesNotExist:
            return None



    def get_user(self, user_id):
        try:
            return MyUser.objects.get(pk=user_id)
        except MyUser.DoesNotExist:
            return None