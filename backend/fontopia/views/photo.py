from django.views import View
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.utils.decorators import method_decorator
from django.db import models
from django.core.files.images import get_image_dimensions

from fontopia.models import Photo, Font
from fontopia.utils import date2str, force_login, prepare_patch

from datetime import datetime

class APIPhoto(View):
    def get(self, request):

        q = Photo.objects.filter(author=request.user)

        resp = [{
            'id': p.id,
            'memo': p.memo,
            'image_url': p.image_file.url,
            'selected_font': {
                'id': p.selected_font.id,
                'name': p.selected_font.name,
                'manufacturer_name': p.selected_font.manufacturer,
                'license': {
                    'is_free': p.selected_font.is_free,
                    'type': p.selected_font.license_summary
                },
                'view_count': p.selected_font.view_count,
            },
            } for p in q]

        return JsonResponse(data={
            'photos': resp,
        })
    
    @method_decorator(force_login)
    def post(self, request):
        try:
            body = request.POST
            memo = body['memo']
            uploaded_image = request.FILES['image']
            print(uploaded_image)
        except KeyError:
            return JsonResponse({'success': False, 'error': 'Malformed request'})
        now = datetime.now()
        width, height = get_image_dimensions(uploaded_image)
        metadata = {'data': 'data'}
        f = Font.objects.get(id=1)

        p = Photo.objects.create(author=request.user, memo=memo,
        is_analyzed=False, analyzed_at=now,
        width=width, height=height,
        selected_font=f, metadata=metadata)

        p.save()
        p.image_file.save('photo', uploaded_image)
        return JsonResponse({'success': True, 'id': p.id})


class APIPhotoItem(View):
    def get(self, request, photo_id=None):
        q = Photo.objects.filter(id=photo_id)

        if not q.count():
            return HttpResponseNotFound()

        p = q.get()

        return JsonResponse(data={'photo': {
            'id': p.id,
            'memo': p.memo,
            'image_url': p.image_file.url,
            'selected_font': {
                'id': p.selected_font.id,
                'name': p.selected_font.name,
                'manufacturer_name': p.selected_font.manufacturer,
                'license': {
                    'is_free': p.selected_font.is_free,
                    'type': p.selected_font.license_summary
                },
                'view_count': p.selected_font.view_count,
            },
        }})

    @method_decorator([force_login, prepare_patch])
    def patch(self, request, photo_id=None):
        q = Photo.objects.filter(id=photo_id)
        if not q.count():
            return JsonResponse({'success': False, 'error': 'No such article'})
        p = q.get()
        if p.author != request.user:
            return JsonResponse({'success': False, 'error': 'Author mismatch'})

        body = request.PATCH
        if('memo' in body):
            p.memo = body['memo']

        if('selected_font' in body):
            selecetd_font_id = body['selected_font']
            f = Font.objects.get(id=selecetd_font_id)
            p.selected_font = f

        p.save()
        return JsonResponse({'success': True, 'id': p.id})

    @method_decorator(force_login)
    def delete(self, request, photo_id=None):
        q = Photo.objects.filter(id=photo_id)
        if not q.count():
            return JsonResponse({'success': False, 'error': 'No such photo'})
        p = q.get()

        if p.author != request.user:
            return JsonResponse({'success': False, 'error': 'Author mismatch'})

        p.image_file.delete()
        p.delete()
        return JsonResponse({'success': True})
