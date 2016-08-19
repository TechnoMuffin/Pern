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
            idCourse = request.GET.get('idCourse')
            idP = request.GET.get('nameProject')
            todos = request.GET.get('todos')
            idPupil = request.GET.get('idPupil')
            project = Projects.objects.get(nameProject=idP)
            if (todos=="1"): 
                course= Course.objects.get(idCourse=idCourse)
                pupils = Pupil.objects.filter(idCourse=course)
                for pupil in pupils:
                    nuevaEtapa = ProjectStages()
                    nuevaEtapa.namePS = a1
                    nuevaEtapa.nameProject= project
                    nuevaEtapa.calification=0
                    nuevaEtapa.classes=0
                    nuevaEtapa.idPupil=pupil
                    nuevaEtapa.save()    
            else:
                pupil = Pupil.objects.get(idPupil=idPupil)
                nuevaEtapa = ProjectStages()
                nuevaEtapa.namePS = a1
                nuevaEtapa.nameProject= project
                nuevaEtapa.calification=0
                nuevaEtapa.classes=0
                nuevaEtapa.idPupil=pupil
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
            projectAsoc = request.GET.get('nameProject')
            todos = request.GET.get('todos')
            idPupil = request.GET.get('idPupil')
            idCourse = request.GET.get('idCourse')
            calification = request.GET.get('calification')
            classesUsed = request.GET.get('classesUsed')
            project = Projects.objects.get(nameProject=projectAsoc)
            course= Course.objects.get(idCourse=idCourse)
            pupils = Pupil.objects.filter(idCourse=course)
            if (todos=="1"):
                #Get the name of the stage
                stage=ProjectStages.objects.get(idPS=idStage)
                nombre=stage.namePS
                print(nombre)
                #Update all Stages with the same name in the same project
                stages=ProjectStages.objects.filter(namePS=nombre,nameProject=projectAsoc)
                stages.update(namePS=newStageName)
            else:
                projecto=ProjectStages.objects.get(idPS=idStage)
                projecto.namePS=newStageName
                projecto.calification=calification
                projecto.classes=classesUsed
                projecto.save()
                #projecto.update(namePS=newStageName)
            info = "Stage Changed!"
        elif(queryid == "deleteStage"):
            idStage = request.GET.get('idStage')
            etapaBorrada = request.GET.get('etapaBorrada')
            if (etapaBorrada=="1"): 
                etapa = ProjectStages.objects.get(idPS=idStage)
                nombreStage = etapa.namePS
                nombreProjecto = etapa.nameProject.nameProject
                ProjectStages.objects.filter(namePS=nombreStage,nameProject=nombreProjecto).delete()
            else :
                etapa = ProjectStages.objects.get(idPS=idStage)
                nombreStage = etapa.namePS
                nombreProjecto = etapa.nameProject.nameProject
                etapa.delete()
            info = 'Se ha borrado correctamente la etapa "'+nombreStage+'" del proyecto "'+nombreProjecto+'"'
        elif(queryid == "getStages"):
            idProject = request.GET.get('idProject')
            idPupil = request.GET.get('idPupil')
            project = Projects.objects.get(nameProject=idProject)
            pupil = Pupil.objects.get(idPupil=idPupil)
            stages = ProjectStages.objects.filter(nameProject=idProject, idPupil=pupil)
            info = serializers.serialize('json', stages)
        elif(queryid == "projects"):
            idS = request.GET.get('idSubject')
            projects = Projects.objects.filter(idSubject=int(idS))
            info = serializers.serialize('json', projects)
#        elif(queryid == "getCalifications"):
#            idProject = request.GET.get('idProject')
#            idPupil = request.GET.get('idPupil')  
#            project = Projects.objects.get(nameProject=idProject)
#            califications = Calification.objects.filter(idProject='idProject',idPupil='idPupil')
#            info = serializers.serialize('json', califications)
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