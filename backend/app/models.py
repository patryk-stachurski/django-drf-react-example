from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

from project import settings


class Post(models.Model):
    owner = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name=_('Owner'),
        help_text='The user which owns the post'
    )
    uploaded_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Upload time')
    )
    title = models.CharField(
        max_length=255,
        verbose_name=_('Title'),
        help_text=_('The title of the post')
    )
    image = models.ImageField(
        upload_to='images/',
        verbose_name=_('Image'),
        help_text=_('The image of the post')
    )

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f'{self.title!r} by {self.owner.username!r} - {self.uploaded_at}'
