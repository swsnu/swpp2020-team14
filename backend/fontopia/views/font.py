from django.views import View
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.core.paginator import Paginator
from django.db import models

from fontopia.models import Font

class APIFont(View):
    def get(self, request):
        page_idx = request.GET.get('page', 1)
        paginator = Paginator(Font.objects.order_by('-view_count'), 20)
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

class APIFontItem(View):
    def get(self, request, font_id=None):
        q = Font.objects.filter(id=font_id)

        if not len(q):
            return HttpResponseNotFound()

        f = q.get()
        return JsonResponse(data={
            'id': f.id,
            'name': f.name,
            'manufacturer_name': f.manufacturer,
            'license': {
                'is_free': f.is_free,
                'type': f.license_summary,
                'detail': f.license_detail,
            },
            'view_count': f.view_count
        })

