from .base import *
import django_heroku
import dj_database_url

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['127.0.0.1', 'localhost']

CSRF_COOKIE_SECURE = True
#SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases
# TO-DO : set configuration for postgresql database

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER_NAME'),
        'PASSWORD':config('DB_USER_PASSWORD'),
        'HOST':config('DB_HOST'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

django_heroku.settings(locals())

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)
