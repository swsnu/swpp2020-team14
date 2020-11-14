from django.views import View
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.db import models

from fontopia.models import Finding, Font, Photo

class APIReport(View):
    def get(self, request, photo_id=None):
        
        target_photo = Photo.objects.get(id=photo_id)

        resp = [{
            'id': f.id,
            'font': {
                'id': f.font.id,
                'name': f.font.name,
                'manufacturer_name': f.font.manufacturer,
                'license': {
                    'is_free': f.font.is_free,
                    'type': f.font.license_summary
                },
                'view_count': f.font.view_count,
            },
            'probability': f.probability,
            } for f in Finding.objects.filter(photo=target_photo)]

        return JsonResponse(data={
            'findings': resp,
        })

