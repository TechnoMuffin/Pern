# encoding utf-8
from __future__ import unicode_literals

from django.db import models
from django.conf import settings


class Profesores(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    
    def __str__(self):
        return str(self.user)
    
    class Meta:
        permissions = (
            ("Deshabilitado", u"El profesor no puede ingresar al sistema aun"),
            ("Habilitado", "El profesor puede ingresar al sistema y modificar datos"),
        )