# Generated by Django 5.1.1 on 2024-09-08 12:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hive', '0005_alter_user_options_alter_user_managers_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='firstname',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name='user',
            name='lastname',
            field=models.CharField(blank=True, max_length=30),
        ),
    ]