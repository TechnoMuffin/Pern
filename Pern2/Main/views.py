from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from django.core import serializers
from django.http import HttpResponse
from database.models import *
import json

def pupilFollowing(request):
    queryId = request.GET.get('queryId')
    info='...'
    if request.is_ajax():
        if(queryId == "subjects"):
            idC = request.GET.get('idCourse')
            if(idC!=''):
                subjects = Subject.objects.filter(idCourse=int(idC))
                info = serializers.serialize('json', subjects)
            else:
                info = "No se ha pedido ningun modulo"
        elif(queryId == "students"):
            idC = request.GET.get('idCourse')
            pupils = Pupil.objects.filter(idCourse=int(idC))
            info = serializers.serialize('json', pupils)
        print info
        return HttpResponse(info)
    else:
        context = RequestContext(request)
        courses = Course.objects.all()
        pupils = Pupil.objects.all()
        subjects = Subject.objects.all()
        return render_to_response('pupilFollowing.html', {'courses':courses, 'subjects':subjects, 'pupils':pupils},context)