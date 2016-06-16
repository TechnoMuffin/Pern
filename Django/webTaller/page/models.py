# encoding: utf-8
from __future__ import unicode_literals
from django.db import models
    
    
##################################CURSOS##################################

class Course(models.Model):
    idCourse = models.AutoField(primary_key=True)
    yearCourse = models.IntegerField()
    COURSE_OPTIONS = (
    (u'1A', u'1º año "A"'),
    (u'1B', u'1º año "B"'),
    (u'1C', u'1º año "C"'),
    (u'2A', u'2º año "A"'),
    (u'2B', u'2º año "B"'),
    (u'2C', u'2º año "C"'),
    (u'3A', u'3º año "A"'),
    (u'3B', u'3º año "B"'),
    (u'3C', u'3º año "C"'),
    )
    courseType = models.CharField(max_length=128, choices=COURSE_OPTIONS)

    class Meta:
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        
    def __str__(self):
        tagName = str(self.courseType) + " - " + str(self.yearCourse)
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
        tagName = str(self.namePupil) +" " + str(self.surnamePupil) + " [" + str(self.idCourse) + "]"
        return tagName

##################################CUMPLIMIENTOS##################################
class Fulfillment(models.Model):
    nameFF = models.CharField(max_length=128, primary_key=True)
    
    class Meta:
        verbose_name = 'Fulfillment'
        verbose_name_plural = 'Fulfillments'
    def __str__(self):
        tagName = str(self.nameFF)
        return tagName
    
##################################MATERIA##################################

class Subject(models.Model):
    idSubject = models.AutoField(primary_key=True)
    nameSubject = models.CharField(max_length=128)
    idFF = models.ManyToManyField(Fulfillment, blank=True)
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
        tagName = str(self.nameProject) + "[" + str(self.idSubject) + "]"
        return tagName
    
##################################ETAPAS DE PROYECTOS##################################
class ProjectStages(models.Model):
    namePS = models.CharField(max_length=128)
    idPS = models.AutoField(primary_key=True)
    idProject = models.ForeignKey(Projects)
    
    class Meta:
        verbose_name = 'Project Stage'
        verbose_name_plural = 'Project Stages'
    def __str__(self):
        tagName = str(self.namePS) + "[" + str(self.idProject) +"]"
        return tagName
    