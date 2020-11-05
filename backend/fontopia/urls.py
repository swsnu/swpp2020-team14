from django.urls import path

from . import views

urlpatterns = [
    path('font', views.font.APIFont.as_view()),
    path('font/<int:font_id>', views.font.APIFontItem.as_view()),
]
