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
    cicle = models.IntegerField()
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

