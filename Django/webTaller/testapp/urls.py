from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^base$', views.base),
    url(r'^seguimientoAlumno$', views.seguimientoAl, name='seg-al'),
    url(r'^register$', views.registerUser, name='reg-user'),
    url(r'^login$', views.loginUser),
    url(r'^olvidacontra$', views.olvidaContra),
    url(r'^administrator$', views.loginAdmin),
    url(r'^documentos$',views.documentos),
]
