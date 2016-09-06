from django.conf.urls import url
from Main import views

urlpatterns = [
    url(r'^$', views.seguimientoAl),
    url(r'^seguimientoAlumno$', views.seguimientoAl, name='seg-al'),

]