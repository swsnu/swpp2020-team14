# Generated by Django 3.1.2 on 2020-12-16 06:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fontopia', '0005_auto_20201216_0614'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='photo',
            name='metadata',
        ),
        migrations.RemoveField(
            model_name='photo',
            name='selected_font',
        ),
    ]
