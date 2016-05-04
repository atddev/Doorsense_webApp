"""
Django settings for doorsense project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'qsy-o_-v33qq-aguz*5-b^e#o@#!*82-v7=t797=td6p-kpabg'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'webapp',
    'rest_framework',
    'south',	
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'doorsense.urls'

WSGI_APPLICATION = 'doorsense.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME':  '/var/www/doorsense/doorsense.db'   
   # 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
STATIC_ROOT = 'var/www/doorsense/static'
STATIC_URL = '/static/'


TEMPLATE_DIRS = (
#template directory for webapp
'/var/www/doorsense/webapp/templates',
)

REST_FRAMEWORK = {

'PAGINATE_BY': 300,
    'PAGINATE_BY_PARAM': 'page_size',
    'MAX_PAGINATE_BY': 300,
    'DEFAULT_PAGINATION_SERIALIZER_CLASS':
        'rest_framework_ember.pagination.EmberPaginationSerializer',
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework_ember.parsers.EmberJSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser'
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework_ember.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    
 'DEFAULT_AUTHENTICATION_CLASSES': (
 'rest_framework.authentication.SessionAuthentication',
 ),
'DEFAULT_PERMISSION_CLASSES': (
# 'rest_framework.permissions.DjangoModelPermissions',
'webapp.api_settings.CustomDjangoModelPermissions',
)


}

