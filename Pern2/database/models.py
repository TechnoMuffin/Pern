# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os, sys
from django.db import models

#Terminado:
#Curso
#Rotacion
#Modulo
#Documentos
#Cumplimiento
#Proyecto
#Actividad
#Trabajos
#Seguimiento
#Usuario
#Alumno
#Profesor

##################################USUARIOS##################################
class User(models.Model):
    name = models.CharField(max_length=128)
    surname = models.CharField(max_length=128)
    email = models.EmailField(max_length=254)
    dni = models.IntegerField()
    idUser = models.AutoField(primary_key=True)

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
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

    def __str__(self):
        tagName = str(self.courseType) + str(self.courseDivision) + " - " + str(self.cicle)
        return tagName

##################################ROTACIONES##################################
class Rotation(models.Model):
    nameRotation = models.CharField(max_length=32)
    idRotation = models.AutoField(primary_key=True)
    idCourse = models.ForeignKey(Course)


    class Meta:
        verbose_name = 'Rotacion'
        verbose_name_plural = 'Rotaciones'
    def __str__(self):
        tagName = str(self.nameRotation) + "(" + str(self.idCourse) + ")"
        return tagName

##################################ALUMNO##################################
class Student(User):
    idRotation = models.ForeignKey(Rotation)
    numberOfRegistration = models.IntegerField()


    class Meta:
        verbose_name = 'Alumno'
        verbose_name_plural = 'Alumnos'
    def __str__(self):
        tagName = str(self.name) + " [" + str(self.idRotation) + "]"
        return tagName

##################################MODULOS##################################
class Module(models.Model):
    idModule = models.AutoField(primary_key=True)
    nameModule = models.CharField(max_length=128)
    idRotation = models.ForeignKey(Rotation, blank=True)


    class Meta:
        verbose_name = 'Modulo'
        verbose_name_plural = 'Modulos'
    def __str__(self):
        tagName = str(self.nameModule)
        return tagName

##################################DOCUMENTOS##################################
class Document(models.Model):
    idDocument = models.AutoField(primary_key=True)
    nameDocument= models.CharField(max_length=128)
    visible = models.BooleanField(blank=True)
    idModule = models.ManyToManyField(Module, blank=True)


    class Meta:
        verbose_name = 'Documento'
        verbose_name_plural = 'Documentos'
    def __str__(self):
        tagName = str(self.nameDocument) + "(" + str(self.idModule) + ")"
        return tagName

##################################CUMPLIMIENTOs##################################
class Fulfillment(models.Model):
    nameFF = models.CharField(max_length=128, primary_key=True)
    idFF = models.AutoField(primary_key=True)
    idModule = models.ManyToManyField(Module, blank=True)


    class Meta:
        verbose_name = 'Cumplimiento'
        verbose_name_plural = 'Cumplimientos'
    def __str__(self):
        tagName = str(self.nameFF) + "(" + str(self.idModule) + ")"
        return tagName

##################################PROYECTOS##################################
class Project(models.Model):
    nameProject = models.CharField(max_length=128, primary_key=True)
    idProject = models.AutoField(primary_key=True)
    idTeacher = models.ManyToManyField(Teacher)
    idModule = models.ForeignKey(Module)


    class Meta:
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'
    def __str__(self):
        tagName = str(self.nameProject) + "[" + str(self.idModule) + "]" + "(" + str(self.idTeacher) + ")"
        return tagName

##################################SEGUIMIENTO DE ALUMNO##################################
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
        tagName = str(self.idPupil) + "(" + str(self.idModule) + ")"
        return tagName

##################################ACTIVIDADES##################################
class Activity(models.Model):
    nameActivity = models.CharField(max_length=128)
    idActivity = models.AutoField(primary_key=True)
    idProject = models.ForeignKey(Project)
    idSF = models.ManyToManyField(StudentFollowing)


    class Meta:
        verbose_name = 'Actividad'
        verbose_name_plural = 'Actividades'
    def __str__(self):
        tagName = str(self.nameActivity) + "[" + str(self.idProject) +"]"
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

