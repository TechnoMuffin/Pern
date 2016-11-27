from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from django.core import serializers
from django.http import HttpResponse
from database.models import *
import json
from django.core.exceptions import ObjectDoesNotExist
from itertools import chain
from forms import FormEntrada


def pupilFollowing(request):
    queryId = request.GET.get('queryId')
    info = '...'
    if request.is_ajax():
        if(queryId == "subjects"):
            # Devuelve todos los modulos correspondientes al curso
            idC = request.GET.get('idCourse')
            if(idC != ''):
                curso = Course.objects.get(idCourse=int(idC))
                modulos = Module.objects.filter(exists=True, idCourse=curso)
                info = serializers.serialize('json', modulos)
            else:
                info = "ERROR: No existe el modulo pedido"

        elif(queryId == "projects"):
            # Devuelve todos los proyectos correspondientes al modulo
            idModule = request.GET.get('module')
            if(idModule != ''):
                module = Module.objects.get(exists=True, idModule=int(idModule))
                projects = Project.objects.filter(exists=True,idModule=module)
                info = serializers.serialize('json', projects)
            else:
                info = "ERROR: No existe el proyecto pedido"

        elif(queryId == "dailyFulfillments"):
            # Devuelve todos los cumplimientos necesarios para ese dia, si no
            # existen seran creados y devueltos
            idModule = request.GET.get('idModule')
            idProject = request.GET.get('idProject')
            idStudent = request.GET.get('idStudent')
            date = request.GET.get('date')
            if(idModule != '' or idProject != '' or idStudent != '' or idStudent != '' or date != ''):
                sf = StudentFollowing.objects.get(exists=True,idModule__idModule=int(idModule), idStudent__idUser=int(idStudent), dateSF=str(date))
                dailyFF = dailyFulfillment.objects.filter(idSF=sf)
                if not dailyFF:
                    modelFF = Fulfillment.objects.filter(idProject__idProject=int(idProject))
                    for i in modelFF:
                        dailyFF = dailyFulfillment()
                        dailyFF.idSF = sf
                        dailyFF.idFF = i
                        dailyFF.done = True
                        dailyFF.save()
                    dailyFF = dailyFulfillment.objects.filter(idSF=sf)
                info = serializers.serialize(
                    'json', dailyFF, use_natural_foreign_keys=True)
            else:
                info = "ERROR: No existe el cumplimiento"

        elif(queryId == "activities"):
            # Devuelve todos las actividades correspondientes al proyecto
            idProject = request.GET.get('idProject')
            if(idProject != ''):
                project = Project.objects.get(exists=True,idProject=int(idProject))
                activities = Activity.objects.filter(idProject=project)
                info = serializers.serialize('json', activities)
            else:
                info = "ERROR: No existen actividades para este proyecto"

        elif(queryId == "working"):
            # Devuelve la informacion del trabajo correspondiente a la
            # actividad seleccionada
            idActivity = request.GET.get('idActivity')
            idStudent = request.GET.get('idStudent')
            if(idActivity != ''):
                activity = Activity.objects.get(idActivity=int(idActivity))
                student = Student.objects.get(idUser=int(idStudent))
                try:
                    work = Working.objects.get(
                        idActivity=activity, idStudent=student)
                    info = serializers.serialize('json', [work, activity])
                except ObjectDoesNotExist:
                    # Si el trabajo no existe, se creara uno nuevo y se enviara
                    newWork = Working()
                    newWork.idActivity = activity
                    newWork.idStudent = student
                    newWork.numberOfClasses = 0
                    newWork.calification = 0
                    newWork.hasFinish = False
                    newWork.save()
                    info = serializers.serialize('json', [newWork, activity])
            else:
                info = 'ERROR: No hay trabajo para esa actividad'

        elif(queryId == "createSF"):
            date = request.GET.get('date')
            module = request.GET.get('idModule')
            module = Module.objects.get(idModule=int(module))
            students = Student.objects.filter(idRotation__idModule=module).order_by('surname')
            sfs = StudentFollowing.objects.filter(
                dateSF=str(date), idModule=module)
            if not sfs:
                for i in students:
                    newSF = StudentFollowing()
                    newSF.presenceSF = True
                    newSF.dateSF = str(date)
                    newSF.idModule = module
                    newSF.idStudent = i
                    newSF.commentPF = ''
                    newSF.save()
                    # TODO meter un profesor de verdad
                    newSF.idTeacher.add(Teacher.objects.get(idUser=1))
                    newSF.save()
            info = '...'
        elif(queryId == "students"):
            # Devuelve todos los alumnos pertenecientes al curso y al modulo
            idC = request.GET.get('idCourse')
            idPFW = request.GET.get('idProjectFW')
            module = request.GET.get('idModule')
            curso = Course.objects.get(idCourse=int(idC))
            module = Module.objects.filter(idModule=int(module))
            students = Student.objects.filter(idCourse=int(
                idC), idRotation__idModule=module).order_by('surname')
            # Si no me mandan idPFW...
            if(idPFW is not None):
                project = Project.objects.filter(idProject=int(idPFW))
                activity = Activity.objects.filter(
                    idProject=project).order_by('idActivity')
                combined = list(chain(students, activity))
                info = serializers.serialize('json', combined)
            else:
                #...te serializo los estudiantes solos
                info = serializers.serialize('json', students)

        elif(queryId == "rotationsByModule"):
            # Devuelve todas las rotaciones que actualmente estan trabajando en
            # el modulo pedido
            module = request.GET.get('idModule')
            module = Module.objects.get(idModule=module)
            rotations = Rotation.objects.filter(exists=True,idModule=module)
            info = serializers.serialize('json', rotations)

        elif(queryId == "studentsByRotation"):
            # Devuelve todos los alumnos pertenecientes a la rotacion
            rotation = request.GET.get('idRotation')
            print("ID: " + str(rotation))
            if(rotation != '0'):
                rotation = Rotation.objects.get(idRotation=int(rotation))
                students = Student.objects.filter(
                    idRotation=rotation).order_by('surname')
                info = serializers.serialize('json', students)
            else:
                students = Student.objects.filter(idRotation=None).order_by('surname')
                info = serializers.serialize('json', students)

        elif(queryId == "onlyStudent"):
            # Devuelve el alumno pedido
            idUser = request.GET.get('idStudent')
            student = Student.objects.filter(idUser=int(idUser))
            info = serializers.serialize('json', student)
        elif(queryId == "rotations"):
            # Devuelve las rotaciones
            course = request.GET.get('idCourse')
            if(course != ''):
                course = Course.objects.get(idCourse=course)
                rotations = Rotation.objects.filter(exists=True,idCourse=course)
                info = serializers.serialize('json', rotations, use_natural_foreign_keys=True)
            else:
                info = "Curso Invalido"

        elif(queryId == "deleteRotation"):
            # Devuelve las rotaciones
            rotation = request.GET.get('idRotation')
            if(rotation != '0'):
                rotation = Rotation.objects.get(idRotation=int(rotation))
                students = Student.objects.filter(idRotation=rotation)
                students.update(idRotation=None)
                rotation.update(exists=False)
                info = 'Rotacion eliminada'
            else:
                info = "Rotacion Invalida"

        elif(queryId == "updateRotation"):
            # Devuelve las rotaciones
            module = request.GET.get('idModule')
            rotation = request.GET.get('idRotation')
            if(rotation != ''):
                module = Module.objects.get(idModule=int(module))
                Rotation.objects.filter(idRotation=int(
                    rotation)).update(idModule=module)
                info = 'Rotacion cambiada'
            else:
                info = "Error"

        elif(queryId == "studentsByRotation"):
            # Devuelve los alumnos filtrados por rotacion
            rotation = request.GET.get('idRotation')
            if(rotation != '0'):
                rotation = Rotation.objects.get(idRotation=int(rotation))
                students = Student.objects.filter(
                    idRotation=rotation).order_by('surname')
                info = serializers.serialize('json', students)
            else:
                students = Student.objects.filter(
                    idRotation=None).order_by('surname')
                info = serializers.serialize('json', students)

        elif(queryId == "changeStudentsRotation"):
            # Cambia la rotacion de los alumnos seleccionados
            studentsIds = request.GET.getlist('studentsIds[]')
            newRotation = request.GET.get('newIdRotation')
            if(newRotation != '0'):
                newRotation = Rotation.objects.get(idRotation=int(newRotation))
                for x in studentsIds:
                    student = Student.objects.filter(idUser=int(x))
                    student.update(idRotation=newRotation)
                info = 'Done'
            else:
                for x in studentsIds:
                    student = Student.objects.filter(idUser=int(x))
                    student.update(idRotation=None)

        elif(queryId == "createRotation"):
            # Crea una nueva rotacion
            nameRotation = request.GET.get('nameRotation')
            course = request.GET.get('idCourse')
            module = request.GET.get('idModule')
            print course
            print module
            course = Course.objects.get(idCourse=course)
            module = Module.objects.get(idModule=module)
            newRotation = Rotation()
            newRotation.nameRotation = nameRotation
            newRotation.idCourse = course
            newRotation.idModule = module
            newRotation.save()
            info = 'Done'
        elif(queryId == "history"):
            # Devuelve el alumno pedido
            idUser = request.GET.get('idStudent')
            student = Student.objects.filter(idUser=int(idUser))
            studentFollowings = StudentFollowing.objects.filter(exists=True,idStudent=student).order_by('-dateSF')
            workOn = OnClass.objects.all()
            coso = list(chain(studentFollowings, workOn))
            info = serializers.serialize(
                'json', coso, use_natural_foreign_keys=True)

        elif(queryId == "getDataStudent"):
            # Devuelve la informacion del alumno seleccionado
            FCKINGID = request.GET.get('idStudent')
            if(FCKINGID != ''):
                student = Student.objects.filter(idUser=FCKINGID)
                info = serializers.serialize('json', student)
            else:
                info = "ERROR: ID de Estudiante no encontrado"

        elif(queryId == "deldocuments"):
            idDoc = request.GET.get('currentDocument')
            document = Document.objects.get(idDocument=int(idDoc))
            document.delete()
        elif(queryId == "fulfillments"):
            # Devuelve los cumplimientos del proyecto indicado
            idP = request.GET.get('idProject')
            project = Project.objects.get(idProject=idP)
            fulfillments = Fulfillment.objects.filter(idProject=project)
            info = serializers.serialize('json', fulfillments)
        elif(queryId == "documents"):
        #Devuelve los documentos del curso indicado
            idCo = request.GET.get('idCourse')
            doc = Course.objects.get(idCourse=int(idCo))
            documentos = Document.objects.filter(idCourse=doc)
            print documentos
            info = serializers.serialize('json', documentos)
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
    return render_to_response('history.html', {'courses': courses}, context)

