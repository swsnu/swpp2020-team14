import atexit
from datetime import datetime, timezone
import os, shutil
import tempfile
import json

from django.test import TestCase, RequestFactory, override_settings
from django.test.client import encode_multipart, MULTIPART_CONTENT
from django.core.files.base import ContentFile
from django.conf import settings
from django.contrib.auth import get_user_model

from fontopia.models import Article
from fontopia.tests import util
from fontopia import views

TMPDIR = tempfile.mkdtemp(prefix='django-test-')
@atexit.register
def check_tmpdir():
    shutil.rmtree(TMPDIR)

User = get_user_model()

@override_settings(MEDIA_ROOT=TMPDIR)
class ArticleBaseCase(TestCase):
    def setUp(self):
        super(ArticleBaseCase, self).setUp()
        self.users = util.fill_users()

        self.articles = []

        sometime = datetime(2020, 2, 20,
            tzinfo=timezone.utc)
        test_image = ContentFile(
            open('fontopia/tests/test.png', 'rb').read())

        for i in range(3):
            art = Article.objects.create(
                author=self.users[i], title=f"t{i:02}", content=f"c{i:02}",
                view_count=0, created_at=sometime, last_edited_at=sometime)
            art.image_file.save('test', test_image)
            self.articles.append(art)

        self.client.get('/api/token')
        self.factory = RequestFactory()

    def tearDown(self):
        User.objects.all().delete()
        for art in self.articles:
            art.image_file.delete()
            art.delete()
        super(ArticleBaseCase, self).tearDown()

class ArticleUnauthorizedCase(ArticleBaseCase):
    def test_article_list(self):
        cli = self.client
        resp = cli.get('/api/article')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()

    def test_article_item(self):
        cli = self.client
        art = self.articles[0]

        resp = cli.get(f'/api/article/524288')
        self.assertEqual(resp.status_code, 404)

        resp = cli.get(f'/api/article/{art.id}')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('article', resp)

    def test_comment_list(self):
        cli = self.client
        art = self.articles[0]

        resp = cli.get(f'/api/article/524288/comment')
        self.assertEqual(resp.status_code, 404)

        resp = cli.get(f'/api/article/{art.id}/comment')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('comments', resp)

        


class ArticleAuthorizedCase(ArticleBaseCase):
    def setUp(self):
        super(ArticleAuthorizedCase, self).setUp()
        self.client.force_login(self.users[0])
        self.me = self.users[0]

    def test_get_my_article(self):
        cli = self.client

        resp = cli.get('/api/my-page/article')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('list', resp)

    def test_post_article(self):
        cli = self.client

        test_imgfile = open('fontopia/tests/test.png', 'rb')
        payload = {
            'title': 'test title',
            'content': 'cont',
            'image': test_imgfile
        }

        resp = cli.post('/api/article', payload)
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(resp['success'], True)

        # malformed request
        resp = cli.post('/api/article', {})
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(resp['success'], False)


    def test_delete_article(self):
        cli = self.client

        resp = cli.delete(f'/api/article/524288')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(resp['success'], False)

        art = self.articles[0]
        resp = cli.delete(f'/api/article/{art.id}')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(resp['success'], True)

        # try to delete another user's article
        art = self.articles[1]
        resp = cli.delete(f'/api/article/{art.id}')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(resp['success'], False)


    def test_like_article(self):
        cli = self.client

        art = self.articles[0]
        resp = cli.post(f'/api/article/{art.id}/like')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()

        self.assertIn('success', resp)
        self.assertEqual(resp['success'], True)
        self.assertIn('like_count', resp)
        self.assertIs(type(resp['like_count']), int)

        # try to like twice
        resp = cli.post(f'/api/article/{art.id}/like')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(resp['success'], False)

        resp = cli.delete(f'/api/article/{art.id}/like')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()

        self.assertIn('success', resp)
        self.assertEqual(resp['success'], True)
        self.assertIn('like_count', resp)
        self.assertIs(type(resp['like_count']), int)

        resp = cli.delete(f'/api/article/{art.id}/like')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()

        self.assertIn('success', resp)
        self.assertEqual(resp['success'], False)
        self.assertIn('error', resp)

        # try to like non-existing article
        resp = cli.post(f'/api/article/{404}/like')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(resp['success'], False)

        # try to delete like on non-existing article
        resp = cli.delete(f'/api/article/{404}/like')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(resp['success'], False)


        
        payload = {
            'article': art.id,
        }
        resp = cli.post(f'/api/comment', payload)
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('success', resp)

        payload = {
            'article': art.id,
            'content': 'hello'
        }
        resp = cli.post(f'/api/comment', payload)
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('success', resp)


        resp = cli.delete(f'/api/comment/{resp["id"]}')
        self.assertEqual(resp.status_code, 200)

