from django.conf.urls import url, patterns
urlpatterns = patterns('',
                       url(r'^base$','testapp.views.base'),
                       url(r'^seguimientoAlumno$','testapp.views.seguimientoAl', name='seg-al'),
                       url(r'^register$','testapp.views.registerUser', name='reg-user'),
                       url(r'^login$','testapp.views.loginUser'),
                       url(r'^olvidacontra$','testapp.views.olvidaContra'),
                       url(r'^admin$','testapp.views.loginAdmin'),
                       url(r'^selectAlum$','testapp.views.selectAlum'),    
                      )
