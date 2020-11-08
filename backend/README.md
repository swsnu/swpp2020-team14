# Django Backend API documentation

## Overview

| Model | API | GET | POST | PUT | DELETE |
|-------|-----|-----|------|-----|--------|
| User | /api/signup | | Create new user | | |
| | /api/signin | | sign in | | |
| | /api/signout | | sign out | | |
| Photo	| /api/photo | View all photos | Upload new photo | | |
| | /api/photo/:photo_id | View a photo specified | | check corresponding font among results | Delete a photo specified |
| Finding | /api/photo/:photo_id/report | Query a ML inference report | | |
| Article | /api/article | View all articles | Create an article | | |
| | /api/article/:article_id | view an article specified | | edit an article specified | delete an article specfied |
| | /api/article/:article_id/like | view number of 'like's | like a article | | undo like the article |
| Comment | /api/article/:article_id/comment | view all comments of the article specified | Create a new comment | | |
| | /api/comment/:comment_id | view a comment specified | | edit a comment specified | delete a comment specified |
| Font | /api/font | view all fonts	| | | |
| | /api/font/:font_id | view detailed font info | | | |


## Authentiation
### `/api/token`
**GET**
- Input: None
- Ouptut: HTTP `204` Response (automatically set CSRF token cookie)
### `/api/signup`
**GET**
- Input: JSON `{username: str, password: str, first_name: str}`
- Output: HTTP `201` Response
### `/api/signin`

### `/api/signout`
- login required

## Photo
### `/api/photo`
- login required
### `/api/photo/:photo_id`
- login required
### `/api/photo/:photo_id/report`
- login required
## Article
### `/api/article`
### `/api/article/:article_id`
### `/api/article/:article_id/like`
## Comment
### `/api/article/comment/:comment_id`
## Font
### `/font`
### `/font/:font_id`