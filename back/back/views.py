from django.shortcuts import render

def index(request):
    response = render(request, 'home.html')
    return response
