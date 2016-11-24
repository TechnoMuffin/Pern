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
            curso = Course.objects.get(idCourse=int(idC))
            module = Module.objects.filter(idCourse=curso)
            rotation = Rotation.objects.filter(idModule=module)
            students = Student.objects.filter(idRotation=rotation).order_by('surname')
            #Si no me mandan idPFW...
            if(idPFW is not None):
                project = Project.objects.filter(idProject=int(idPFW))
                activity = Activity.objects.filter(idProject=project).order_by('idActivity')
                combined = list(chain(students, activity))
                info = serializers.serialize('json', combined)
            else:
                #...te serializo los estudiantes solos
                info = serializers.serialize('json', students)

        elif(queryId == "onlyStudent"):
        #Devuelve el alumno pedido
            idUser = request.GET.get('idStudent')
            student = Student.objects.filter(idUser=int(idUser))
            info = serializers.serialize('json', student)

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
        print info
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
    queryId = request.GET.get('queryId')
    info='...'
    if request.is_ajax():
        if(queryId == "newProject"):
            nameProject= request.GET.get('nameProject')
            FFforCreate= request.GET.getlist('FFforCreate[]')
            FFAlreadyCreated= request.GET.getlist('FFAlreadyCreated[]')
            idModule = request.GET.get('idModule')
            newProjecto=Project()
            newProjecto.nameProject = nameProject
            modulo = Module.objects.get(idModule=int(idModule))
            newProjecto.idModule = modulo
            newProjecto.save()
            for x in FFAlreadyCreated:
                FFexisted = Fulfillment.objects.get(idFF=x)
                FFexisted.idProject.add(newProjecto)
            for i in FFforCreate:
                newFF = Fulfillment();
                newFF.nameFF =  i
                newFF.save()
                newFF.idProject.add(newProjecto)
            info = "Se ha creado correctamente"
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
        elif(queryId == "delProject"):
            idProject= request.GET.get('idProject')
            proj=Project.objects.get(idProject=int(idProject))
            proj.delete()
        elif(queryId == "delActivities"):
            idWork = request.GET.get('currentActivity')
            working = Working.objects.get(id=int(idWork))
            working.idActivity.delete()
        elif(queryId == "modActivities"):
            idWork = request.GET.get('currentActivity')
            newName = request.GET.get('newNameWork')
            newCantDays = request.GET.get('newCantDays')
            working = Working.objects.get(id=int(idWork))
            working.numberOfClasses=newCantDays
            working.idActivity.nameActivity=newName
            working.idActivity.save()
            working.save()
            info = "Se ha modificado correctamente"
        elif(queryId == "finishWorking"):
            idProject = request.GET.get('idProject')
            idStudent = request.GET.get('idStudent')
            onWorking = OnWorking.objects.get(idStudent=int(idStudent), idProject=int(idProject))
            onWorking.hasFinish = True
            onWorking.save()
            info = "Se ha modificado correctamente"
        elif(queryId == "notFinishWorking"):
            idProject = request.GET.get('idProject')
            idStudent = request.GET.get('idStudent')
            onWorking = OnWorking.objects.get(idStudent=int(idStudent), idProject=int(idProject))
            onWorking.hasFinish = False
            onWorking.save()
        elif(queryId == "calActivities"):
            idWork = request.GET.get('currentActivity')
            newCal = request.GET.get('newCal')
            working = Working.objects.get(id=int(idWork))
            working.calification = newCal
            working.save()
        elif(queryId == "modProject"):
            idProject= request.GET.get('idProject')
            nameProject= request.GET.get('nameProject')
            proj=Project.objects.filter(idProject=int(idProject))
            proj.update(
                nameProject=nameProject
            )
            proj.save()
            info = "Se ha modificado correctamente"
        elif(queryId == "newActivity"):
            idProject= request.GET.get('idProject')
            idProject=Project.objects.get(idProject=int(idProject))
            nameActivity= request.GET.get('nameActivity')
            newActivity=Activity()
            newActivity.nameActivity= nameActivity
            newActivity.idProject=idProject
            newActivity.save()
            info = "Se ha creado correctamente"
        elif(queryId == "studentsWorking"):
            idProject= request.GET.get('idProject')
            idModule= request.GET.get('idModule')
            students= Student.objects.filter(idRotation__idModule=int(idModule))
            onWorking= OnWorking.objects.filter(idProject=int(idProject))
            print "asddddddddddddddddddddddddddddddddddddddddddddddddd"
            if not onWorking:
                print "xdxddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
                for i in students:
                    newOnWorking = OnWorking()
                    newOnWorking.idStudent = i
                    newOnWorking.idProject = Project.objects.get(idProject=idProject)
                    newOnWorking.hasFinish = False
                    newOnWorking.save()
            onWorking= OnWorking.objects.filter(idProject=int(idProject))
            info = serializers.serialize('json',onWorking,use_natural_foreign_keys=True)
        elif(queryId == "onlyStudent"):
        #Devuelve el alumno pedido
            idUser = request.GET.get('idStudent')
            student = Student.objects.filter(idUser=int(idUser))
            info = serializers.serialize('json', student)

        elif(queryId == "AllFulfillments"):
        #Devuelve todos los Cumplimientos
            fulfillments = Fulfillment.objects.all()
            info = serializers.serialize('json', fulfillments)
            print info

        elif(queryId == "getActivities"):
            idProject= request.GET.get('idProject')
            idStudent= request.GET.get('idStudent')
            idStudent=Student.objects.get(idUser=int(idStudent))
            idProject=Project.objects.filter(idProject=int(idProject))
            actividadesAlumno=Working.objects.filter(idStudent=idStudent, idActivity__idProject=idProject)
            actividadesProyecto = Activity.objects.filter(idProject=idProject)
            aCrear = []
            for a in actividadesProyecto:
                current = a.idActivity
                aCrear.append(current)
                print("Actividad del Proyecto: \n" + str(current))
                print("Actividades del Alumno:")
                for b in actividadesAlumno:
                    trabajado = b.idActivity.pk
                    print(trabajado)
                    if current == trabajado:
                        print("\t Son iguales, eliminamos...")
                        aCrear.remove(current)
                        break
            print("Actividades que tenemos que crear " + str(aCrear))
            for c in aCrear:
                newWorking=Working()
                newWorking.idStudent = idStudent
                newWorking.idActivity = Activity.objects.get(idActivity=c)
                newWorking.numberOfClasses = 0
                newWorking.calification = 0
                newWorking.hasFinish = False
                newWorking.save()
            print(actividadesAlumno)
            work=Working.objects.filter(idStudent=idStudent, idActivity__idProject=idProject)
            info = serializers.serialize('json',work,use_natural_foreign_keys=True)
            print info
        return HttpResponse(info)
    else:
        context = RequestContext(request)
        courses = Course.objects.all()
        return render_to_response('proyectos.html', {'courses':courses}, context)
