from django.http import HttpResponse

def date2str(date):
    return date.strftime("%Y/%m/%d %H:%M:%S")

def force_login(func):
    def _inner(request, *args, **kwargs):
        if request.user.is_authenticated:
            return func(request, *args, **kwargs)
        return HttpResponse(403)
    return func

# Cf. https://thihara.github.io/Django-Req-Parsing/
def prepare_put(func):
    # pylint: disable=protected-access
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
        return func(request, *args, **kwargs)
    return _inner
