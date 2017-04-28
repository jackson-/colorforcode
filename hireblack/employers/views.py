from django.shortcuts import render, redirect
from django.views.generic import View
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from django.utils.decorators import method_decorator
from auth_flow.models import SiteUser
from job_board.models import Job, Application
import hireblack.settings as settings

def decorator(func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated():
            if request.user.role != 'employer':
                return redirect('/')
            else:
                return func(request, *args, **kwargs)
        else:
            return HttpResponseForbidden()
    return wrapper

# Create your views here.
class IndexView(View):
    template_name = 'control_panel.html'

    @method_decorator(decorator)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)

    def get(self, request):
        try:
            jobs = Job.objects.filter(employer=request.user)
        except:
            jobs= []
        return render(request, self.template_name, {'jobs':jobs})

class JobDetailView(View):
    template_name = 'job_detail.html'

    @method_decorator(decorator)
    def dispatch(self, *args, **kwargs):
        return super(JobDetailView, self).dispatch(*args, **kwargs)

    def get(self, request, pk):
        job = Job.objects.get(pk=pk)
        applicants = Application.objects.filter(job=job)
        return render(request, self.template_name, {'job':job, 'applicants':applicants})

class JobCreateView(View):

    def post(self, request):
        data = request._post
        Job.objects.create(title=data['title'], description=data['description'], employer=request.user)
        return redirect('/employers/')