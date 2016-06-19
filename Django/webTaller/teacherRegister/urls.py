from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^', views.nuevo_JefeArea, name="nuevo_JefeArea"),
    url(r'gracias/(?P<username>[\w]+)/$', views.gracias_view, name='gracias')
]
