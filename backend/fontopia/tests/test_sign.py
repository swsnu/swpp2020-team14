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

from fontopia.models import Photo, Font
from fontopia.tests import util
from fontopia import views

User = get_user_model()

class UserCase(TestCase):
    def setUp(self):
        super(UserCase, self).setUp()
        self.users = util.fill_users()
        self.client.get('/api/token')
        self.factory = RequestFactory()

    def tearDown(self):
        User.objects.all().delete()
        super(UserCase, self).tearDown()

    def test_signup(self):
        cli = self.client
        cred = { "nickname": "god",
            "email": "god@example.com" } # god has no password
        resp = cli.post('/api/signup', cred,
            content_type='application/json')
        self.assertEqual(resp.status_code, 400)

        cred['password'] = 'oh i need one'
        resp = cli.post('/api/signup', cred,
            content_type='application/json')
        self.assertEqual(resp.status_code, 200)

    def test_signout(self):
        cli = self.client
        cli.force_login(self.users[0])
        resp = cli.post('/api/signout')
        self.assertEqual(resp.status_code, 204)

    def test_signin(self):
        cli = self.client
        cred = {"email": "u00@example.com", "password": "testpw"}

        cred_wrong = cred.copy()
        cred_wrong.pop('email')
        resp = cli.post('/api/signin', data=cred_wrong,
            content_type="application/json")
        self.assertEqual(resp.status_code, 400)

        cred_wrong = cred.copy()
        cred_wrong['email'] = 'nonexis@tent.com'
        resp = cli.post('/api/signin', data=cred_wrong,
            content_type="application/json")
        self.assertEqual(resp.status_code, 404)

        cred_wrong = cred.copy()
        cred_wrong['password'] = 'wrong'
        resp = cli.post('/api/signin', data=cred_wrong,
            content_type="application/json")
        self.assertEqual(resp.status_code, 401)

        resp = cli.post('/api/signin', data=cred,
            content_type="application/json")
        self.assertEqual(resp.status_code, 200)
        resp = resp.json()
        self.assertIn('email', resp)
        self.assertIn('nickname', resp)
