from django.views import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.http import HttpResponse

class CSRFTokenView(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return HttpResponse()
