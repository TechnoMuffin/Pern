# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os, sys
from django.db import models
    
#Changes:
#
#Added Rotation
#ProjectStages-->Activities
#Added Usuario

##################################CUMPLIMIENTOS##################################
class Fulfillment(models.Model):
    nameFF = models.CharField(max_length=128, primary_key=True)
    
    class Meta:
        verbose_name = 'Fulfillment'
        verbose_name_plural = 'Fulfillments'
    def __str__(self):
        tagName = str(self.nameFF)
        return tagName

##################################CURSOS##################################

class Course(models.Model):
    idCourse = models.AutoField(primary_key=True)
    yearCourse = models.IntegerField()
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
        tagName = str(self.courseType) + str(self.courseDivision) + " - " + str(self.yearCourse)
        return tagName
    
##################################MATERIA##################################

class Subject(models.Model):
    idSubject = models.AutoField(primary_key=True)
    nameSubject = models.CharField(max_length=128)
    idCourse = models.ManyToManyField(Course, blank=True)
    nameFF = models.ManyToManyField(Fulfillment, blank=True)

    
    class Meta:
        verbose_name = 'Subject'
        verbose_name_plural = 'Subjects'
    def __str__(self):
        tagName = str(self.nameSubject)
        return tagName
    
##################################USUARIO##################################
class Usuario(models.Model):
    name = models.CharField(max_length=128)
    surname = models.CharField(max_length=128)
    email = models.EmailField(max_length=254)
    dni = models.DecimalField(max_digits=9)
    idU = models.AutoField(primary_key=True)

##################################ALUMNO##################################

class Pupil(models.Model):
    namePupil = models.CharField(max_length=128)
    surnamePupil = models.CharField(max_length=128)
    idPupil = models.AutoField(primary_key=True)
    idCourse = models.ForeignKey(Course)

    class Meta:
        verbose_name = 'Pupil'
        verbose_name_plural = 'Pupils'
    def __str__(self):
        tagName = str(self.namePupil) +" " + str(self.surnamePupil) + " [" + str(self.idCourse) + "]"
        return tagName

##################################SEGUIMIENTO DE ALUMNO##################################
class PupilFollowing(models.Model):
    idPF = models.AutoField(primary_key=True)
    presencePF = models.BooleanField(blank=True)
    datePF = models.DateField()
    idSubject = models.ForeignKey(Subject)
    idPupil = models.ForeignKey(Pupil)
    commentPF = models.TextField(blank=True)
    
    class Meta:
        verbose_name = 'Pupil Following'
        verbose_name_plural = 'Pupils Following'
    def __str__(self):
        tagName = str(self.idPupil) + "(" + str(self.idSubject) + ")"
        return tagName
    
##################################PROYECTOS##################################
class Projects(models.Model):
    nameProject = models.CharField(max_length=128, primary_key=True)
    idSubject = models.ForeignKey(Subject)
    
    class Meta:
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
    def __str__(self):
        tagName = u""+str(self.nameProject) + "[" + str(self.idSubject) + "]"
        return tagName
    
##################################ETAPAS DE PROYECTOS##################################
class Activities(models.Model):
    namePS = models.CharField(max_length=128)
    calification = models.IntegerField()
    classes = models.IntegerField()
    idPS = models.AutoField(primary_key=True)
    nameProject = models.ForeignKey(Projects, max_length=128)
    idPupil = models.ForeignKey(Pupil)
    
    class Meta:
        verbose_name = 'Activitie'
        verbose_name_plural = 'Activities'
    def __str__(self):
        tagName = u""+ str(self.namePS) + "[" + str(self.nameProject) +"]" + "(" + str(self.idPupil) + ")"
        return tagName
    
###################################CALIFICATION##################################
#class Calification(models.Model):
#    note = models.IntegerField()
#    classes = models.IntegerField()
#    idPS = models.ForeignKey(ProjectStages)
#    idPupil = models.ForeignKey(Pupil)
#    idCal = models.AutoField(primary_key=True)
#    nameProject = models.ForeignKey(Projects)
#    
#    class Meta:
#        verbose_name = 'nota'
#        verbose_name_plural = 'notas'
#    def __str__(self):
#        tagName = str(self.idPupil) + " [" + str(self.idPS) + "] " + " (" + str(self.note) + ")"
#        return tagName 

##################################CONTROL##################################
class CheckFF(models.Model):
    nameFF = models.ForeignKey(Fulfillment, max_length=128)
    idPF = models.ForeignKey(PupilFollowing)
    check = models.BooleanField(blank=True)
    
    class Meta:
        verbose_name = 'Fullfilments Check'
        verbose_name_plural = 'Fulfillments Checks'
    def __str__(self):
        tagName = str(self.nameFF) + "[" + str(self.idPF) + "]"
        return tagName
    
##################################CONTROL##################################
class Rotation(models.Model):
    nameRotation = models.CharField(max_length=32)
    idRotation = models.AutoField(primary_key=True)
    idSubject = models.ForeignKey(Subject)
    idCourse = models.ForeignKey(Course)
    
    class Meta:
        verbose_name = 'Rotation'
        verbose_name_plural = 'Rotations'
    def __str__(self):
        tagName = u""+ str(self.nameRotation) + "[" + str(self.idSubject) +"]" + "(" + str(self.idCourse) + ")"
        return tagName