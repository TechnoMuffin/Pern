from django.conf.urls import url
import views

urlpatterns = [
    url(r'^seguimientoAlumno$', views.pupilFollowing, name='seg-al'),
    url(r'^historial$', views.history, name='history'),
    url(r'^rotacionAlumno$', views.rotation, name='rot-al'),
    url(r'^proyectos$', views.projectFollowing, name='projects'),
    url(r'^documents$', views.document, name='doc'),
]
