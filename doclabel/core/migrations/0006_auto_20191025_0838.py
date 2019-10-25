# Generated by Django 2.2.6 on 2019-10-25 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20191025_0815'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='project_type',
            field=models.CharField(choices=[('textclassificationproject', 'Document Classification'), ('sequencelabelingproject', 'Sequence Labeling'), ('seq2seqproject', 'Sequence to Sequence')], max_length=30),
        ),
    ]
