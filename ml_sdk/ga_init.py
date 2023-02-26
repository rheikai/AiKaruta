import json

import random


# genes = []

# for i in range(50):
#     genes.append([random.random() * 100 for _ in range(3600)])

# json.dump(genes, open("genes_0.json", "w"))
open("gene2.txt", "w").write(
    "\t".join([str(random.random()) * 100 for _ in range(3600)]))
