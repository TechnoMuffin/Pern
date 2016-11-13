from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from django.core import serializers
from django.http import HttpResponse
from database.models import *
import json
from django.core.exceptions import ObjectDoesNotExist
from itertools import chain

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

        elif(queryId == "projects"):
        #Devuelve todos los proyectos correspondientes al modulo
            idModule = request.GET.get('module')
            if(idModule!=''):
                module = Module.objects.get(idModule=int(idModule))
                projects = Project.objects.filter(idModule=module)
                info = serializers.serialize('json', projects)
            else:
                info = "ERROR: No existe el proyecto pedido"

        elif(queryId == "activities"):
        #Devuelve todos las actividades correspondientes al proyecto
            idProject = request.GET.get('idProject')
            if(idProject!=''):
                project = Project.objects.get(idProject=int(idProject))
                activities = Activity.objects.filter(idProject=project)
                info = serializers.serialize('json', activities)
            else:
                info = "ERROR: No existen actividades para este proyecto"

        elif(queryId == "working"):
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
            idPFW = request.GET.get('idProjectFW')
            module = request.GET.get('idModule')
            curso = Course.objects.get(idCourse=int(idC))
            module = Module.objects.filter(idModule=int(module))
            students = Student.objects.filter(idCourse=int(idC),idRotation__idModule=module).order_by('surname')
            #Si no me mandan idPFW...
            #try:
            if(idPFW is not None):
                project = Project.objects.filter(idProject=int(idPFW))
                activity = Activity.objects.filter(idProject=project).order_by('idActivity')
                combined = list(chain(students, activity))
                info = serializers.serialize('json', combined)
            else:
                #...te serializo los estudiantes solos
                info = serializers.serialize('json', students)
                
        elif(queryId == "rotationsByModule"):
        #Devuelve todas las rotaciones que actualmente estan trabajando en el modulo pedido
            module = request.GET.get('idModule')
            module = Module.objects.get(idModule=module)
            rotations = Rotation.objects.filter(idModule=module)
            info = serializers.serialize('json', rotations)
            
        elif(queryId == "studentsByRotation"):
        #Devuelve todos los alumnos pertenecientes a la rotacion
            rotation = request.GET.get('idRotation')
            print("ID: " + str(rotation))
            if(rotation!='0'):
                rotation = Rotation.objects.get(idRotation=int(rotation))
                students = Student.objects.filter(idRotation=rotation).order_by('surname')
                info = serializers.serialize('json', students)
            else:
                students = Student.objects.filter(idRotation=None).order_by('surname')
                info = serializers.serialize('json', students)   

        elif(queryId == "onlyStudent"):
        #Devuelve el alumno pedido
            idUser = request.GET.get('idStudent')
            student = Student.objects.filter(idUser=int(idUser))
            info = serializers.serialize('json', student)
            
        elif(queryId == "rotations"):
        #Devuelve las rotaciones
            course = request.GET.get('idCourse')
            if(course!=''):
                course= Course.objects.get(idCourse=course)
                rotations = Rotation.objects.filter(idCourse=course)
                info = serializers.serialize('json', rotations, use_natural_foreign_keys=True)   
            else:
                info = "Curso Invalido"
        
        elif(queryId == "deleteRotation"):
        #Devuelve las rotaciones
            rotation = request.GET.get('idRotation')
            if(rotation!='0'):
                rotation= Rotation.objects.get(idRotation=int(rotation))
                students = Student.objects.filter(idRotation=rotation)
                students.update(idRotation=None)
                rotation.delete()
                info='Rotacion eliminada'
            else:
                info = "Rotacion Invalida"
                
        elif(queryId == "updateRotation"):
        #Devuelve las rotaciones
            module = request.GET.get('idModule')
            rotation = request.GET.get('idRotation')
            if(rotation!=''):
                module= Module.objects.get(idModule=int(module))
                Rotation.objects.filter(idRotation=int(rotation)).update(idModule=module)
                info='Rotacion cambiada'
            else:
                info = "Error"
                
        elif(queryId == "studentsByRotation"):
        #Devuelve los alumnos filtrados por rotacion
            rotation = request.GET.get('idRotation')
            if(rotation!='0'):
                rotation= Rotation.objects.get(idRotation=int(rotation))
                students = Student.objects.filter(idRotation=rotation).order_by('surname')
                info = serializers.serialize('json', students)   
            else:
                students = Student.objects.filter(idRotation=None).order_by('surname')
                info = serializers.serialize('json', students)
                
        elif(queryId == "changeStudentsRotation"):
        #Cambia la rotacion de los alumnos seleccionados
            studentsIds = request.GET.getlist('studentsIds[]')
            newRotation = request.GET.get('newIdRotation')
            if(newRotation!='0'):
                newRotation= Rotation.objects.get(idRotation=int(newRotation))
                for x in studentsIds:
                    student = Student.objects.filter(idUser=int(x))
                    student.update(idRotation=newRotation)
                info = 'Done'
            else:
                for x in studentsIds:
                    student = Student.objects.filter(idUser=int(x))
                    student.update(idRotation=None)
                
            
        elif(queryId == "createRotation"):
        #Crea una nueva rotacion
            nameRotation = request.GET.get('nameRotation')
            course = request.GET.get('idCourse')
            module = request.GET.get('idModule')
            print course
            print module
            course = Course.objects.get(idCourse=course)
            module = Module.objects.get(idModule=module)
            newRotation = Rotation()
            newRotation.nameRotation=nameRotation
            newRotation.idCourse=course
            newRotation.idModule=module
            newRotation.save()
            info = 'Done'
        
        elif(queryId == "history"):
        #Devuelve el alumno pedido
            idUser = request.GET.get('idStudent')
            student = Student.objects.filter(idUser=int(idUser))
            studentFollowings = StudentFollowing.objects.filter(idStudent=student).order_by('-dateSF')
            workOn = OnClass.objects.all()
            coso = list(chain(studentFollowings,workOn))
            info = serializers.serialize('json', coso, use_natural_foreign_keys=True)


        elif(queryId == "getDataStudent"):
        #Devuelve la informacion del alumno seleccionado
            FCKINGID = request.GET.get('idStudent')
            if(FCKINGID!=''):
                student = Student.objects.filter(idUser=FCKINGID)
                info = serializers.serialize('json', student)
            else:
                info="ERROR: ID de Estudiante no encontrado"
        elif(queryId == "fulfillments"):
        #Devuelve los cumplimientos del proyecto indicado
            idP = request.GET.get('idProject')
            project = Project.objects.get(idProject=idP)
            fulfillments = Fulfillment.objects.filter(idProject=project)
            info = serializers.serialize('json', fulfillments)
        print "\n" + queryId + ": \n \t" +info
        return HttpResponse(info)
    else:
        context = RequestContext(request)
        courses = Course.objects.all()
        pupils = Student.objects.all()
        subjects = Module.objects.all()
        return render_to_response('pupilFollowing.html', {'courses':courses, 'subjects':subjects, 'pupils':pupils},context)
    
def history(request):
    context = RequestContext(request)
    courses = Course.objects.all()
    return render_to_response('history.html', {'courses':courses}, context) 

def rotation(request):
    context = RequestContext(request)
    courses = Course.objects.all()
    return render_to_response('rotacionAlumno.html', {'courses':courses}, context) 

def projectFollowing(request):
    context = RequestContext(request)
    courses = Course.objects.all()
    return render_to_response('proyectos.html', {'courses':courses}, context) 
