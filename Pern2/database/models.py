# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import sys
from django.db import models

# Terminado:
# Curso
# Rotacion
# Modulo
# Documentos
# Cumplimiento
# Proyecto
# Actividad
# Trabajos
# Seguimiento
# Usuario
# Alumno
# Profesor

##################################USUARIOS##################################


class User(models.Model):
    name = models.CharField(max_length=128)
    surname = models.CharField(max_length=128)
    email = models.EmailField(max_length=254)
    dni = models.IntegerField()
    idUser = models.AutoField(primary_key=True)

    class Meta:
        abstract = True

##################################PROFESOR##################################


class Teacher(User):
    boss = models.BooleanField(blank=True)
    password = models.CharField(max_length=18)

    class Meta:
        verbose_name = 'Profesor'
        verbose_name_plural = 'Profesores'

    def __str__(self):
        tagName = str(self.name)
        return tagName

##################################CURSOS##################################


class Course(models.Model):
    idCourse = models.AutoField(primary_key=True)
    cycle = models.IntegerField()
    COURSE_OPTIONS = (
        (u'1', u'1º año'),
        (u'2', u'2º año'),
        (u'3', u'3º año'),
    )
    DIVISION_OPTIONS = (
        (u'A', u'A'),
        (u'B', u'B'),
        (u'C', u'C'),
    )
    courseType = models.CharField(max_length=128, choices=COURSE_OPTIONS)
    courseDivision = models.CharField(max_length=128, choices=DIVISION_OPTIONS)

    class Meta:
        verbose_name = 'Curso'
        verbose_name_plural = 'Cursos'

    def __str__(self):
        tagName = str(self.courseType) + \
            str(self.courseDivision) + " - " + str(self.cycle)
        return tagName

##################################MODULOS##################################


class Module(models.Model):
    idModule = models.AutoField(primary_key=True)
    nameModule = models.CharField(max_length=128)
    idCourse = models.ForeignKey(Course, blank=True)

    def natural_key(self):
        return (self.idModule, self.nameModule)

    class Meta:
        verbose_name = 'Modulo'
        verbose_name_plural = 'Modulos'

    def __str__(self):
        tagName = str(self.nameModule)
        return tagName

##################################ROTACIONES##################################


class Rotation(models.Model):
    nameRotation = models.CharField(max_length=32)
    idRotation = models.AutoField(primary_key=True)
    idModule = models.ForeignKey(Module)
    idCourse = models.ForeignKey(Course)

    class Meta:
        verbose_name = 'Rotacion'
        verbose_name_plural = 'Rotaciones'

    def __str__(self):
        tagName = str(self.nameRotation) + "(" + str(self.idModule) + ")"
        return tagName

##################################ALUMNO##################################


class Student(User):
    idCourse = models.ForeignKey(Course)
    idRotation = models.ForeignKey(Rotation, blank=True, null=True)
    numberOfRegistration = models.IntegerField()

    class Meta:
        verbose_name = 'Alumno'
        verbose_name_plural = 'Alumnos'

    def __str__(self):
        tagName = str(self.name) + " " + str(self.surname) + \
            " [" + str(self.idRotation) + "]"
        return tagName

##################################DOCUMENTOS##################################


class Document(models.Model):
    idDocument = models.AutoField(primary_key=True)
    nameDocument= models.CharField(max_length=128,null=True)
    #visible = models.BooleanField(blank=True, null=True)
    idModule = models.ForeignKey(Module, null=True)
    #idTeacher = models.ManyToManyField(Teacher)
    idCourse = models.ForeignKey(Course, blank=True, null=True)
    commentDoc = models.TextField(blank=True)
    archivo = models.FileField(u'Documentos',upload_to="documentos",blank=True)

    class Meta:
        verbose_name = 'Documento'
        verbose_name_plural = 'Documentos'

    def __str__(self):
        tagName = str(self.nameDocument) + "(" + str(self.idModule) + ")"
        return tagName


