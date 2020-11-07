"""
Test cases for fontopia app
"""

from django.test import TestCase
from .models import FontopiaUser #, Font, Photo, Finding, Article, Comment

# Create your tests here.
class FontopiaTestCase(TestCase):
    """
    TestCase class for fontopia app
    """
    def setUp(self):
        pass

    def test_signup(self):
        """
        test case for signup
        """
        FontopiaUser.objects.create_user(
            username="hello", password="passworld", nickname="Nick")
        self.assertEqual(FontopiaUser.objects.get(username="hello").password, 'passworld')
