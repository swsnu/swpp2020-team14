# Generated by Django 3.1.2 on 2020-12-16 09:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fontopia', '0006_auto_20201216_0623'),
    ]

    operations = [
        migrations.AddField(
            model_name='font',
            name='similars',
            field=models.ManyToManyField(to='fontopia.Font'),
        ),
    ]
