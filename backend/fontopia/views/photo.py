from django.views import View
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.utils.decorators import method_decorator
from django.db import models
from django.core.files.images import get_image_dimensions

from fontopia.models import Photo, Font
from fontopia.utils import date2str, force_login, prepare_patch
from fontopia.ml import inference

from datetime import datetime, timezone

class APIPhoto(View):
    def post(self, request):
        try:
            uploaded_image = request.FILES['image']
        except (KeyError, AssertionError):
            return JsonResponse({'success': False, 'error': 'Malformed request'})
        width, height = get_image_dimensions(uploaded_image)

        p = Photo.objects.create(
            author=request.user if request.user.is_authenticated else None,
            is_analyzed=False,
            analyzed_at=None,
            width=width,
            height=height
        )

        p.save()
        p.image_file.save('photo', uploaded_image)

        inference.perform_inference(p)

        return JsonResponse({'success': True, 'id': p.id})

class APIPhotoMy(View):
    @method_decorator(force_login)
    def get(self, request):
        photos_my = Photo.objects.filter(author=request.user)

        n = None
        try:
            n = int(request.GET['trunc'])
            # assert 1 <= n
        except (KeyError, ValueError, AssertionError):
            n = None

        resp = [
            {
                'id': p.id,
                'memo': p.memo,
                'image_url': p.image_file.url
            } for p in photos_my[:n]]
        return JsonResponse(data={
            'photos': resp,
        })

class APIPhotoItem(View):
    def get(self, request, photo_id=None):
        q = Photo.objects.filter(id=photo_id)

        if not q.count():
            return HttpResponseNotFound()

        p = q.get()

        return JsonResponse(data={'photo': {
            'id': p.id,
            'memo': p.memo,
            'image_url': p.image_file.url
        }})

    @method_decorator([force_login, prepare_patch])
    def patch(self, request, photo_id=None): # pragma: no cover
        q = Photo.objects.filter(id=photo_id)
        if not q.count():
            return JsonResponse({'success': False, 'error': 'No such article'})
        p = q.get()
        if p.author != request.user:
            return JsonResponse({'success': False, 'error': 'Author mismatch'})

        body = request.PATCH
        if('memo' in body):
            p.memo = body['memo']

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
