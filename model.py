import tensorflow as tf
from tensorflow.keras import Input, Model
from tensorflow.keras.layers import \
    Conv2D, MaxPool2D, BatchNormalization, Dense, Flatten

from config import *
from texts import fonts

def get_model():
    inputs = Input(shape=(IMG_SIZE, IMG_SIZE, 1))

    x = inputs

    # x: 128x128x1
    x = Conv2D(32, 5, activation='relu')(x)
    # x: 124x124x32
    x = MaxPool2D()(x)
    # x: 62x62x32
    x = BatchNormalization()(x)

    x = Conv2D(64, 3, activation='relu')(x)
    # x: 60x60x64
    x = MaxPool2D()(x)
    # x: 30x30x64
    x = BatchNormalization()(x)

    x = Conv2D(64, 3, activation='relu')(x)
    # x: 28x28x64
    x = MaxPool2D()(x)
    # x: 14x14x64
    x = BatchNormalization()(x)

    x = Conv2D(128, 3, activation='relu')(x)
    # x: 12x12x128
    x = MaxPool2D()(x)
    # x: 6x6x128
    x = BatchNormalization()(x)

    x = Flatten()(x)

    x = Dense(200)(x)
    x = BatchNormalization()(x)

    x = Dense(200)(x)
    x = BatchNormalization()(x)

    output = Dense(len(fonts), activation='softmax')(x)

    model = Model(inputs, output)
    return model
