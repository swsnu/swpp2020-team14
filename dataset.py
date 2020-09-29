import os
import random
import concurrent.futures
from concurrent.futures import ThreadPoolExecutor

from PIL import Image, ImageDraw, ImageFont
import numpy as np
import matplotlib.pyplot as plt

from config import *
import texts

def _draw_text(font, word):
    '''
    Internal function used by `create_single_image()`.
    Draw `word` with `font` and return the image.

    Args:
        font (PIL.ImageFont): font object to draw with.
        word (str): a string.
    Returns:
        image (PIL.Image): image in black-and-white mode, arbitrary size;
                           but always W >= H, i.e. wider than narrower
    '''

    w, h = font.getsize(word)
    assert w > 0 and h > 0
    w = max(w, h) # for easier cut
    w += 2*IMG_PAD
    h += 2*IMG_PAD
    img = Image.new('L', (w, h), (255,))
    draw = ImageDraw.Draw(img)
    draw.text((IMG_PAD,)*2, word, font=font, fill=(0,))

    return img

def _pick_random_region(w, h):
    '''
    Internal function used by `create_single_image()`.

    Args:
        w, h (int): image size.
    Returns:
        points (list): list of 4 points as [(x0, y0), ..., (x3, y3)],
                       in column(=x)-first order,
                       all within [0, w) x [0, h).
    '''

    # Pick a random region that is *almost* square;
    # i.e. aspect ratio resides in (*IMG_ASPECT_RANGE).
    crop_h = h
    crop_w = round(h * random.uniform(*IMG_ASPECT_RANGE))
    crop_w = min(crop_w, w)

    #   * -- d -- *
    # L |         | R
    #   * -- u -- *

    l = random.randrange(w - crop_w) if crop_w < w else 0
    r = l + crop_w - 1
    d = 0
    u = crop_h - 1

    # Now, we distort four points a little,
    # to give a nice skew effect
    points = []
    Df = lambda: random.randint(
        -IMG_CORNER_WIGGLE,
        +IMG_CORNER_WIGGLE)

    for x, y in [(l, d), (l, u), (r, d), (r, u)]:
        x += Df()
        x = max(0, min(w-1, x))

        y += Df()
        y = max(0, min(h-1, y))

        points.append((x, y))

    # Sanity check, so that image does not skew
    assert (
        points[0][1] < points[1][1] and
        points[2][1] < points[3][1] and
        points[0][0] < points[2][0] and
        points[1][0] < points[3][0]
    )

    return points

def _to_persp_coeff(region):
    '''
    Return coefficient for perspective rotation.
    Returns 8-tuple (a, b, ..., g, h), such that the
      destination (x, y) is sampled from
      source ((ax+by+c)/(gx+hy+1),
              (dx+ey+f)/(gx+hy+1)).
    Reference: http://effbot.org/imagingbook/image.htm#image-transform-method

    Args:
        region (list of (x_i, y_i)): source region.
    Returns:
        ret (a, b, ..., g, h): 8-tuple of `float`.
    '''

    dest = [(0, 0), (0, IMG_SIZE-1),
        (IMG_SIZE-1, 0), (IMG_SIZE-1, IMG_SIZE-1)]

    matrix = []
    for p1, p2 in zip(region, dest):
        matrix.append([p2[0], p2[1], 1, 0, 0, 0, -p1[0]*p2[0], -p1[0]*p2[1]])
        matrix.append([0, 0, 0, p2[0], p2[1], 1, -p1[1]*p2[0], -p1[1]*p2[1]])

    A = np.matrix(matrix, dtype=np.float32)
    B = np.array(region).reshape(-1)

    res = np.dot(np.linalg.inv(A.T * A) * A.T, B)
    return tuple(np.array(res).reshape(8))

def create_single_image(font, word=None):
    '''
    Return an image suitable for training.

    Args:
        font (PIL.ImageFont): font object to draw with.
        word (str, optional): a string. If omitted, picked randomly from corpus.
    Returns:
        img_cut (PIL.Image): image in black-and-white mode and
                           (IMG_SIZE, IMG_SIZE) shape.
    '''

    if word is None: word = random.choice(texts.corpus)

    img = _draw_text(font, word)

    region = _pick_random_region(*img.size)

    coeff = _to_persp_coeff(region)

    img_cut = img.transform((IMG_SIZE, IMG_SIZE),
        method=Image.PERSPECTIVE, data=coeff)

    return img_cut

def get_font_object(font_itm):
    '''
    Return ImageFont object from a random TTF file.

    Args:
        (name, [ttf_files...]): a tuple.
    Returns:
        font (PIL.ImageFont object): font object.
    '''

    f = os.path.join(FONT_DIR, font_itm[0], random.choice(font_itm[1]))

    # Although we use `IMG_SIZE` as `size` in the code below,
    #   it does not necessarily map to actual size in pixels.
    # In fact, actual size in pixels vary from word to word
    #   within the same font!
    # `IMG_SIZE` below is just a number that *seems large enough*.
    # For example, images rendered in 12pts and scaled into 128px
    #   might not look so good; thus 12 is too small.

    font = ImageFont.truetype(f, IMG_SIZE)

    return font

def _fill_images(dest, font_itm):
    fobj = get_font_object(font_itm)
    for i in range(dest.shape[0]):
        img = create_single_image(fobj)
        tmp = np.asarray(img, dtype=np.float32) / 255
        tmp = (tmp - tmp.mean())
        dest[i] = tmp[..., np.newaxis]

def generate_dataset(cnt=None):
    '''
    Return a set of images suitable for training or validation.
    Classes are evenly picked and shuffled.
    Uses multi-threading.

    Args:
        cnt (int, optional): number of total images. If omitted, the value in `config.py` is used.
    Returns:
        arr (numpy.ndarray in float32): images in
            (cnt, IMG_SIZE, IMG_SIZE, 1)
        label (list of int): answers.
    '''

    if cnt is None: cnt = DATASET_DEFAULT_SIZE
    assert cnt > 0

    n = len(texts.fonts)
    cnt_per_font = [cnt//n+1]*(cnt%n) + [cnt//n]*(n-cnt%n)
    answers = []

    ret = np.ndarray(shape=(cnt, IMG_SIZE, IMG_SIZE, 1),
        dtype=np.float32)

    with ThreadPoolExecutor(max_workers=8) as ex:
        sm = 0
        jobs = []
        for i, f, c in zip(range(len(texts.fonts)), texts.fonts, cnt_per_font):
            jobs.append(ex.submit(
                _fill_images, ret[sm:sm+c], f))
            sm += c
            answers += [i] * c
        concurrent.futures.wait(jobs)
        for j in jobs:
            if j.exception():
                raise(j.exception())

    indices = np.random.permutation(cnt)
    return (
        ret[indices],
        np.array(answers)[indices]
    )
