from django.shortcuts import render
from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from page.models import Course, Pupil, Subject
from django.core import serializers
from django.http import HttpResponse
import json

def base(request):
        context = RequestContext(request)
        return render_to_response('base.html',context)
    
def seguimientoAl(request):
        if request.is_ajax():
            queryid = request.GET.get('queryId')
            if(queryid == "course"):
                idC = request.GET.get('idCourse')
                courses = Course.objects.filter(idCourse=int(idC)) 
                info = serializers.serialize('json', courses)
            elif(queryid == "subject"):
                idC = request.GET.get('idCourse')
                subject = Subject.objects.filter(idCourse=int(idC))
                info = serializers.serialize('json', subject)
            elif(queryid == "pupil"):
                idC = request.GET.get('idCourse')
                pupil = Pupil.objects.filter(idCourse=int(idC))
                info = serializers.serialize('json', pupil)
            return HttpResponse(info)
        else:
            context = RequestContext(request)
            courses = Course.objects.all() 
            pupils = Pupil.objects.all() 
            subjects = Subject.objects.all() 
        return render_to_response('SeguimientoAlumno.html', {'courses':courses, 'subjects':subjects, 'pupils':pupils},context)

def registerUser(request):
        context = RequestContext(request)
        return render_to_response('CreaUsuario.html',context)
    
def loginUser(request):
        context = RequestContext(request)
        return render_to_response('Login.html',context)
    
def olvidaContra(request):
        context = RequestContext(request)
        return render_to_response('OlvidoContra.html',context)
    
def loginAdmin(request):
        context = RequestContext(request)
        return render_to_response('LogAdmin.html',context)
    
def documentos(request):
        context = RequestContext(request)
        return render_to_response('Documentos.html',context)
