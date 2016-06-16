from django.conf.urls import patterns, include, url

urlpatterns = patterns("",
                       url(r'^$', 'teacherRegister.views.nuevo_JefeArea', name="nuevo_JefeArea"),
                       url(r'^ingreso/$', 'teacherRegister.views.ingresar', name="ingreso"),
                       url(r'gracias/(?P<username>[\w]+)/$', 'teacherRegister.views.gracias_view', name='gracias')
)