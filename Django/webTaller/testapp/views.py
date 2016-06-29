from django.shortcuts import render
from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from page.models import Course, Pupil, Subject, PupilFollowing, CheckFF, Fulfillment, Projects, ProjectStages
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
        elif(queryid == "projectStage"):
            a1 = request.GET.get('dato1')
            a2 = request.GET.get('dato2')
            a3 = request.GET.get('dato3')
            idP = request.GET.get('nameProject')
            project = Projects.objects.get(nameProject=idP)
            nuevaEtapa = ProjectStages()
            nuevaEtapa.namePS = a1
            nuevaEtapa.calification = a2
            nuevaEtapa.classes = a3
            nuevaEtapa.nameProject= project
            nuevaEtapa.save()
            info = "Stage Saved!"
        print "\033[1m Respuesta a la peticion de " + str(queryid) + ": \033[0m \n" + str(info)
        return HttpResponse(info)
    else:
        stages = ProjectStages.objects.filter(nameProject="martillo")
        proyectos = Projects.objects.all()
        context = RequestContext(request)
        courses = Course.objects.all() 
        pupils = Pupil.objects.all() 
        subjects = Subject.objects.all() 
        return render_to_response('SeguimientoAlumno.html', {'courses':courses, 'subjects':subjects, 'pupils':pupils, 'proyectos':proyectos, 'stages':stages},context)

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
