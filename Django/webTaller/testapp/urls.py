from django.conf.urls import url, patterns
urlpatterns = patterns('',
                        url(r'^base$','testapp.views.base'),
			url(r'^seguimientoAlumno$','testapp.views.seguimientoAl', name='seg-al'),          
                       )
