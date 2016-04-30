# Import http functionality
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template import Context, RequestContext, loader
from django.shortcuts import render, render_to_response, get_object_or_404
from django.template.loader import render_to_string
from django.core.urlresolvers import reverse
from rest_framework import status
# Import models
from django.db import models
from django.contrib.auth.models import User
from webapp.models import *
#from webapp.forms import *

#REST API
from rest_framework import viewsets
from webapp.serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework import filters
# Import helper functions
from django.contrib.auth import authenticate as auth_func
from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.contrib import messages
from django import forms

from rest_framework import generics

from rest_framework.permissions import AllowAny, IsAuthenticated, DjangoModelPermissionsOrAnonReadOnly
from django.contrib.auth import authenticate, login, logout

SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class VisitorPermissions(permissions.BasePermission):    
   def has_permission(self, request, view):
        if (request.method in SAFE_METHODS and
            request.user.is_authenticated() or
            request.user.is_staff):
            return True
        return False

class PermissionViewSet(viewsets.ModelViewSet):
 """
 API endpoint that allows permissions to be viewed or edited.
 """
 queryset = Permission.objects.all()
 serializer_class = PermissionSerializer


class LoggViewSet(viewsets.ModelViewSet):
 """
 API endpoint that allows content items to be viewed or edited.
 """
 permission_classes = (IsAuthenticated,)
 queryset = Logg.objects.all()
 serializer_class = LoggSerializer



# Create your views here.
def home(request):
  """
  Default controller for handling requests to /
  This method only serves the index.html file.
  """
  
  return render_to_response('ember.html',
                {}, RequestContext(request))

class Session(APIView):
    permission_classes = (AllowAny,)
    error_messages = {
        'invalid': "Invalid username or password",
        'disabled': "Sorry, this account is suspended",
    }

    def send_error_response(self, message_key):
        data = {
            'success': False,
            'message': self.error_messages[message_key],
            'user_id': None,
        }
        return Response(data)

    def get(self, request, *args, **kwargs):
        # Get the current user
        if request.user.is_authenticated():
            return Response({'user_id': request.user.id})
        return Response({'user_id': None})

    def post(self, request, *args, **kwargs):
        # Login
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return Response({'success': True, 'user_id': user.id})
            return self.send_error_response('disabled')
        return self.send_error_response('invalid')

    def delete(self, request, *args, **kwargs):
        # Logout
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
