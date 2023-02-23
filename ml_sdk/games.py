from selenium import webdriver
from selenium.webdriver.common.by import By
import json


class games:
    def __init__(self, max_game_count, player1_logic, player2_logic):
        self.player1_logic = player1_logic
        self.player2_logic = player2_logic

        self.driver = webdriver.Firefox()
        self.driver.get("http://localhost:8080")

        self.driver.find_element(
            By.CSS_SELECTOR, "input#max_game_count").clear()
        self.driver.find_element(
            By.CSS_SELECTOR, "input#max_game_count").send_keys(str(max_game_count))

        self.games_log = self.driver.find_element(
            By.CSS_SELECTOR, "textarea#games_log")

        self.p1_message_box = self.driver.find_element(
            By.CSS_SELECTOR, "div#player1 > div#message_box")
        self.p1_fudas_matrix = self.driver.find_element(
            By.CSS_SELECTOR, "div#player1 > textarea#fudas_matrix")
        self.p1_initial_hand_x = self.driver.find_element(
            By.CSS_SELECTOR, "div#player1 > input#initial_hand_x")
        self.p1_send_okurifuda_row = self.driver.find_element(
            By.CSS_SELECTOR, "div#player1 > input#send_okurifuda_row")
        self.p1_send_okurifuda_column = self.driver.find_element(
            By.CSS_SELECTOR, "div#player1 > input#send_okurifuda_column")
        self.p1_receive_okurifuda_row = self.driver.find_element(
            By.CSS_SELECTOR, "div#player1 > input#receive_okurifuda_row")
        self.p1_receive_okurifuda_column = self.driver.find_element(
            By.CSS_SELECTOR, "div#player1 > input#receive_okurifuda_column")
        self.p1_submission_button = self.driver.find_element(
            By.CSS_SELECTOR, "div#player1 > button#submission_button")

        self.p2_message_box = self.driver.find_element(
            By.CSS_SELECTOR, "div#player2 > div#message_box")
        self.p2_fudas_matrix = self.driver.find_element(
            By.CSS_SELECTOR, "div#player2 > textarea#fudas_matrix")
        self.p2_initial_hand_x = self.driver.find_element(
            By.CSS_SELECTOR, "div#player2 > input#initial_hand_x")
        self.p2_send_okurifuda_row = self.driver.find_element(
            By.CSS_SELECTOR, "div#player2 > input#send_okurifuda_row")
        self.p2_send_okurifuda_column = self.driver.find_element(
            By.CSS_SELECTOR, "div#player2 > input#send_okurifuda_column")
        self.p2_receive_okurifuda_row = self.driver.find_element(
            By.CSS_SELECTOR, "div#player2 > input#receive_okurifuda_row")
        self.p2_receive_okurifuda_column = self.driver.find_element(
            By.CSS_SELECTOR, "div#player2 > input#receive_okurifuda_column")
        self.p2_submission_button = self.driver.find_element(
            By.CSS_SELECTOR, "div#player2 > button#submission_button")

    def start_games(self):
        self.driver.find_element(By.CSS_SELECTOR, "button#start_games").click()
        games_log = self.__run_games()
        self.driver.close()
        return games_log

    def __run_games(self):
        while (True):
            if self.games_log.get_attribute("value").strip() != "":
                return json.loads(self.games_log.get_attribute("value").strip())

            elif self.p1_message_box.text.strip() == "initialHandXy":
                fudas_matrix = self.__parse_fudas_matrix_textarea(
                    self.p1_fudas_matrix.get_attribute("value").strip())
                x = self.player1_logic.initial_hand_x(fudas_matrix)
                self.p1_initial_hand_x.clear()
                self.p1_initial_hand_x.send_keys(str(x))
                self.p1_submission_button.click()

            elif self.p1_message_box.text.strip() == "fudasMatrix":
                fudas_matrix = self.__parse_fudas_matrix_textarea(
                    self.p1_fudas_matrix.get_attribute("value").strip())
                new_fudas_matrix_str = ""
                for row in self.player1_logic.fudas_matrix(fudas_matrix):
                    new_fudas_matrix_str += "\t".join([str(val)
                                                      for val in row]) + "\n"
                new_fudas_matrix_str = new_fudas_matrix_str.strip()
                self.p1_fudas_matrix.clear()
                self.p1_fudas_matrix.send_keys(new_fudas_matrix_str)
                self.p1_submission_button.click()

            elif self.p1_message_box.text.strip() == "sendOkurifuda":
                fudas_matrix = self.__parse_fudas_matrix_textarea(
                    self.p1_fudas_matrix.get_attribute("value").strip())
                row, column = self.player1_logic.send_okurifuda(fudas_matrix)
                self.p1_send_okurifuda_row.clear()
                self.p1_send_okurifuda_row.send_keys(str(row))
                self.p1_send_okurifuda_column.clear()
                self.p1_send_okurifuda_column.send_keys(str(column))
                self.p1_submission_button.click()

            elif self.p1_message_box.text.strip() == "receiveOkurifuda":
                fudas_matrix = self.__parse_fudas_matrix_textarea(
                    self.p1_fudas_matrix.get_attribute("value").strip())
                sent_okurifuda = {
                    "row": int(self.p1_send_okurifuda_row.get_attribute("value")),
                    "column": int(self.p1_send_okurifuda_column.get_attribute("value")),
                }
                row, column = self.player1_logic.receive_okurifuda(
                    fudas_matrix, sent_okurifuda["row"], sent_okurifuda["column"])
                self.p1_receive_okurifuda_row.clear()
                self.p1_receive_okurifuda_row.send_keys(str(row))
                self.p1_receive_okurifuda_column.clear()
                self.p1_receive_okurifuda_column.send_keys(str(column))
                self.p1_submission_button.click()

            elif self.p2_message_box.text.strip() == "initialHandXy":
                fudas_matrix = self.__parse_fudas_matrix_textarea(
                    self.p2_fudas_matrix.get_attribute("value").strip())
                x = self.player2_logic.initial_hand_x(fudas_matrix)
                self.p2_initial_hand_x.clear()
                self.p2_initial_hand_x.send_keys(str(x))
                self.p2_submission_button.click()

            elif self.p2_message_box.text.strip() == "fudasMatrix":
                fudas_matrix = self.__parse_fudas_matrix_textarea(
                    self.p2_fudas_matrix.get_attribute("value").strip())
                new_fudas_matrix_str = ""
                for row in self.player1_logic.fudas_matrix(fudas_matrix):
                    new_fudas_matrix_str += "\t".join([str(val)
                                                      for val in row]) + "\n"
                new_fudas_matrix_str = new_fudas_matrix_str.strip()
                self.p2_fudas_matrix.clear()
                self.p2_fudas_matrix.send_keys(new_fudas_matrix_str)
                self.p2_submission_button.click()

            elif self.p2_message_box.text.strip() == "sendOkurifuda":
                fudas_matrix = self.__parse_fudas_matrix_textarea(
                    self.p2_fudas_matrix.get_attribute("value").strip())
                row, column = self.player1_logic.send_okurifuda(fudas_matrix)
                self.p2_send_okurifuda_row.clear()
                self.p2_send_okurifuda_row.send_keys(str(row))
                self.p2_send_okurifuda_column.clear()
                self.p2_send_okurifuda_column.send_keys(str(column))
                self.p2_submission_button.click()

            elif self.p2_message_box.text.strip() == "receiveOkurifuda":
                fudas_matrix = self.__parse_fudas_matrix_textarea(
                    self.p2_fudas_matrix.get_attribute("value").strip())
                sent_okurifuda = {
                    "row": int(self.p2_send_okurifuda_row.get_attribute("value")),
                    "column": int(self.p2_send_okurifuda_column.get_attribute("value")),
                }
                row, column = self.player1_logic.receive_okurifuda(
                    fudas_matrix, sent_okurifuda["row"], sent_okurifuda["column"])
                self.p2_receive_okurifuda_row.clear()
                self.p2_receive_okurifuda_row.send_keys(str(row))
                self.p2_receive_okurifuda_column.clear()
                self.p2_receive_okurifuda_column.send_keys(str(column))
                self.p2_submission_button.click()

    def __parse_fudas_matrix_textarea(self, fudas_matrix_textarea_str):
        fudas_matrix = []
        for line in fudas_matrix_textarea_str.split("\n"):
            if line.strip() == "":
                continue
            fudas_matrix.append([])
            for cell in line.split("\t"):
                fudas_matrix[-1].append(int(cell))
        return fudas_matrix
