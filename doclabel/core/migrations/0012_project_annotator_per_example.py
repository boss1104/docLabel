# Generated by Django 2.2.6 on 2019-11-26 12:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_auto_20191121_1547'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='annotator_per_example',
            field=models.IntegerField(default=3),
        ),
    ]
