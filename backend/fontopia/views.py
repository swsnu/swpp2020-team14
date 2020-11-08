"""
View for fontopia app
"""
import json
from json import JSONDecodeError

from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.core import serializers

# from django.contrib.auth import get_user_model
from .models import Font, Photo, Finding, Article, Comment

# TODO permission vague 
# TODO: should check guest user is read-only

def handle_bad_request(func):
    """
    decorator for 400 bad request error
    """
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except (JSONDecodeError, KeyError):
            return HttpResponseBadRequest()
    return wrapper

def req2data(request):
    """
    parse JSON request to dict
    """
    return json.loads(request.body.decode())

@ensure_csrf_cookie
def token(request): # TODO: update wiki
    """
    /api/token
    """
    if request.method == 'GET':
        return HttpResponse(status=204)
    return HttpResponseNotAllowed(['GET'])

@handle_bad_request
def signup(request):
    """
    /api/signup
    """
    if request.method == 'POST':
        data = req2data(request)
        get_user_model().objects.create(
            username=data['username'],
            password=data['password'],
            first_name=data['first_name'],
        )
        return HttpResponse(status=201)
    return HttpResponseNotAllowed(['POST'])

@handle_bad_request
def signin(request):
    """
    /api/signin
    """
    if request.method == 'POST':
        data = req2data(request)
        user = authenticate(
            request,
            username=data['username'],
            password=data['password']
        )
        if user is not None:
            login(request, user)
            return HttpResponse(status_code=204)
        return HttpResponse(status_code=401)
    return HttpResponseNotAllowed(['POST'])

@handle_bad_request
@login_required
def signout(request):
    """
    /api/signout
    """
    if request.method == 'POST':
        logout(request)
        return HttpResponse(status_code=204)
    return HttpResponseNotAllowed(['POST'])

@handle_bad_request
@login_required
def photo(request):
    """
    /api/photo
    """
    if request.method == 'GET':
        return JsonResponse(serializers('json', 
            Photo.object.filter(author=request.user), # TODO: security issue
            fields=('width', 'height', 'is_analyzed', 'analyzed_at', 'selected_font')
        ))
    elif request.method == 'POST': # TODO
        data = req2data(request)
        photo = Photo.objects.create(
            author=request.user,
            width=512,
            height=512,
            image_file=None,
            is_analyzed=False,
            analyzed_at=None,
            selected_font=None,
            memo="",
            metadata=None
        )
        return JsonResponse(serializers('json', 
            photo, 
            fields=('width', 'height', 'is_analyzed', 'analyzed_at', 'selected_font')
        ))
    return HttpResponseNotAllowed(['GET', 'POST'])

@handle_bad_request
@login_required
def photo_id_(request, photo_id):
    """
    /api/photo/:photo_id
    """
    photo = Photo.object.get(id=photo_id)
    if photo.author != request.user:
        return HttpResponse(status=403) # TODO: check this type of security fault
    if request.method == 'GET':
        return JsonResponse(serializers('json',
            photo,
            fields=('width', 'height', 'is_analyzed', 'analyzed_at', 'selected_font')
        ))
    elif request.method == 'PUT': # TODO: check what it is
        return HttpResponseBadRequest()
    elif request.method == 'DELETE':
        photo.delete()
        return HttpResponse(status=200)
    return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

@handle_bad_request
@login_required
def report(request, photo_id):
    """
    /api/photo/:photo_id/report
    """
    photo = Photo.object.get(id=photo_id)
    if photo.author != request.user:
        return HttpResponse(status=403)
    if request.method == 'GET':
        return JsonResponse(serializers('json',
            Finding.objects.filter(photo=photo),
            fields=(font, probability)
        ))
    return HttpResponseNotAllowed(['GET'])

@handle_bad_request
def article(request):
    """
    /api/article
    """
    if request.method == 'GET':
        return JsonResponse(serializers('json', 
            Article.object.all(),
            fields=('author', 'created_at', 'last_edited_at', 'title', 'content', 'liked_users')
        ))
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return HttpResponse(status=401)
        data = req2data(request)
        Article.objects.create(
            author=request.user,
            title=data['title'],
            content=data['content'],
        )
        return HttpResponse()
    return HttpResponseNotAllowed(['GET', 'POST'])

@handle_bad_request
def article_id_(request, article_id):
    """
    /api/article/:article_id
    """
    if request.method == 'GET':
        return HttpResponse()
    elif request.method == 'PUT':
        return HttpResponse()
    elif request.method == 'DELETE':
        return HttpResponse()
    return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

@handle_bad_request
@login_required
def like(request, article_id):
    """
    /api/article/:article_id/like
    """
    if request.method == 'GET':
        return HttpResponse()
    elif request.method == 'PUT':
        return HttpResponse()
    elif request.method == 'DELETE':
        return HttpResponse()
    return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

@handle_bad_request
def comment(request, article_id):
    """
    /api/comment/:article_id/comment
    """
    if request.method == 'GET':
        return HttpResponse()
    elif request.method == 'POST':
        return HttpResponse()
    return HttpResponseNotAllowed(['GET', 'POST'])

@handle_bad_request
def comment_id_(request, comment_id):
    """
    /api/comment/:comment_id
    """
    if request.method == 'GET':
        return HttpResponse()
    elif request.method == 'PUT':
        return HttpResponse()
    elif request.method == 'DELETE':
        return HttpResponse()
    return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

@handle_bad_request
def font(request):
    """
    /api/font
    """
    if request.method == 'GET':
        return HttpResponse()
    return HttpResponseNotAllowed(['GET'])

@handle_bad_request
def font_id_(request, font_id):
    """
    /api/font/:font_id
    """
    if request.method == 'GET':
        return HttpResponse()
    return HttpResponseNotAllowed(['GET'])
