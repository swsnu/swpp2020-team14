from django.http import JsonResponse, HttpResponse, HttpResponseNotFound

def date2str(dt):
    return dt.strftime("%Y/%m/%d %H:%M:%S")

def force_login(f):
    def _inner(request, *args, **kwargs):
        if request.user.is_authenticated:
            return f(request, *args, **kwargs)
        return HttpResponse(403)
    return f

# Cf. https://thihara.github.io/Django-Req-Parsing/
def prepare_put(f):
    def _inner(request, *args, **kwargs):
        if request.method == "PUT":
            if hasattr(request, '_post'):
                del request._post
                del request._files
            try:
                request.method = "POST"
                request._load_post_and_files()
                request.method = "PUT"
            except AttributeError:
                request.META['REQUEST_METHOD'] = 'POST'
                request._load_post_and_files()
                request.META['REQUEST_METHOD'] = 'PUT'
            request.PUT = request.POST
        return f(request, *args, **kwargs)
    return _inner
