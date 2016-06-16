from django.contrib import admin
from .models import Pupil, Course, Subject, PupilFollowing

admin.site.register(Pupil)
admin.site.register(Course)
admin.site.register(Subject)
admin.site.register(PupilFollowing)
