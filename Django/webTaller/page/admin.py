from django.contrib import admin
from .models import Pupil, Course, Subject, PupilFollowing, Fulfillment, Projects, ProjectStages

admin.site.register(Pupil)
admin.site.register(Course)
admin.site.register(Subject)
admin.site.register(PupilFollowing)
admin.site.register(Fulfillment)
admin.site.register(Projects)
admin.site.register(ProjectStages)