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

from fontopia.models import Font
from fontopia.tests import util
from fontopia import views

User = get_user_model()

class FontCase(TestCase):
    def setUp(self):
        super(FontCase, self).setUp()
        self.users = util.fill_users()
        self.fonts = util.fill_fonts()

        self.client.get('/api/token')
        self.factory = RequestFactory()

    def tearDown(self):
        Font.objects.all().delete()
        User.objects.all().delete()
        super(FontCase, self).tearDown()

    def test_font_list(self):
        cli = self.client
        resp = cli.get('/api/font')
        resp = resp.json()
        self.assertIn('list', resp)
        self.assertIn('pages', resp)
        self.assertIn('cur', resp)

    def test_font_item(self):
        cli = self.client

        resp = cli.get(f'/api/font/524288')
        self.assertEqual(resp.status_code, 404)

        font = self.fonts[0]
        resp = cli.get(f'/api/font/{font.id}')
        resp = resp.json()
        self.assertIn('id', resp)
        self.assertIn('name', resp)
        self.assertIn('manufacturer_name', resp)
        self.assertIn('license', resp)
        self.assertIn('view_count', resp)

