from django.conf.urls import url
import views

urlpatterns = [
    url(r'^seguimientoAlumno$', views.pupilFollowing, name='seg-al'),
]