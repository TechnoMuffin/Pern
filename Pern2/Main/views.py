from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from django.core import serializers
from django.http import HttpResponse
from database.models import *
import json

def pupilFollowing(request):
    info="como andas bro?"
    if request.is_ajax():
        if(queryid == "subjects"):
            idC = request.GET.get('idCourse')
            subjects = Subject.objects.filter(idCourse=int(idC))
            info = serializers.serialize('json', subjects)
        return HttpResponse(info)
    else:
        context = RequestContext(request)
        courses = Course.objects.all() 
        pupils = Pupil.objects.all() 
        subjects = Subject.objects.all() 
        return render_to_response('pupilFollowing.html', {'courses':courses, 'subjects':subjects, 'pupils':pupils},context)