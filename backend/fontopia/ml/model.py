import os.path

import numpy as np
import torch
from torch.nn import Module, Conv2d, ConvTranspose2d, MaxPool2d, AvgPool2d, \
    Linear, Dropout, BatchNorm1d, BatchNorm2d, Sequential, Flatten, ReLU
def get_model():
    class CatLayer(Module):
        def __init__(self, *args):
            super().__init__()
            self._my_layers = args
            for i, l in enumerate(args):
                self.add_module(f'cat{i}', l)
        def forward(self, x):
            ys = [l(x) for l in self._my_layers]
            y = torch.cat(ys, dim=1)
            return y
    def Conv2dA(*args, **kwargs):
        return Sequential(Conv2d(*args, **kwargs), BatchNorm2d(args[1]), ReLU())
    MyInceptionA = lambda n: CatLayer(
        Conv2dA(n, 64, 1),
        Sequential(Conv2dA(n, 64, 1), Conv2dA(64, 64, 3, padding=1)),
        Sequential(Conv2dA(n, 64, 1), Conv2dA(64, 64, 3, padding=1), Conv2dA(64, 64, 3, padding=1)),
        Sequential(AvgPool2d(3, stride=1, padding=1), Conv2dA(n, 64, 1))
    )
    MyReductionA = lambda n: CatLayer(
        Conv2dA(n, 256, 3, stride=2),
        MaxPool2d(3, stride=2),
        Sequential(Conv2dA(n, 192, 1), Conv2dA(192, 192, 3, padding=1), Conv2dA(192, 256, 3, stride=2))
    )
    MyInceptionB = lambda n: CatLayer(
        Conv2dA(n, 256, 1),
        Sequential(Conv2dA(n, 192, 1),
                Conv2dA(192, 192, (1, 3), padding=(0, 1)),
                Conv2dA(192, 192, (3, 1), padding=(1, 0))),
        Sequential(Conv2dA(n, 128, 1),
                Conv2dA(128, 128, (1, 3), padding=(0, 1)),
                Conv2dA(128, 192, (3, 1), padding=(1, 0)),
                Conv2dA(192, 192, (1, 3), padding=(0, 1)),
                Conv2dA(192, 192, (3, 1), padding=(1, 0))),
        Sequential(AvgPool2d(3, stride=1, padding=1), Conv2dA(n, 128, 1))
    )
    class MyIndependentModel(Module):
        def __init__(self):
            super().__init__()
            self.encoder = Sequential( # 128.1
                Conv2dA(1, 16, 3, stride=2, padding=1), # 63.16
                Conv2dA(16, 16, 3), # 61.16
                Conv2dA(16, 32, 3), # 59.32
                CatLayer(Conv2dA(32, 64, 3, stride=2), MaxPool2d(3, stride=2)), # 29.96
                CatLayer(
                    Sequential(Conv2dA(96, 64, 1), Conv2dA(64, 64, 3)),
                    Sequential(Conv2dA(96, 64, 1), Conv2dA(64, 64, (5, 1), padding=(2, 0)),
                            Conv2dA(64, 64, (1, 5), padding=(0, 2)), Conv2dA(64, 64, 3))
                ), # 27.128
                CatLayer(Conv2dA(128, 128, 3, stride=2), MaxPool2d(3, stride=2)), # 13.256
                MyInceptionA(256), # 13.256
                MyReductionA(256), # 6.768
                MyInceptionB(768), # 6.768
                AvgPool2d(6), # 1.768
                Flatten())
            self.classifier = Sequential(
                Dropout(0.3),
                Linear(768, 611),
            )
        def forward(self, x):
            if isinstance(x, np.ndarray):
                x = torch.from_numpy(x).to('cpu')
            x = self.encoder(x)
            x = self.classifier(x)
            x = torch.nn.functional.softmax(x, dim=1)
            return x
    with torch.no_grad():
        model = MyIndependentModel().eval()
        model.load_state_dict(torch.load(
            os.path.join('fontopia', 'ml', 'model.zip'),
            map_location=torch.device('cpu')))
    return model