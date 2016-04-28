import os, sys
path = '/var/www/doorsense'
if path not in sys.path:
    sys.path.append(path)
os.environ['DJANGO_SETTINGS_MODULE'] = 'doorsense.settings'
import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
