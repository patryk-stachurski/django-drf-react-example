import string
import random

from django.db import migrations
from django.conf import settings
from django.core.files.base import ContentFile

from app.utils import get_initial_posts


def create_random_password():
    chars = list(string.ascii_letters)
    random.shuffle(chars)
    return ''.join(chars)


def create_initial_posts(apps, schema_editor):
    User = apps.get_model(*settings.AUTH_USER_MODEL.rsplit('.', 1))
    Post = apps.get_model('app', 'Post')

    owner = User.objects.create(username='test_user')

    for title, image_path in get_initial_posts():
        post = Post.objects.create(title=title, owner=owner)
        post.image.save(name=title, content=ContentFile(image_path.read_bytes()))


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_initial_posts)
    ]
