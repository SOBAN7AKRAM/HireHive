# Generated by Django 5.1.1 on 2024-09-09 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hive', '0007_alter_user_managers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
    ]