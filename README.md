# Door Sense WebApp
This web application provides a control panel and a a RESTful API to [the Android Door Sense App](https://github.com/atddev/Metawear_Android) . Using Django Rest Framework with Ember.js the client side framework.


## Prerequisite:

1. Install apache and mod_wsgi:

`
sudo apt-get install apache2 apache2.2-common apache2-mpm-worker apache2-threaded-dev libapache2-mod-wsgi
`

2. Download and install [Django](https://docs.djangoproject.com/en/1.9/topics/install/)

3. Configure [Django with Apache and mod_wsgi](https://docs.djangoproject.com/en/1.9/howto/deployment/wsgi/modwsgi/)

4. Install nodejs, npm and ember-tools:
```
sudo apt-get install nodejs nodejs-legacy
sudo apt-get install npm
sudo npm install -g ember-tools
```


## Usage Instructions

1. Change the hostname is the `static/ember/js/config/app.js` file

2. Use `ember build` to build the webapp

