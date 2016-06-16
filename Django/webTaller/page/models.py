# encoding: utf-8
from __future__ import unicode_literals
from django.db import models
    
    
##################################CURSOS##################################

class Course(models.Model):
    idCourse = models.AutoField(primary_key=True)
    yearCourse = models.IntegerField()
    DIVISION_OPTIONS = (
    (u'A', u'Division A'),
    (u'B', u'Division B'),
    (u'C', u'Division C'),
    )
    YEAR_OPTIONS = (
    (u'1', u'1er Año'),
    (u'2', u'2do Año'),
    (u'3', u'3er Año'),
    )
    divisionCourse = models.CharField(max_length=128, choices=DIVISION_OPTIONS)
    divisionYear = models.CharField(max_length=128, choices=YEAR_OPTIONS)

    class Meta:
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        
    def __str__(self):
        tagName = str(self.divisionYear) + " " + str(self.divisionCourse) + "(" + str(self.yearCourse) + ")"
        return tagName
    
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
        tagName = str(self.namePupil) +" " + str(self.surnamePupil)
        return tagName

##################################MATERIA##################################

class Subject(models.Model):
    idSubject = models.AutoField(primary_key=True)
    nameSubject = models.CharField(max_length=128)
    idCourse = models.ManyToManyField(Course)
    
    class Meta:
        verbose_name = 'Subject'
        verbose_name_plural = 'Subjects'
    def __str__(self):
        tagName = str(self.nameSubject)
        return tagName
    
##################################SEGUIMIENTO DE ALUMNO##################################
class PupilFollowing(models.Model):
    idPF = models.AutoField(primary_key=True)
    presencePF = models.BooleanField(blank=True)
    datePF = models.DateField()
    idSubject = models.ForeignKey(Subject)
    idPupil = models.ForeignKey(Pupil)
    commentPF = models.TextField()
    
    class Meta:
        verbose_name = 'Pupil Following'
        verbose_name_plural = 'Pupils Following'
    def __str__(self):
        print str(self.idSubject)
        tagName = str(Pupil(self.idPupil)) + "(" + str(self.idSubject) + ")"
        return tagName
    
