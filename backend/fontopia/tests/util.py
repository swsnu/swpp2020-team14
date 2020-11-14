from django.contrib.auth import get_user_model

from fontopia.models import Font

User = get_user_model()

def fill_users():
    users = []
    for i in range(3):
        name = f"u{i:02}"
        usr = User.objects.create_user(
            username=name,
            first_name=name,
            email=f"{name}@example.com",
            password="testpw")
        users.append(usr)
    return users

def fill_fonts():
    fonts = []
    for i in range(3):
        font = Font.objects.create(
            name= f"font{i:02}",
            is_free=(i%2 == 0),
            license_summary="good",
            license_detail={"detail": "hi"},
            manufacturer="us",
            view_count=i*2)
        fonts.append(font)
    return fonts
