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
        #Devuelve todos los modulos correspondientes al curso
            idC = request.GET.get('idCourse')
            if(idC!=''):
                curso = Course.objects.get(idCourse=int(idC))
                modulos = Module.objects.filter(idCourse=curso)
                info = serializers.serialize('json', modulos)
            else:
                info = "ERROR: No existe el modulo pedido"
                
        elif(queryId == "students"):
        #Devuelve todos los alumnos pertenecientes al curso y al modulo
            idC = request.GET.get('idCourse')
            curso = Course.objects.get(idCourse=int(idC))
            rotation = Rotation.objects.filter(idCourse=curso)
            students = Student.objects.filter(idRotation=rotation)
            info = serializers.serialize('json', students)   
            
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