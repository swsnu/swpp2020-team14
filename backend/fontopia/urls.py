"""
URL patterns for /api/
"""

from django.urls import path

from . import views

urlpatterns = [
    path('token', views.token),

    path('signup', views.signup),
    path('signin', views.signin),
    path('signout', views.signout),

    path('photo', views.photo),
    path('photo/<int:photo_id>', views.photo_id_),

    path('photo/<int:photo_id>/report', views.report),

    path('article', views.article),
    path('article/<int:article_id>', views.article_id_),
    path('article/<int:article_id>/like', views.like),

    path('article/<int:article_id>/comment', views.comment),
    path('article/comment/<int:comment_id>', views.comment_id_),

    path('font', views.font),
    path('font/<int:font_id>', views.font_id_),

    # path('font', views.font.APIFont.as_view()),
    # path('font/<int:font_id>', views.font.APIFontItem.as_view()),
]
