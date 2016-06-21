from __future__ import unicode_literals

from django.db import models
from django.conf import settings


class Profesores(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,max_length=128)
    
    def __str__(self):
        return str(self.user)