from datetime import datetime, timezone

from django.views import View
from django.http import JsonResponse, HttpResponseNotFound
from django.utils.decorators import method_decorator
from django.core.paginator import Paginator

from fontopia.models import Article
from fontopia.utils import date2str, force_login, prepare_put

class APIArticle(View):
    def get(self, request):
        page_idx = request.GET.get('page', 1)
        paginator = Paginator(Article.objects.order_by('-id'), 20)
        page = paginator.get_page(page_idx)

        resp = [{
            'id': a.id,
            'title': a.title,
            'author': a.author.first_name
        } for a in page]

        return JsonResponse(data={
            'list': resp,
            'pages': paginator.num_pages,
            'cur': page.number
        })

    @method_decorator(force_login)
    def post(self, request):
        try:
            body = request.POST
            title = body['title']
            content = body['content']
            uploaded_image = request.FILES['image']
        except KeyError:
            return JsonResponse({'success': False, 'error': 'Malformed request'})
        now = datetime.now(timezone.utc)
        a = Article.objects.create(title=title, content=content,
            author=request.user, created_at=now, last_edited_at=now,
            view_count=0)
        a.save()
        a.image_file.save('article/attachment', uploaded_image)
        return JsonResponse({'success': True, 'id': a.id})

class APIArticleMy(View):
    @method_decorator(force_login)
    def get(self, request):
        page_idx = request.GET.get('page', 1)
        articles_my = Article.objects.filter(author=request.user)
        paginator = Paginator(articles_my.order_by('-id'), 20)
        page = paginator.get_page(page_idx)

        resp = [{
            'id': a.id,
            'title': a.title,
            'author': a.author.first_name
        } for a in page]

        return JsonResponse(data={
            'list': resp,
            'pages': paginator.num_pages,
            'cur': page.number
        })

class APIArticleItem(View):
    def get(self, request, article_id=None):
        q = Article.objects.filter(id=article_id)

        if not q.count():
            return HttpResponseNotFound()

        a = q.get()

        likes = a.liked_users
        is_liked = (request.user.is_authenticated and
            likes.filter(id=request.user.id).count() == 1)

        return JsonResponse(data={'article': {
          'title': a.title,
          'author': a.author.first_name,
          'created_at': date2str(a.created_at),
          'last_edited_at': date2str(a.last_edited_at),
          'image_url': a.image_file.url,
          'content': a.content,
          'is_liked': is_liked,
          'like_count': likes.count(),
          'is_owner': (a.author.id == request.user.id)
        }})

    @method_decorator([force_login, prepare_put])
    def put(self, request, article_id=None): # pragma: no cover
        q = Article.objects.filter(id=article_id)
        if not q.count():
            return JsonResponse({'success': False, 'error': 'No such article'})
        a = q.get()
        if a.author != request.user:
            return JsonResponse({'success': False, 'error': 'Author mismatch'})

        try:
            title = request.PUT['title']
            content = request.PUT['content']
            uploaded_image = request.FILES['image']
            assert title and content
        except (KeyError, AssertionError):
            return JsonResponse({'success': False, 'error': 'Malformed request'})

        a.title = title
        a.content = content
        a.image_file.delete()
        a.image_file.save('article/attachment', uploaded_image)
        a.save()

        return JsonResponse({'success': True, 'id': a.id})

    @method_decorator(force_login)
    def delete(self, request, article_id=None):
        q = Article.objects.filter(id=article_id)
        if not q.count():
            return JsonResponse({'success': False, 'error': 'No such article'})
        a = q.get()

        if a.author != request.user:
            return JsonResponse({'success': False, 'error': 'Author mismatch'})

        a.image_file.delete()
        a.delete()
        return JsonResponse({'success': True})

class APIArticleLike(View):

    @method_decorator(force_login)
    def post(self, request, article_id=None):
        q = Article.objects.filter(id=article_id)
        if not q.count():
            return JsonResponse({'success': False, 'error': 'No such article'})
        a = q.get()

        likes = a.liked_users
        if likes.filter(id=request.user.id).count():
            return JsonResponse({'success': False, 'error': 'Cannot like twice'})
        likes.add(request.user.id)
        return JsonResponse({'success': True, 'like_count': likes.count()})

    @method_decorator(force_login)
    def delete(self, request, article_id=None):
        q = Article.objects.filter(id=article_id)
        if not q.count():
            return JsonResponse({'success': False, 'error': 'No such article'})
        a = q.get()

        likes = a.liked_users
        if not likes.filter(id=request.user.id).count():
            return JsonResponse({'success': False, 'error': 'Cannot undo non-liked articles'})
        likes.remove(request.user.id)
        return JsonResponse({'success': True, 'like_count': likes.count()})


class APIComment(View):
    def get(self, request, article_id=None):
        q = Article.objects.filter(id=article_id)
        if not q.count():
            return HttpResponseNotFound()
        a = q.get()
        cmts = a.comments.all()

        return JsonResponse(data={'comments': [{
          'id': c.id,
          'author': c.author.first_name,
          'created_at': date2str(c.created_at),
          'last_edited_at': date2str(c.last_edited_at),
          'content': a.content,
          'is_owner': (a.author.id == request.user.id)
        } for c in cmts]})
