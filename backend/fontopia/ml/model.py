import os.path
def get_model():
    import tensorflow as tf
    return tf.keras.models.load_model(os.path.join(
        'fontopia', 'ml', 'trained_model'))
