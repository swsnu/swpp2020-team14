from django.urls import path

from . import views

urlpatterns = [
    path('font', views.font.APIFont.as_view()),
    path('font/<int:font_id>', views.font.APIFontItem.as_view()),
    path('my-page/photo', views.photo.APIPhoto.as_view()),
    path('my-page/photo/<int:photo_id>', views.photo.APIPhotoItem.as_view()),
    path('my-page/photo/<int:photo_id>/report', views.report.APIReport.as_view()),
]
