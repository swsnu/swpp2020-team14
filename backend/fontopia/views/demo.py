from django.views import View
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.utils.decorators import method_decorator
from django.db import models
from django.core.files.images import get_image_dimensions

from fontopia.ml.inference import perform_inference
from fontopia.ml.config import labels

class APIDemoView(View):
    def post(self, request):
        try:
            uploaded_image = request.FILES['image']
        except KeyError:
            return JsonResponse({'success': False, 'error': 'Malformed request'})

        result = perform_inference(uploaded_image, immediate=True)
        result = list(map(float, result[0]))

        result_sorted = sorted(list(zip(labels, result)), key=lambda pair: -pair[1])
        result_for_json = [{"font": label, "prob": p} for label, p in result_sorted]

        return JsonResponse({'success': True, 'result': result_for_json})
