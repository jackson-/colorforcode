from django.conf.urls import url
from job_board.views import IndexView

urlpatterns = [
    url(r'^', IndexView.as_view()),
]

