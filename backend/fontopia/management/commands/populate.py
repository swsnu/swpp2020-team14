from datetime import datetime, timedelta, timezone
import os.path

from django.core.management.base import BaseCommand
from django.core.files.images import get_image_dimensions
from django.contrib.auth import get_user_model

from fontopia.models import Article, Font, Photo
from fontopia.ml import inference

User = get_user_model()

BASE_DIR = 'fontopia/management/commands/populate-data'

class Command(BaseCommand):
    help = 'Populate the DB with placeholder values.'

    def handle(self, *args, **options):
        if User.objects.all().count():
            purge = input("There are existing users.\nRemove everything in DB and continue? [yes/no] ")
            if purge != "yes":
                print('Aborting.')
                return
            print('Removing all users.')
            User.objects.all().delete()
            Font.objects.all().delete()

        users = [
            User.objects.create_user(
                username=f"{username}@fontopia.com",
                email=f"{username}@fontopia.com",
                password=f"{username}",
                first_name=f"{nickname}"
            ) for username, nickname in [
                ("alice", "Alice"),
                ("amy", "Amy"),
                ("anya", "Anastasia"),
                ("alan", "Alan"),
                ("andy", "Andrew"),
                ("aure", "Aurelius Augustinus Hipponensis"),
            ]
        ]

        print(f'Created {len(users)} users.')

        now = datetime.now(timezone.utc)
        def write_article(fn, content, ui):
            time = now + timedelta(days=ui)
            art = Article.objects.create(title=fn[0].upper() + fn[1:],
                content=content, author=users[ui],
                created_at=time, last_edited_at=time, view_count=0)
            art.image_file.save('article/attachment',
                open(f'{BASE_DIR}/{fn}.jpg', 'rb'))

        write_article('copper', 'Careful for the waves!', 0)
        write_article('sudoku', 'The numbers look cramped, don\'t they?', 1)
        write_article('palm', 'A nice inspiration for new designs', 2)
        write_article('snack', 'I love this package design (and its contents)', 3)
        write_article('mug', 'The syrup really does its job.\nRemember, colors in designs!', 4)
        print('Created 5 articles.')

        font_names = open('fontopia/ml/label.txt', encoding='utf-8').read().strip().split('\n')
        Font.objects.bulk_create([
            Font(name=name, is_free=False, license_summary="Non-free (unknown)",
                license_detail={"content": ""}, manufacturer="(unknown)", view_count=0)
            for name in font_names
        ])

        print(f'Created {len(font_names)} fonts.')

        for i in range(9):
            fobj = open(f'{BASE_DIR}/test{i+1:02}.jpg', 'rb')
            ui = i % len(users)
            width, height = get_image_dimensions(fobj)
            photo = Photo.objects.create(
                author=users[ui],
                memo=f"Generated from test{i+1:02}.png",
                is_analyzed=False,
                analyzed_at=now,
                width=width,
                height=height,
                metadata={'': ''},
                selected_font=None
            )
            photo.image_file.save('photo', fobj)
            inference.perform_inference(photo)

        print('Created 9 photos.')