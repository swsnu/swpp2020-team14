from datetime import datetime

from django.test import TestCase
from django.contrib.auth import get_user_model

from fontopia.models import Article

User = get_user_model()

class ArticleTestCase(TestCase):
    def setUp(self):
        self.users = []
        for i in range(3):
            usr = User.objects.create_user(
                username=f"u{i:02}", password="testpw")
            self.users.append(usr)

        self.articles = []
        sometime = datetime(2020, 2, 20)
        for i in range(3):
            art = Article.objects.create(
                author=self.users[i], title=f"t{i:02}", content=f"c{i:02}",
                view_count=0, created_at=sometime, last_edited_at=sometime)
            self.articles.append(art)

    def test_article_list(self):
        cli = self.client
        resp = cli.get('/api/article')
        self.assertEqual(resp.status_code, 200)
