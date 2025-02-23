#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv


def main():
    """Run administrative tasks."""
    # 加载环境变量
    env_path = Path(__file__).resolve().parent / '.env'
    load_dotenv(env_path)

    # 根据环境变量设置Django的settings模块
    DJANGO_ENV = os.getenv('DJANGO_ENV', 'development')
    if DJANGO_ENV == 'production':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')
    elif DJANGO_ENV == 'testing':
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.test')
    else:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
