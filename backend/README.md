# Backend API documentation

## Table of Contents
1. [Authentication](#authentication)
1. [Photo](#photo)
1. [Article](#article)
1. [Comment](#comment)
1. [Font](#font)



## Overview

| Model | API | GET | POST | PUT | DELETE |
|-------|-----|-----|------|-----|--------|
| | /api/token | Get a CSRF token | | | |
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

## Authentication
### `/api/token`
- **GET**
  - Input: None
  - Ouptut: HTTP `204` Response (automatically set CSRF token cookie)
### `/api/signup`
- **POST**
  - Input: JSON `{username: str, password: str, first_name: str}`
  - Output: HTTP `201` Response
### `/api/signin`
- **POST**
  - Input: None
  - Output: HTTP `` Response

### `/api/signout`
- login required

- **POST**
  - Input: None
  - Output: HTTP `` Response

## Photo
### `/api/photo`
- login required
- **GET**
  - Input: None
  - Output: HTTP `` Response

- **POST**
  - Input: None
  - Output: HTTP `` Response

### `/api/photo/:photo_id`
- login required
- **GET**
  - Input: None
  - Output: HTTP `` Response

- **PUT**
  - Input: None
  - Output: HTTP `` Response

- **DELETE**
  - Input: None
  - Output: HTTP `` Response

### `/api/photo/:photo_id/report`
- login required

## Article
### `/api/article`
- **GET**
  - Input: None
  - Output: HTTP `` Response

- **POST**
  - Input: None
  - Output: HTTP `` Response

### `/api/article/:article_id`
- **GET**
  - Input: None
  - Output: HTTP `` Response

- **PUT**
  - Input: None
  - Output: HTTP `` Response

- **DELETE**
  - Input: None
  - Output: HTTP `` Response

### `/api/article/:article_id/like`
- **GET**
  - Input: None
  - Output: HTTP `` Response

- **POST**
  - Input: None
  - Output: HTTP `` Response

- **DELETE**
  - Input: None
  - Output: HTTP `` Response

## Comment
### `/api/article/:article_id/comment`
- **GET**
  - Input: None
  - Output: HTTP `` Response

- **POST**
  - Input: None
  - Output: HTTP `` Response

### `/api/comment/:comment_id`
- **GET**
  - Input: None
  - Output: HTTP `` Response

- **PUT**
  - Input: None
  - Output: HTTP `` Response

- **DELETE**
  - Input: None
  - Output: HTTP `` Response

## Font
### `/font`
- **GET**
  - Input: None
  - Output: HTTP `` Response

### `/font/:font_id`
- **GET**
  - Input: None
  - Output: HTTP `` Response
