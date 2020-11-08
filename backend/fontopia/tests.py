"""
Test cases for fontopia app
"""
import json

from django.test import TestCase, Client
from django.contrib.auth import get_user_model
#, Font, Photo, Finding, Article, Comment


def get_client():
    """
    Create a Client instance
    """
    return Client(enforce_csrf_checks=True)

def get_csrftoken(client):
    """
    Get csrf token from cookie
    """
    response = client.get('/api/token')
    csrftoken = response.cookies['csrftoken'].value
    return csrftoken


# Create your tests here.
class FontopiaTestCase(TestCase):
    """
    TestCase class for fontopia app
    """
    def setUp(self):
        """
        run before each case
        """
        pass

    def test_csrf(self):
        """
        test csrf security
        """
        client = get_client()
        response = client.post('/api/signup',
            json.dumps(dict(username='hello', password='world', first_name='Nick')),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)

        csrftoken = get_csrftoken(client)
        response = client.post('/api/signup',
            json.dumps(dict(username='hello', password='world', first_name='Nick')),
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 201)

    def test_signup(self):
        """
        test case for signup
        """
        get_user_model().objects.create_user(
            username="hello", password="world", first_name="Nick")
        self.assertEqual(get_user_model().objects.get(username="hello").first_name, 'Nick')
