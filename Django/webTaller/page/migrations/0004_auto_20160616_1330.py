# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-06-16 13:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('page', '0003_remove_fulfillment_checkff'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='fulfillment',
            name='idFF',
        ),
        migrations.AlterField(
            model_name='fulfillment',
            name='nameFF',
            field=models.CharField(max_length=128, primary_key=True, serialize=False),
        ),
    ]
