from django.conf.urls import url
from testapp import views

urlpatterns = [
    url(r'^', views.loginUser),
    url(r'^base$', views.base),
    url(r'^seguimientoAlumno$', views.seguimientoAl, name='seg-al'),
    url(r'^olvidacontra$', views.olvidaContra),
    url(r'^administrator$', views.loginAdmin),
    url(r'^documentos$',views.documentos),
#    url(r'^selectAlum$',views.selectAlum),    

]