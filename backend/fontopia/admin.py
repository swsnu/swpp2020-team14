"""
Django models registered in admin site
"""

from django.contrib import admin

# Register your models here.
from .models import Font, Photo, Finding, Article, Comment

admin.site.register(Font)
admin.site.register(Photo)
admin.site.register(Finding)
admin.site.register(Article)
admin.site.register(Comment)