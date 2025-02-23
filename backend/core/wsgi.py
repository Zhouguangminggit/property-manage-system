"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# 加载环境变量
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(env_path)

# 根据环境变量设置Django的settings模块
DJANGO_ENV = os.getenv('DJANGO_ENV', 'development')
if DJANGO_ENV == 'production':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')
elif DJANGO_ENV == 'testing':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.test')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
