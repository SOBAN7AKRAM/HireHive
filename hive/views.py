from django.shortcuts import render
from django.http import HttpResponse
import json
from django.http import JsonResponse
# Create your views here.
def index(request):
    return JsonResponse({'hello': "hello"}, safe=False)