from django.conf.urls import url
from auth_flow.views import LoginView, RegisterView,EmployerLoginView, EmployerRegisterView, SignoutView

urlpatterns = [
    url(r'^login/employer', EmployerLoginView.as_view()),
    url(r'^register/employer', EmployerRegisterView.as_view()),
    url(r'^login', LoginView.as_view()),
    url(r'^register', RegisterView.as_view()),
    url(r'^signout', SignoutView.as_view()),
]
