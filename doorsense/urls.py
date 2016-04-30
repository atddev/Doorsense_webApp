from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
#Django Rest Framework
from rest_framework import routers
from webapp import views

#REST API routes
router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'loggs', views.LoggViewSet)
admin.autodiscover()

urlpatterns = patterns('',

    url(r'^admin/', include(admin.site.urls)),

   # route requests for / to the home controll
   url(r'^$', 'webapp.views.home'),

 #REST API
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^session/$', views.Session.as_view()),

)