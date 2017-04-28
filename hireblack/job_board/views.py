from django.shortcuts import render, redirect
from django.views.generic import View
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from django.utils.decorators import method_decorator
from auth_flow.models import SiteUser
from job_board.models import Job
import hireblack.settings as settings

# def decorator(func):
#     def wrapper(request, *args, **kwargs):
#         if request.user.is_authenticated():
#             if request.user.role != 'job_seeker':
#                 return redirect('/employer/')
#             else:
#                 return func(request, *args, **kwargs)
#         else:
#             return HttpResponseForbidden()
#     return wrapper

# Create your views here.
class IndexView(View):
    template_name = 'index.html'

    # @method_decorator(decorator)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)

    def get(self, request):
        jobs = Job.objects.all()
        return render(request, self.template_name, {'jobs':jobs})

