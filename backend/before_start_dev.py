import os

import django
from django.conf import settings
from django.core import management
from django.contrib.auth import get_user_model

from project import settings as project_settings


def main():
    settings.configure(**project_settings.__dict__)
    django.setup()

    # Remove database
    db_path = settings.DATABASES['default']['NAME']

    try:
        os.remove(db_path)
    except FileNotFoundError:
        pass

    # Migrate
    management.call_command('migrate')

    # Create test admin user
    User = get_user_model()
    User.objects.create_superuser('admin', '', 'admin')


if __name__ == '__main__':
    main()
