from django.views import View
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.core.paginator import Paginator
from django.db import models

from fontopia.models import Article
from fontopia.utils import date2str

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

    def post(self, request):
        raise NotImplementedError

class APIArticleItem(View):
    def get(self, request, article_id=None):
        q = Article.objects.filter(id=article_id)

        if not len(q):
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

class APIComment(View):
    def get(self, request, article_id=None):
        q = Article.objects.filter(id=article_id)

        if not len(q):
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