##################################PROYECTOS##################################


class Project(models.Model):
    nameProject = models.CharField(max_length=128)
    idProject = models.AutoField(primary_key=True)
    idTeacher = models.ManyToManyField(Teacher)
    idModule = models.ForeignKey(Module)

    class Meta:
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'

    def __str__(self):
        tagName = str(self.nameProject) + \
            "[" + str(self.idModule) + "]" + "(" + str(self.idTeacher) + ")"
        return tagName

##################################CUMPLIMIENTOS###########################


class Fulfillment(models.Model):
    nameFF = models.CharField(max_length=128)
    idFF = models.AutoField(primary_key=True)
    idProject = models.ManyToManyField(Project, blank=True)

    def natural_key(self):
        return (self.idFF, self.nameFF)

    class Meta:
        verbose_name = 'Cumplimiento'
        verbose_name_plural = 'Cumplimientos'

    def __str__(self):
        tagName = str(self.nameFF) + "(" + str(self.idProject) + ")"
        return tagName

##################################SEGUIMIENTO DE ALUMNO###################


class StudentFollowing(models.Model):
    idSF = models.AutoField(primary_key=True)
    presenceSF = models.BooleanField(blank=True)
    dateSF = models.DateField()
    idModule = models.ForeignKey(Module)
    idStudent = models.ForeignKey(Student)
    idTeacher = models.ManyToManyField(Teacher)
    commentPF = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Seguimiento de Alumno'
        verbose_name_plural = 'Seguimientos de Alumno'

    def __str__(self):
        tagName = '[' + str(self.dateSF) + "]" + \
            str(self.idStudent) + "(" + str(self.idModule) + ")"
        return tagName
##################################CUMPLIMIENTO DIARIO#####################


class dailyFulfillment(models.Model):
    idSF = models.ForeignKey(StudentFollowing)
    idFF = models.ForeignKey(Fulfillment)
    idDF = models.AutoField(primary_key=True)
    done = models.BooleanField(blank=True)

    class Meta:
        verbose_name = 'Cumplimiento diario'
        verbose_name_plural = 'Cumplimientos diarios'

    def __str__(self):
        tagName = str(self.idFF.nameFF) + '{' + str(self.idSF.idModule.nameModule) + '}' + '[' + str(self.idSF.idStudent.surname) + \
            ']' + "(" + str(self.idSF.dateSF) + ") - " + str(self.done)
        return tagName

##################################ACTIVIDADES##################################


class Activity(models.Model):
    nameActivity = models.CharField(max_length=128)
    idActivity = models.AutoField(primary_key=True)
    idProject = models.ForeignKey(Project)

    def natural_key(self):
        return (self.idActivity, self.nameActivity, self.idProject.nameProject)

    class Meta:
        verbose_name = 'Actividad'
        verbose_name_plural = 'Actividades'

    def __str__(self):
        tagName = str(self.nameActivity) + "[" + str(self.idProject) + "]"
        return tagName

##################################TRABAJA##################################


class Working(models.Model):
    idStudent = models.ForeignKey(Student)
    idActivity = models.ForeignKey(Activity)
    numberOfClasses = models.IntegerField()
    calification = models.IntegerField()
    hasFinish = models.BooleanField(blank=True)

    class Meta:
        verbose_name = 'Trabajo'
        verbose_name_plural = 'Trabajos'

    def __str__(self):
        tagName = str(self.idActivity) + " " + str(self.idStudent)
        return tagName

##################################TRABAJA##################################


class OnClass(models.Model):
    idActivity = models.ForeignKey(Activity)
    idSF = models.ForeignKey(StudentFollowing)

    class Meta:
        verbose_name = 'Trabajo en Clase'
        verbose_name_plural = 'Trabajos en Clase'

    def __str__(self):
        tagName = str(self.idActivity.nameActivity) + " - " + \
            str(self.idSF.idStudent.surname) + \
            '[' + str(self.idSF.dateSF) + ']'
        return tagName
