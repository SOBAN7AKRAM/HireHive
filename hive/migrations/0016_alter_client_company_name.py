# Generated by Django 5.1.1 on 2024-10-10 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hive', '0015_alter_freelancer_skills'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='company_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]