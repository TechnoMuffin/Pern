# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-16 15:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('page', '0007_auto_20160616_1415'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subject',
            name='idFF',
            field=models.ManyToManyField(blank=True, to='page.Fulfillment'),
        ),
    ]