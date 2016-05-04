from rest_framework import serializers

#load django and webapp models
from django.contrib.auth.models import *
from webapp.models import *
from django.db.models.fields import *
from rest_framework.fields import *  

class UserSerializer(serializers.HyperlinkedModelSerializer):
#    loggs = serializers.PrimaryKeyRelatedField(many=True, read_only=True)


    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
        write_only_fields = ('password',)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class GroupSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Group
        fields = ('name', 'permissions')
        depth = 1;

class PermissionSerializer(serializers.HyperlinkedModelSerializer):
   
    class Meta:
        model = Permission
        fields = ('url','name')


class LoggSerializer(serializers.ModelSerializer):

    class Meta:
        model = Logg
        fields = ('id', 'event', 'stime', 'sdate', 'vis_date', 'vis_time')


