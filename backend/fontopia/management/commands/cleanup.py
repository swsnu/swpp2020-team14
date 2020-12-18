from datetime import datetime, timedelta, timezone
import os.path

from django.core.management.base import BaseCommand
from django.conf import settings

from fontopia import models

class Command(BaseCommand): # pragma: no cover
    help = 'Cleanup anonymous requests'

    def add_arguments(self, parser):
        parser.add_argument('-a', '--all', action="store_true",
            help="List all uploaded files and remove unnecesary (might take long)")
        parser.add_argument('-n', '--dry-run', action="store_true",
            help="Do not actually remove files (just show the list)")

    def _clean_all_files(self, is_dry_run):
        files_list = sum(([os.path.join(dirpath, fname) for fname in filenames] for \
            dirpath, dirnames, filenames in os.walk(settings.MEDIA_ROOT)), [])

        valid_photo = models.Photo.objects.values_list('image_file').all()
        valid_art = models.Article.objects.values_list('image_file').all()

        valid_list = [os.path.join(settings.MEDIA_ROOT, fname) for \
            (fname,) in list(valid_photo) + list(valid_art)]
        
        to_prune = set(files_list) - set(valid_list)
        cnt = 0
        for filename in to_prune:
            print(f'Removing file: {filename}')
            if not is_dry_run:
                os.remove(filename)
            cnt += 1
        print()
        print(f'Removed {cnt} stale files.')

    def _clean_from_db(self, is_dry_run):
        photo_cnt = 0
        file_cnt = 0
        q = models.Photo.objects.filter(author=None, is_analyzed=True)
        q = q.only('id', 'image_file')
        for photo in q.all():
            fn = photo.image_file
            file_path = os.path.join(settings.MEDIA_ROOT, fn.path)
            if os.path.isfile(file_path):
                print(f'Removing file: {file_path}')
                if not is_dry_run:
                    os.remove(file_path)
                file_cnt += 1
            else:
                print(f'Warning: nonexistent file: {file_path}')
            if not is_dry_run:
                photo.delete()
            photo_cnt += 1
        print()
        print(f'Removed {photo_cnt} photos and {file_cnt} files.')

    def handle(self, *args, **kwargs):
        is_dry_run = kwargs['dry_run']
        if kwargs['all']:
            self._clean_all_files(is_dry_run)
            return
        self._clean_from_db(is_dry_run)