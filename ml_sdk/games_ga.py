import json
import os
import subprocess
import random


class games_ga:
    def __init__(self, max_game_count, player1_gene, player2_gene):
        self.max_game_count = max_game_count
        self.player1_gene = player1_gene
        self.player2_gene = player2_gene

    def start_games(self):
        player1_gene_filepath = "./ml_sdk/tmp/"+str(random.random())
        player2_gene_filepath = "./ml_sdk/tmp/"+str(random.random())
        games_log_filepath = "./ml_sdk/tmp/"+str(random.random())
        open(player1_gene_filepath, "w").write(
            "\t".join([str(val) for val in self.player1_gene]))
        open(player2_gene_filepath, "w").write(
            "\t".join([str(val) for val in self.player2_gene]))
        subprocess.run(
            f"node ./nodejs/main.js {player1_gene_filepath} {player2_gene_filepath} {games_log_filepath}", shell=True)
        games_log = json.load(open(games_log_filepath))
        os.remove(player1_gene_filepath)
        os.remove(player2_gene_filepath)
        os.remove(games_log_filepath)
        return games_log
