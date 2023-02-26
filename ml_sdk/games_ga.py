from selenium import webdriver
from selenium.webdriver.common.by import By
import json
import time


class games_ga:
    def __init__(self, driver, max_game_count, player1_gene, player2_gene):
        self.driver = driver
        self.driver.find_element(
            By.CSS_SELECTOR, "input#max_game_count").clear()
        self.driver.find_element(
            By.CSS_SELECTOR, "input#max_game_count").send_keys(str(max_game_count))

        self.games_log = self.driver.find_element(
            By.CSS_SELECTOR, "textarea#games_log")
        self.games_log.clear()

        self.p1_gene = self.driver.find_element(
            By.CSS_SELECTOR, "div#player1 > textarea#gene")
        self.p1_gene.clear()
        self.p1_gene.send_keys(
            "\t".join([str(round(val*100)/100) for val in player1_gene]))

        self.p2_gene = self.driver.find_element(
            By.CSS_SELECTOR, "div#player2 > textarea#gene")
        self.p2_gene.clear()
        self.p2_gene.send_keys(
            "\t".join([str(round(val*100)/100) for val in player2_gene]))

    def start_games(self):
        self.driver.find_element(By.CSS_SELECTOR, "button#start_games").click()
        games_log = self.__run_games()
        return games_log

    def __run_games(self):
        while (True):
            time.sleep(1)
            if self.games_log.get_attribute("value").strip() != "":
                return json.loads(self.games_log.get_attribute("value").strip())
