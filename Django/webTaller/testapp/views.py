from django.shortcuts import render
from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from page.models import *
from django.core import serializers
from django.http import HttpResponse
import json

def base(request):
        context = RequestContext(request)
        return render_to_response('base.html',context)
    
def seguimientoAl(request):
        if request.is_ajax():
            queryid = request.GET.get('queryId')
            info = "No entro en ninguna queryId"
            if(queryid == "course"):
                idC = request.GET.get('idCourse')
                courses = Course.objects.filter(idCourse=int(idC)) 
                info = serializers.serialize('json', courses)
            elif(queryid == "subjects"):
                idC = request.GET.get('idCourse')
                subjects = Subject.objects.filter(idCourse=int(idC))
                info = serializers.serialize('json', subjects)
            elif(queryid == "pupils"):
                idC = request.GET.get('idCourse')
                pupils = Pupil.objects.filter(idCourse=int(idC))
                info = serializers.serialize('json', pupils)
            elif(queryid == "pupilFollowing"):
                idP = request.GET.get('idPupil')
                idS = request.GET.get('idSubject')
                date = request.GET.get('date')
                pupilF = PupilFollowing.objects.filter(idPupil=int(idP), idSubject=int(idS), datePF=str(date))
                info = serializers.serialize('json', pupilF)
            elif(queryid == "fulfillments"):
                idS = request.GET.get('idSubject')
                fulfillments = Subject.objects.filter(idSubject=int(idS))
                info = serializers.serialize('json', fulfillments)
            elif(queryid == "projects"):
                idS = request.GET.get('idSubject')
                projects = Projects.objects.filter(idSubject=int(idS))
                info = serializers.serialize('json', projects)
            print "\033[1m Respuesta a la peticion de " + queryid + ": \033[0m \n" + info
            return HttpResponse(info)
        else:
            context = RequestContext(request)
            courses = Course.objects.all() 
            pupils = Pupil.objects.all() 
            subjects = Subject.objects.all() 
        return render_to_response('SeguimientoAlumno.html', {'courses':courses, 'subjects':subjects, 'pupils':pupils},context)
    

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
