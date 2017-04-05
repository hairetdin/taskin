# The task management

* Backend - Django framework
* Frontend - Ember js framework


## Required

For backend

* pip install djangorestframework
* pip install djangorestframework-jwt
* pip install django-cors-headers

settings.py

-------------
CORS_ORIGIN_WHITELIST = (
    'localhost:4200',
    '127.0.0.1:4200'
)


REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
    'PAGE_SIZE': 10,
}


JWT_AUTH = {
    'JWT_RESPONSE_PAYLOAD_HANDLER': 'taskin.views.jwt_response_payload_handler',
    'JWT_AUTH_HEADER_PREFIX': 'Bearer',
    # default JWT_EXPIRATION_DELTA - 5 minutes
    # JWT_EXPIRATION_DELTA = datetime.timedelta(seconds=300)
    'JWT_EXPIRATION_DELTA': datetime.timedelta(hours=12),
}
---------
