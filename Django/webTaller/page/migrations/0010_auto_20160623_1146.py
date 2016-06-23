# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-06-23 11:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('page', '0009_merge'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subject',
            name='idCourse',
        ),
        migrations.AddField(
            model_name='course',
            name='subjects',
            field=models.ManyToManyField(to='page.Subject'),
        ),
    ]
