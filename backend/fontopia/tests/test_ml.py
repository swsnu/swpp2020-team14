import atexit
from datetime import datetime, timezone
import os, shutil
import tempfile
import json
from unittest.mock import Mock

from django.test import TestCase, RequestFactory, override_settings
from django.test.client import encode_multipart, MULTIPART_CONTENT
from django.core.files.base import ContentFile
from django.conf import settings
from django.contrib.auth import get_user_model

from fontopia.models import Photo, Font, Finding
from fontopia.tests import util
from fontopia import views
from fontopia import ml

TMPDIR = tempfile.mkdtemp(prefix='django-test-ml-')
@atexit.register
def check_tmpdir():
    shutil.rmtree(TMPDIR)

User = get_user_model()

@override_settings(MEDIA_ROOT=TMPDIR)
class MlCase(TestCase):
    def test_immed_inference(self):
        test_image_file = open('fontopia/tests/test.png', 'rb')
        res = ml.inference.perform_inference(test_image_file, immediate=True)

        self.assertEqual(res.shape, (ml.config.C,))
