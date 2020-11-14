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

from fontopia.models import Photo, Font, Finding
from fontopia.tests import util
from fontopia import views

TMPDIR = tempfile.mkdtemp(prefix='django-test-')
@atexit.register
def check_tmpdir():
    shutil.rmtree(TMPDIR)

User = get_user_model()

@override_settings(MEDIA_ROOT=TMPDIR)
class PhotoBaseCase(TestCase):
    def setUp(self):
        super(PhotoBaseCase, self).setUp()
        self.users = util.fill_users()
        self.fonts = util.fill_fonts()
        self.me = self.users[0]

        self.photos = []

        sometime = datetime(2020, 2, 20,
            tzinfo=timezone.utc)
        test_image = ContentFile(
            open('fontopia/tests/test.png', 'rb').read())

        for i in range(3):
            photo = Photo.objects.create(
                author=self.users[i], width=3, height=4,
                is_analyzed=False, analyzed_at=sometime,
                selected_font=self.fonts[i],
                image_file=test_image,
                memo="",
                metadata={"meta": "hi"})
            photo.image_file.save('test', test_image)
            self.photos.append(photo)

        self.client.get('/api/token')
        self.factory = RequestFactory()

    def tearDown(self):
        Font.objects.all().delete()
        User.objects.all().delete()
        for photo in self.photos:
            photo.image_file.delete()
            photo.delete()
        super(PhotoBaseCase, self).tearDown()

class PhotoUnauthorizedCase(PhotoBaseCase):
    def test_get_my_photo(self):
        cli = self.client

        resp = cli.get('/api/my-page/photo')
        self.assertEqual(resp.status_code, 403)

class PhotoAuthorizedCase(PhotoBaseCase):
    def setUp(self):
        super(PhotoAuthorizedCase, self).setUp()
        self.client.force_login(self.users[0])

    def test_my_photo_list(self):
        cli = self.client
        resp = cli.get('/api/my-page/photo')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('photos', resp)

    def test_photo_get(self):
        cli = self.client

        resp = cli.get(f'/api/photo/524288')
        self.assertEqual(resp.status_code, 404)

        photo = self.photos[0]
        resp = cli.get(f'/api/photo/{photo.id}')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('photo', resp)

    def test_photo_post(self):
        cli = self.client

        test_imgfile = open('fontopia/tests/test.png', 'rb')

        payload = {
            'memo': 'test memo',
        }
        resp = cli.post('/api/photo', payload)
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(resp['success'], False)

        payload['image'] = test_imgfile

        resp = cli.post('/api/photo', payload)
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(resp['success'], True)

    def test_photo_delete(self):
        cli = self.client

        resp = cli.delete(f'/api/photo/524288')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('success', resp)
        self.assertEqual(resp['success'], False)

        photo = self.photos[0]
        resp = cli.delete(f'/api/photo/{photo.id}')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('success', resp)
        self.assertEqual(resp['success'], True)

        # try to delete anothor user's photo
        photo = self.photos[1]
        resp = cli.delete(f'/api/photo/{photo.id}')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('success', resp)
        self.assertEqual(resp['success'], False)


class PhotoFindingCase(PhotoBaseCase):
    def setUp(self):
        super(PhotoFindingCase, self).setUp()
        self.findings = []
        for i in range(3):
            finding = Finding.objects.create(
                photo=self.photos[0],
                font=self.fonts[i],
                probability=0.1*i)
            self.findings.append(finding)
        self.client.force_login(self.users[0])

    def test_findings(self):
        cli = self.client

        photo = self.photos[0]
        resp = cli.get(f'/api/photo/{photo.id}/report')
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertEqual(len(resp['findings']), 3)
