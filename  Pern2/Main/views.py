from django.template import RequestContext
from django.shortcuts import render_to_response, render, redirect
from django.core import serializers
from django.http import HttpResponse
import json

def pupilFollowing(request):
    context = RequestContext(request)
    return render_to_response('pupilFollowing.html',context)