from django.contrib import admin
from .models import FontopiaUser, Font, Photo, Finding, Article, Comment

# Register your models here.

admin.site.register(FontopiaUser)
admin.site.register(Font)
admin.site.register(Photo)
admin.site.register(Finding)
admin.site.register(Article)
admin.site.register(Comment)
