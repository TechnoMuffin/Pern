from django.conf.urls import url
import views

urlpatterns = [
    url(r'^seguimientoAlumno$', views.pupilFollowing, name='seg-al'),
    url(r'^historial$', views.history, name='history'),
    url(r'^rotacionAlumno$', views.rotacionFollowing, name='rot-al'),
    url(r'^proyectos$', views.proyectosFollowing, name='pro-al'),
]
