# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-06-23 11:46
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('teacherRegister', '0002_auto_20160616_1220'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profesores',
            name='user',
            field=models.OneToOneField(max_length=128, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
