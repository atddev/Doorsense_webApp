from django.db import models
from django.forms import ModelForm
from django.contrib.auth.models import User


# Create your models here.
class Logg(models.Model):
	# Event type: Opening or Closing
	event = models.CharField(max_length=30)
	# Sender time
	stime = models.CharField(max_length=60)
	# Sender date
	sdate = models.CharField(max_length=60)
	# Server date and time
	vis_date = models.DateField(auto_now_add=True, blank=True)
	vis_time = models.TimeField(auto_now_add=True, blank=True)

	class Meta:
	#This will be used by the admin interface 
		verbose_name_plural = "Logs"


	class Admin:
		list_display = ('event', 'stime', 'sdate', 'vis_date', 'vis_time')

	def toDict(self):

		Logg = {
		'id': self.id,
		'event': self.event,
		'stime':self.stime,
		'sdate':self.sdate,
		'vis_date': self.vis_date,
		'vis_time':self.vis_time,    
		}
		return Logg
