from games_ga import games_ga
import threading
import json
import math
import random
import os

MAX_GAME_COUNT = 20

parents = json.load(open("./ml_sdk/genes/gen_0.json"))

gen = 0
for i in range(100000000):
    if os.path.exists(f"./ml_sdk/genes/gen_{i}.json"):
        gen = i
        children_gene = json.load(open(f"./ml_sdk/genes/gen_{i}.json"))
    else:
        break


skip = True
for generation in range(gen, 10000):
    print(generation)
    if not skip:
        children_gene = []
        for i in range(100):
            parent_1 = parents[math.floor(random.random() * 50)]
            parent_2 = parents[math.floor(random.random() * 50)]

            child_gene = []
            for locus in range(3600):
                rand = random.random()
                if rand <= 0.45:
                    child_gene.append(parent_1[locus])
                elif rand <= 0.9:
                    child_gene.append(parent_2[locus])
                else:
                    child_gene.append(random.random() * 100)
            children_gene.append(child_gene)
        json.dump(children_gene, open(
            f"./ml_sdk/genes/gen_{generation}.json", "w"))
    skip = False

    parents = []

    def run_game(i):
        gs = games_ga(MAX_GAME_COUNT,
                      children_gene[i*2], children_gene[i*2+1])
        games_log = gs.start_games()
        player1_win_count = 0
        for game in games_log:
            if game["winner"] == 1:
                player1_win_count += 1
        if player1_win_count > MAX_GAME_COUNT * 0.5:
            parents.append(children_gene[i*2])
        else:
            parents.append(children_gene[i*2+1])

    # for i in range(50):
    #     run_game(i)

    threads = []
    for i in range(50):
        threads.append(threading.Thread(None, run_game, None, (i,)))
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
