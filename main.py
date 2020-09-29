import dataset
from model import get_model
from config import *

def main():
    model = get_model()
    model.compile(optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy'])
    
    for epoch_id in range(EPOCHS):
        img, lbl = dataset.generate_dataset()
        model.fit(img, lbl, epochs=1)

    model.save('trained_model')

if __name__ == '__main__':
    main()
