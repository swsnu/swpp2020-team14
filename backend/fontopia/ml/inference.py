import threading

import numpy as np
from PIL import Image

from fontopia import models
from fontopia.ml import config
from fontopia.ml.model import get_model
# Not sure if 2 or more models can run at the same time;
# besides, it would burden the server heavily.
# Thus we put a mut-ex lock here.
model_lock = threading.Semaphore(1)
my_model = None

def _ensure_load_model():
    global my_model
    if not my_model:
        my_model = get_model()

def _perform_inference_actual(img):
    def fix_height(img):
        w, h = img.size
        new_w = round(w * (config.SIZE / h))
        return img.resize((new_w, config.SIZE))

    def untransparent(img):
        if img.mode == 'RGBA':
            back = Image.new('RGBA', img.size, 'WHITE')
            back.paste(img, mask=img)
            ret = back
        else:
            ret = img
        return ret.convert('L')

    with model_lock:
        img = fix_height(img)
        img = untransparent(img)

        w, h = img.size
        arr = np.array(img, dtype=np.uint8).reshape((h, w))

        if w < h:
            pd = h - w
            pl, pr = ((pd // 2), (pd - pd // 2))
            arr = np.pad(arr, [(0, 0), (pl, pr)])
            w = h

        patch_range = w - h
        patch_bound_list = np.random.randint(0, 1+patch_range, size=1)

        for patch_bound in patch_bound_list:
# batch & channel indices
            patch = arr[None, :, patch_bound:patch_bound+h, None]
            patch = patch.astype(np.float32) / 255

        res = my_model.predict(patch)
    return res

def _put_inference_result(photo, probs):
    for i, label in enumerate(config.labels):
        fnt = models.Font.objects.filter(name=label)
        if not fnt.count():
            models.Font.objects.create(
                name=label,
                is_free=True,
                license_summary="Free",
                license_detail={"content": ""},
                manufacturer="(unknown)",
                view_count=0
            )
            print(f'WARNING: Font {label} missing, forcing creation')
            fnt = models.Font.objects.filter(name=label)
        fnt = fnt.get()
        prob = probs[i]
        models.Finding.objects.filter(photo=photo, font=fnt).delete()
        models.Finding.objects.create(
            photo=photo,
            font=fnt,
            probability=prob)

def _perform_inference_and_put(photo):
    probs = _perform_inference_actual(Image.open(photo.image_file))
    _put_inference_result(photo, probs)

def perform_inference(photo, immediate=False):
    _ensure_load_model()
    if immediate:
        result = _perform_inference_actual(Image.open(photo))
        return result
    t = threading.Thread(target=_perform_inference_and_put, args=(photo,))
    t.start()
