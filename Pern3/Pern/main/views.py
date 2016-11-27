# -*- coding: utf-8 -*-
#Importaciones
from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from django.core import serializers
from django.http import HttpResponse
from models import *
import json
from django.core.exceptions import ObjectDoesNotExist
from itertools import chain

#Seguimiento de alumnos
def studentsFollowing(request):
    context = RequestContext(request)
    courses = Course.objects.all()
    pupils = Student.objects.all()
    subjects = Module.objects.all()
    return render_to_response('studentsFollowing.html', {'courses':courses, 'subjects':subjects, 'pupils':pupils},context)

#Historial de los alumnos
def history(request):
    context = RequestContext(request)
    return render_to_response('history.html', context)

#Rotaciones
def rotations(request):
    context = RequestContext(request)
    return render_to_response('rotations.html', context)

#Seguimiento de proyectos
def projectsFollowing(request):
    context = RequestContext(request)
    return render_to_response('projectsFollowing.html', context)

#Peticiones AJAX
def ajaxQueries(request):
    queryId = request.GET.get('queryId')
    info = ''
    data = ''

    if(queryId == 'modulesByCourse'):
        idC = int(request.GET.get('idCourse'))
        data = Module.objects.filter(idCourse__idCourse=idC)

    elif(queryId == 'studentsByRotation'):
        idR = request.GET.get('idRotation')
        data = Student.objects.filter(idRotation__idRotation=idR).order_by('surname')

    elif(queryId == 'rotationsByModule'):
        module = request.GET.get('idModule')
        data = Rotation.objects.filter(idModule__idModule=module)

    elif(queryId == 'projectsByModule'):
        idM = int(request.GET.get('module'))
        data = Project.objects.filter(idModule__idModule=idM)

    elif(queryId == 'studentById'):
        idU = int(request.GET.get('idStudent'))
        data = Student.objects.filter(idUser=idU)

    elif(queryId == 'activitiesByProject'):
        idP = int(request.GET.get('idProject'))
        data = Activity.objects.filter(idProject__idProject=idP)

    elif(queryId == 'working'):
        idS  = request.GET.get('idStudent')
        idA = request.GET.get('idActivity')
        student = Student.objects.get(idUser=idS)
        activity = Activity.objects.get(idActivity=idA)
        try:
            Working.objects.get(idStudent__idUser=idS, idActivity__idActivity=idA)
        except ObjectDoesNotExist:
            newWorking = Working()
            newWorking.idStudent = student
            newWorking.idActivity = activity
            newWorking.numberOfClasses = 0
            newWorking.hasFinish = False
            newWorking.save()
        data = Working.objects.filter(idStudent__idUser=idS, idActivity__idActivity=idA)
        numberOC = len(OnClass.objects.filter(idActivity__idActivity=idA,idSF__idStudent__idUser=idS))
        data.update(numberOfClasses=numberOC)


    elif(queryId == "activitiesByProject"):
        idP = int(request.GET.get('idProject'))
        data = Activity.objects.filter(idProject__idProject=idP)

    elif(queryId == "getCurrentActivity"):
        data = []
        idM = request.GET.get('idModule')
        date = request.GET.get('date')
        studentsFollowing = studentsFollowingModel.objects.filter(dateSF=str(date),idModule__idModule=idM)
        for x in studentsFollowing:
            work = OnClass.objects.get(idSF=x).idActivity
            if(work != None):
                dictionary = {'studentId': x.idStudent.idUser,'activity': work.idActivity}
            else:
                dictionary = {'studentId': x.idStudent.idUser,'activity': "zero"}
            data.append(dictionary)
        data = json.dumps(data)
        print("\033[1m RESPUESTA A " + queryId + "\033[0m")
        print(data)
        return HttpResponse(data)

    elif(queryId == "saveActivity"):
        idS = request.GET.get('idStudent')
        idM = request.GET.get('idModule')
        idA = request.GET.get('activity')
        date = request.GET.get('date')
        data = OnClass.objects.filter(idSF__idStudent__idUser=idS, idSF__idModule__idModule=idM, idSF__dateSF=date)
        if(idA != "zero"):
            activity = Activity.objects.get(idActivity=idA)
            data.update(idActivity=activity)
        else:
            data.update(idActivity=None)

    elif(queryId == "createAllSF"):
        date = request.GET.get('date')
        module = request.GET.get('idModule')
        students = Student.objects.filter(idRotation__idModule__idModule=module).order_by('surname')
        for student in students:
            try:
                studentsFollowingModel.objects.get(dateSF=str(date),idModule__idModule=module, idStudent__idUser= student.pk)
            except ObjectDoesNotExist:
                newSF = studentsFollowingModel()
                newSF.presenceSF = True
                newSF.dateSF = str(date)
                newSF.idModule = Module.objects.get(idModule=module)
                newSF.idStudent = student
                newSF.commentPF = ''
                newSF.save()
                newSF.idTeacher.add(Teacher.objects.get(idUser=1)) #TODO meter un profesor de verdad
                newSF.save()
        data = studentsFollowingModel.objects.filter(dateSF=str(date),idModule=module)

    elif(queryId == "createAllCW"):
        date = request.GET.get('date')
        module = request.GET.get('idModule')
        sFs = studentsFollowingModel.objects.filter(dateSF=str(date),idModule__idModule=module)
        for sF in sFs:
            try:
                OnClass.objects.get(idSF=sF)
            except ObjectDoesNotExist:
                newOc = OnClass()
                newOc.idSF = sF
                newOc.save()
        data = OnClass.objects.filter(idSF__idModule=module,idSF__dateSF=date)

    elif(queryId == "createAllFF"):
        idP = request.GET.get('idProject')
        idS = request.GET.get('idStudent')
        idM = request.GET.get('idModule')
        date = request.GET.get('date')
        fulfillments = Fulfillment.objects.filter(idProject__idProject=idP).order_by('nameFF')
        studentFollowing = studentsFollowingModel.objects.get(dateSF=str(date),idModule__idModule=idM, idStudent__idUser= idS)
        for fulfillment in fulfillments:
            try:
                classFulfillment.objects.get(idFF=fulfillment, idSF=studentFollowing)
            except ObjectDoesNotExist:
                data = classFulfillment()
                data.idFF = fulfillment
                data.idSF = studentFollowing
                data.check = True
                data.save()
        data = classFulfillment.objects.filter(idFF__idProject=idP,idSF=studentFollowing)


    elif(queryId == "getStudentFollowing"):
        idS = request.GET.get('idStudent')
        idM = request.GET.get('idModule')
        date = request.GET.get('date')
        data = studentsFollowingModel.objects.filter(dateSF=str(date),idModule__idModule=idM, idStudent__idUser= idS)

    elif(queryId == 'saveFulfillment'):
        idS = request.GET.get('idStudent')
        idM = request.GET.get('idModule')
        date = request.GET.get('date')
        idFF = request.GET.get('fulfillmentId')
        studentF  = studentsFollowingModel.objects.filter(dateSF=str(date),idModule__idModule=idM, idStudent__idUser= idS)
        data = classFulfillment.objects.filter(idFF__idFF=idFF,idSF=studentF)
        data.update(check = not data[0].check)

    elif(queryId == 'calcAccuracy'):
        idS = request.GET.get('idStudent')
        idM = request.GET.get('idModule')
        idFF = request.GET.get('idFF')
        classQuantity  = len(classFulfillment.objects.filter(idFF__idFF=idFF,idSF__idStudent__idUser=idS))
        classTrue  = len(classFulfillment.objects.filter(idFF__idFF=idFF,idSF__idStudent__idUser=idS,check=True))
        info  = (float(classTrue) / float(classQuantity))*100
        return HttpResponse(info)


    elif(queryId == 'saveObservations'):
        idS = request.GET.get('idStudent')
        idM = request.GET.get('idModule')
        date = request.GET.get('date')
        text = request.GET.get('text')
        data = studentsFollowingModel.objects.filter(dateSF=str(date),idModule__idModule=idM, idStudent__idUser= idS)
        data.update(commentPF = text)

    elif(queryId == 'savePresence'):
        idS = request.GET.get('idStudent')
        idM = request.GET.get('idModule')
        date = request.GET.get('date')
        data = studentsFollowingModel.objects.filter(dateSF=str(date),idModule__idModule=idM, idStudent__idUser= idS)
        data.update(presenceSF= not data[0].presenceSF)

    elif(queryId == 'fulfillmentsByProject'):
        idP = request.GET.get('idProject')
        data = Fulfillment.objects.filter(idProject__idProject=idP).order_by('nameFF')


    if(data != ''):
        info = serializers.serialize('json', data)
    else:
        info = "La siguiente queryId no existe: '" + queryId +"'"
    print("\033[1m RESPUESTA A " + queryId + "\033[0m")
    print(info)
    return HttpResponse(info)
