# The task management

* Backend - Django framework
* Frontend - Ember js framework


## Required

For backend

* pip install djangorestframework
* pip install djangorestframework-jwt
* pip install django-cors-headers

## Settings

See article
* http://hairetdin.blogspot.ru/2017/02/ember-django-session-authentication.html

### Authentication

For authentication used:
* Django session if exist
* If Django session does not exist, authentication will redirect to /login page.
Default frontend /login realize for using backend jwt authentication.

### Frontend build

* After frontend change to build you can run shell script from
folder front/ember-taskin::

  ./build.sh

It is create assets and index.html in back/taskin/static/taskin.
* Then you need copy content from back/taskin/static/taskin/index.html to
back/taskin/templates/index-taskin.html and add line after all::

  {% extends "home.html" %}
