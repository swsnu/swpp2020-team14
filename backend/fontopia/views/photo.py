from django.views import View
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.db import models

from fontopia.models import Photo

class APIPhoto(View):
    def get(self, request):
        resp = [{
            'id': f.id,
            'memo': f.memo,
            'selected_font': {
                'id': f.selected_font.id,
                'name': f.selected_font.name,
                'manufacturer_name': f.selected_font.manufacturer,
                'license': {
                    'is_free': f.selected_font.is_free,
                    'type': f.selected_font.license_summary
                },
                'view_count': f.selected_font.view_count,
            },
            } for f in Photo.objects.all()]

        return JsonResponse(data={
            'list': resp,
        })

class APIPhotoItem(View):
    def get(self, request, photo_id=None):
        q = Photo.objects.filter(id=photo_id)

        if not len(q):
            return HttpResponseNotFound()

        f = q.get()
        return JsonResponse(data={
            'id': f.id,
            'memo': f.memo,
            'selected_font': {
                'id': f.selected_font.id,
                'name': f.selected_font.name,
                'manufacturer_name': f.selected_font.manufacturer,
                'license': {
                    'is_free': f.selected_font.is_free,
                    'type': f.selected_font.license_summary
                },
                'view_count': f.selected_font.view_count,
            },
        })