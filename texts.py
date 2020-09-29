import os

from config import *

def _load_fonts():
    names = os.listdir(FONT_DIR)
    return [(x, os.listdir(os.path.join(FONT_DIR, x))) for x in names]

def _load_corpus():
    f = open(CORPUS_FILE, 'r', encoding='utf-8')
    return f.read().split()

fonts = _load_fonts()
corpus = _load_corpus()

