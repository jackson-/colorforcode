from django.conf.urls import url
from employers.views import IndexView, JobCreateView, JobDetailView

urlpatterns = [
    url(r'^job/(?P<pk>[0-9])', JobDetailView.as_view()),
    url(r'^create', JobCreateView.as_view()),
    url(r'^$', IndexView.as_view()),
]
