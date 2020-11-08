# Django Backend API documentation
# Authentiation
## `/api/token`
### GET
- Input: None
- Ouptut: HTTP `204` Response (automatically set CSRF token cookie)
## `/api/signup`
### POST
- input: JSON `{username: str, password: str, first_name: str}`
- Output: HTTP `201` Response
## `/api/signout`
- login required
### POST

# Photo
## `/api/photo`
- login required
## `/api/photo/:photo_id`
- login required
## `/api/photo/:photo_id/report`
- login required
# Article
## `/api/article`
## `/api/article/:article_id`
## `/api/article/:article_id/like`
# Comment
## `/api/article/comment/:comment_id`
# Font
## `/font`
## `/font/:font_id`