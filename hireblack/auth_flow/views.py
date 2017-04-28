from django.shortcuts import render, redirect
from django.views.generic import View
from django.contrib.auth import authenticate, logout, login
from models import SiteUser

# Create your views here.
class LoginView(View):
    template_name = 'login.html'

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        data = request._post
        user = authenticate(request, email=data['email'], password=data['password'])
        if user is None:
            return render(request, self.template_name, {'error':'Wrong username/password'})
        else:
            login(request, user)
            return redirect('/')

class RegisterView(View):
    template_name = 'register.html'

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        data = request._post
        user = SiteUser.objects.create_user(email=data['email'], password=data['password'], role='job_seeker')
        login(request, user)
        return redirect('/')

class EmployerLoginView(View):
    template_name = 'employer_login.html'

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        data = request._post
        user = authenticate(request, email=data['email'], password=data['password'])
        if user is None:
            return render(request, self.template_name, {'error':'Wrong username/password'})
        else:
            login(request, user)
            return redirect('/')

class EmployerRegisterView(View):
    template_name = 'employer_register.html'

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        data = request._post
        user = SiteUser.objects.create_user(email=data['email'], password=data['password'], role='employer')
        login(request, user)
        return redirect('/employers/')

class SignoutView(View):

    def get(self, request):
        logout(request)
        return redirect('/')