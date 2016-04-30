from django.contrib import admin
from webapp.models import *

#Register your models with the admin interface here
class LoggAdmin(admin.ModelAdmin):
    list_display = ('event', 'stime', 'vis_date', 'vis_time')
admin.site.register(Logg,LoggAdmin)