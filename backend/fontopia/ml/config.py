import os.path

labels = open(os.path.join('fontopia', 'ml', 'label.txt'),
    'r', encoding='utf-8').read().strip().split("\n")
C = len(labels)

SIZE = 128
