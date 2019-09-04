from django.contrib import admin

from . import models

# Register your models here.
# admin.site.register([
#     models.Post
# ])


@admin.register(models.Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('owner', 'title', 'uploaded_at', 'image')
    list_filter = ('owner__username', 'title', 'uploaded_at')
    search_fields = ('owner__username', 'title')
    view_on_site = False
