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
        elif(queryid == "CheckFF"):
            idPF = request.GET.get('idPF')
            data = CheckFF.objects.filter(idPF=int(idPF))
            info = serializers.serialize('json', data)
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
            idP = request.GET.get('nameProject')
            project = Projects.objects.get(nameProject=idP)
            nuevaEtapa = ProjectStages()
            nuevaEtapa.namePS = a1
            nuevaEtapa.nameProject= project
            nuevaEtapa.save()
            info = "Stage Saved!"
        elif(queryid == "pupilFollow"):
            idP = request.GET.get('idPupil')
            idS = request.GET.get('idSubject')
            date = request.GET.get('date')
            commentPF = request.GET.get('commentPF')
            presencePF = request.GET.get('assist')
            pupilF = PupilFollowing.objects.filter(idPupil=int(idP), idSubject=int(idS), datePF=str(date))
            pupilF.update(commentPF=commentPF)
            if(presencePF == "true"):
                pupilF.update(presencePF=True)
            elif(presencePF == "false"):
                pupilF.update(presencePF=False)
            pupilF[0].save
            info = "Comment updated!"
        elif(queryid == "editStage"):
            newStageName = request.GET.get('newStageName')
            idStage = request.GET.get('idStage')
            projecto=ProjectStages.objects.filter(idPS=idStage)
            projecto.update(namePS=newStageName)
            projecto[0].save()
            info = "Stage Changed!"
        elif(queryid == "deleteStage"):
            idStage = request.GET.get('idStage')
            projecto=ProjectStages.objects.get(idPS=idStage)
            projecto.delete()
            info = "Stage Deleted!"
        elif(queryid == "getStages"):
            idProject = request.GET.get('idProject')
            project = Projects.objects.get(nameProject=idProject)
            stages = ProjectStages.objects.filter(nameProject=idProject)
            info = serializers.serialize('json', stages)
        elif(queryid == "projects"):
            idS = request.GET.get('idSubject')
            projects = Projects.objects.filter(idSubject=int(idS))
            info = serializers.serialize('json', projects)
        elif(queryid == "newProject"):
            nameProject= request.GET.get('nameProject')
            idSubject = request.GET.get('idSubject')
            newProjecto=Projects()
            newProjecto.nameProject = nameProject
            subject = Subject.objects.get(idSubject=int(idSubject))
            newProjecto.idSubject = subject
            newProjecto.save()
            info = "Se ha creado correctamente"
        elif(queryid == "delProject"):
            nameProject= request.GET.get('nameProject')
            idSubject = request.GET.get('idSubject')
            proj=Projects.objects.get(idSubject=int(idSubject),nameProject=str(nameProject))
            proj.delete()
            info = 'Se ha borrado correctamente el proyecto "'+nameProject+'"'
        print "\033[1m Respuesta a la peticion de " + str(queryid) + ": \033[0m \n" + str(info)
        return HttpResponse(info)
    else:
        proyectos = Projects.objects.all()
        context = RequestContext(request)
        courses = Course.objects.all() 
        pupils = Pupil.objects.all() 
        subjects = Subject.objects.all() 
        return render_to_response('SeguimientoAlumno.html', {'courses':courses, 'subjects':subjects, 'pupils':pupils, 'proyectos':proyectos},context)

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
    
    

