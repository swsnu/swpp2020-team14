from django.views import View
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.core.paginator import Paginator
from django.db import models

from fontopia.models import Font

class APIFont(View):
    def get(self, request):
        page_idx = request.GET.get('page', 1)
        paginator = Paginator(Font.objects.order_by('id'), 20)
        page = paginator.get_page(page_idx)
        
        resp = [{
            'id': f.id,
            'name': f.name,
            'manufacturer_name': f.manufacturer,
            'license': {
                'is_free': f.is_free,
                'type': f.license_summary
            },
            'view_count': f.view_count,
        } for f in page]

        return JsonResponse(data={
            'list': resp,
            'pages': paginator.num_pages,
            'cur': page.number
        })

class APIFontMostViewed(View):
    def get(self, request):
        q = Font.objects.order_by('-view_count')
        resp = [{
            'id': f.id,
            'name': f.name,
            'manufacturer_name': f.manufacturer,
            'license': {
                'is_free': f.is_free,
                'type': f.license_summary
            },
            'view_count': f.view_count,
        } for f in q[:5]]

        return JsonResponse(data={
            'list': resp
        })

class APIFontItem(View):
    def get(self, request, font_id=None):
        q = Font.objects.filter(id=font_id)

        if not len(q):
            return HttpResponseNotFound()

        if request.user.is_authenticated:
            q = q.prefetch_related('similars')

        f = q.get()
        response = {
            'id': f.id,
            'name': f.name,
            'manufacturer_name': f.manufacturer,
            'license': {
                'is_free': f.is_free,
                'type': f.license_summary,
                'detail': f.license_detail,
            },
            'view_count': f.view_count
        }

        f.view_count += 1
        f.save()

        if request.user.is_authenticated:
            response['similars'] = [{
                'id': s.id,
                'name': s.name,
                'view_count': s.view_count
            } for s in f.similars.all()]

        return JsonResponse(data=response)
