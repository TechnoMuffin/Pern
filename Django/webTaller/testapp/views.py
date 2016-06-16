from django.shortcuts import render
from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect

# Create your views here.

def base(request):
        context = RequestContext(request)
        return render_to_response('base.html',context)
def seguimientoAl(request):
    context = RequestContext(request)
    return render_to_response('SeguimientoAlumno.html',context)

