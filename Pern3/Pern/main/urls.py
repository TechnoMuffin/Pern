# -*- coding: utf-8 -*-
from django.conf.urls import url
import views

urlpatterns = [
    url(r'^studentsFollowing$', views.studentsFollowing, name='studentsF'),
    url(r'^history$', views.history, name='history'),
    url(r'^rotations$', views.rotations, name='rotations'),
    url(r'^makeQueries$', views.ajaxQueries, name='ajax'),
    url(r'^projects$', views.projectsFollowing, name='projects'),
]