def rotation(request):
    context = RequestContext(request)
    courses = Course.objects.all()
    return render_to_response('rotacionAlumno.html', {'courses': courses}, context)

def projectFollowing(request):
    context = RequestContext(request)
    courses = Course.objects.all()
    return render_to_response('proyectos.html', {'courses': courses}, context)

def document(request):
    queryId = request.GET.get('queryId')
    form = FormEntrada(request.POST, request.FILES)
    if request.method == 'POST':
        nameDocument = request.POST.get('nameDocument')
        commentDoc = request.POST.get('commentDoc')
        idCo = request.POST['idCourse']
        idM = request.POST['idModule']
        print idM
        #idT = request.POST['idTeacher']
        archivo = request.FILES['archivo']
        if(idCo!=''):
            curso = Course.objects.get(idCourse=int(idCo))
            modulos = Module.objects.filter(idCourse=curso)
            modulo = Module.objects.get(idModule=int(idM))
            docs = Document(nameDocument=nameDocument,commentDoc=commentDoc,archivo=archivo,idCourse=curso,idModule=modulo)
            docs.save()
        else:
            info = "ERROR: No existe el modulo pedido"
    else:
        print ("no entro")
    context = RequestContext(request)
    courses = Course.objects.all()
    subjects = Module.objects.all()
    data= {
        'form': form,
        'courses':courses,
        'subjects':subjects
    }

    return render_to_response('documents.html', data, context )

def modules(request):
    queryId = request.GET.get('queryId')
    info='...'
    if request.is_ajax():
        if(queryId == "newModule"):
            nameModule = request.GET.get('nameModule')
            course = request.GET.get('course')
            if nameModule!=None and course!=None:
                newModule = Module()
                newModule.nameModule =  nameModule
                newModule.idCourse =  Course.objects.get(idCourse=int(course))
                newModule.save()
                info="Creado el Modulo: "+ nameModule
            else:
                print 'Error: no se pudo crear el modulo'

        if(queryId == "allModules"):
            modulos = Module.objects.filter(exists=True)
            info = serializers.serialize('json', modulos,use_natural_foreign_keys=True)
        return HttpResponse(info)
    else:
        context = RequestContext(request)
        courses = Course.objects.all()
        modules = Module.objects.filter(exists=True)
        return render_to_response('modulos.html', {'courses':courses, 'modules': modules}, context)


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
