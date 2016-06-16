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
def registerUser(request):
        context = RequestContext(request)
        return render_to_response('CreaUsuario.html',context)
def loginUser(request):
        context = RequestContext(request)
        return render_to_response('Login.html',context)
def olvidaContra(request):
        context = RequestContext(request)
        return render_to_response('OlvidoContra.html',context)
def loginAdmin(request):
        context = RequestContext(request)
        return render_to_response('LogAdmin.html',context)
def documentos(request):
        context = RequestContext(request)
        return render_to_response('Documentos.html',context)
