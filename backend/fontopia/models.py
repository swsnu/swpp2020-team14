from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Font(models.Model):
    name = models.CharField(max_length=100)
    is_free = models.BooleanField()
    license_summary = models.TextField()
    license_detail = models.JSONField()
    manufacturer = models.CharField(max_length=100)
    view_count = models.IntegerField()
 
class Photo(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='my_photos'
    )
    width = models.IntegerField()
    height = models.IntegerField()
    image_file = models.FileField()
    is_analyzed = models.BooleanField()
    analyzed_at = models.DateTimeField()
    selected_font = models.ForeignKey(
        Font,
        on_delete=models.CASCADE
    )
    memo = models.TextField()
    metadata = models.JSONField()

class Finding(models.Model):
    photo = models.ForeignKey(
        Photo,
        on_delete=models.CASCADE,
        related_name='findings'
    )
    font = models.ForeignKey(
        Font,
        on_delete=models.CASCADE,
    )
    probability = models.FloatField()

class Article(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='my_articles'
    )
    created_at = models.DateTimeField()
    last_edited_at = models.DateTimeField()
    title = models.CharField(max_length=100)
    content = models.TextField()
    image_file = models.FileField()
    liked_users = models.ManyToManyField(
        User,
        related_name='liked_articles'
    )
    view_count = models.IntegerField()

class Comment(models.Model):
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='my_comments'
    )
    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    created_at = models.DateTimeField()
    last_edited_at = models.DateTimeField()
    contents = models.TextField()
