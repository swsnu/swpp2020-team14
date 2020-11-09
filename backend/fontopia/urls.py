from django.urls import path

from . import views

urlpatterns = [
    path('token', views.common.CSRFTokenView.as_view()),

    path('article', views.article.APIArticle.as_view()),
    path('article/<int:article_id>', views.article.APIArticleItem.as_view()),
    path('article/<int:article_id>/like', views.article.APIArticleLike.as_view()),
    path('article/<int:article_id>/comment', views.article.APIComment.as_view()),

    path('font', views.font.APIFont.as_view()),
    path('font/<int:font_id>', views.font.APIFontItem.as_view()),
    path('my-page/photo', views.photo.APIPhoto.as_view()),
    path('my-page/photo/<int:photo_id>', views.photo.APIPhotoItem.as_view()),
    path('my-page/photo/<int:photo_id>/report', views.report.APIReport.as_view()),
]
