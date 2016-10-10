from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from django.core import serializers
from django.http import HttpResponse
from database.models import *
import json
from django.core.exceptions import ObjectDoesNotExist

def pupilFollowing(request):
    queryId = request.GET.get('queryId')
    info='...'
    if request.is_ajax():
        if(queryId == "subjects"):
        #Devuelve todos los modulos correspondientes al curso
            idC = request.GET.get('idCourse')
            if(idC!=''):
                curso = Course.objects.get(idCourse=int(idC))
                modulos = Module.objects.filter(idCourse=curso)
                info = serializers.serialize('json', modulos)
            else:
                info = "ERROR: No existe el modulo pedido"
                
        if(queryId == "projects"):
        #Devuelve todos los proyectos correspondientes al modulo
            idModule = request.GET.get('module')
            if(idModule!=''):
                module = Module.objects.get(idModule=int(idModule))
                projects = Project.objects.filter(idModule=module)
                info = serializers.serialize('json', projects)
            else:
                info = "ERROR: No existe el proyecto pedido"
        
        if(queryId == "activities"):
        #Devuelve todos las actividades correspondientes al proyecto
            idProject = request.GET.get('idProject')
            if(idProject!=''):
                project = Project.objects.get(idProject=int(idProject))
                activities = Activity.objects.filter(idProject=project)
                info = serializers.serialize('json', activities)
            else:
                info = "ERROR: No existen actividades para este proyecto"
                
        if(queryId == "working"):
        #Devuelve la informacion del trabajo correspondiente a la actividad seleccionada
            idActivity = request.GET.get('idActivity')
            idStudent = request.GET.get('idStudent')
            if(idActivity!=''):
                activity = Activity.objects.get(idActivity=int(idActivity))
                student = Student.objects.get(idUser=int(idStudent))
                try:
                    work = Working.objects.get(idActivity=activity,idStudent=student)
                    info = serializers.serialize('json', [work,activity])
                except ObjectDoesNotExist:
                    #Si el trabajo no existe, se creara uno nuevo y se enviara
                    newWork = Working()
                    newWork.idActivity = activity
                    newWork.idStudent = student
                    newWork.numberOfClasses=0
                    newWork.calification=0
                    newWork.hasFinish=False
                    newWork.save()
                    info = serializers.serialize('json', [newWork,activity])
            else:
                info= 'ERROR: No hay trabajo para esa actividad'
        
        elif(queryId == "students"):
        #Devuelve todos los alumnos pertenecientes al curso y al modulo
            idC = request.GET.get('idCourse')
            curso = Course.objects.get(idCourse=int(idC))
            rotation = Rotation.objects.filter(idCourse=curso)
            students = Student.objects.filter(idRotation=rotation)
            info = serializers.serialize('json', students)
            
        elif(queryId == "onlyStudent"):
        #Devuelve el alumno pedido
            idUser = request.GET.get('idStudent')
            student = Student.objects.filter(idUser=int(idUser))
            info = serializers.serialize('json', student)   
            
        elif(queryId == "getDataStudent"):
        #Devuelve la informacion del alumno seleccionado
            FCKINGID = request.GET.get('idStudent')
            if(FCKINGID!=''):
                student = Student.objects.filter(idUser=FCKINGID)
                info = serializers.serialize('json', student)
            else:
                info="ERROR: ID de Estudiante no encontrado"
        print info
        return HttpResponse(info)
    else:
        context = RequestContext(request)
        courses = Course.objects.all()
        pupils = Student.objects.all()
        subjects = Module.objects.all()
        return render_to_response('pupilFollowing.html', {'courses':courses, 'subjects':subjects, 'pupils':pupils},context)