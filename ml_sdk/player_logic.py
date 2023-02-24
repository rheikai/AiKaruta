class player_logic:
    def __init__(self, gene):
        self.gene = [[] for _ in range(3)]
        for row in range(3):
            self.gene[row] = [[] for _ in range(12)]
            for column in range(12):
                self.gene[row][column] = [0 for _ in range(100)]
                for id in range(100):
                    self.gene[row][column][id] = gene[row *
                                                      12*100 + column * 100 + id]

    def initial_hand_x(self, fudas_matrix):
        return 624 * 0.5

    def fudas_matrix(self, fudas_matrix):
        my_fuda_ids = set()
        for row in range(3):
            for column in range(12):
                my_fuda_ids.add(fudas_matrix[row][column])

        ordered_scores = []
        for row in range(3):
            for column in range(12):
                for id in range(100):
                    ordered_scores.append(
                        {"score": self.gene[row][column][id], "row": row, "column": column, "id": id})
        ordered_scores.sort(key=lambda info: info["score"], reverse=True)

        new_fudas_matrix = [[-1 for column in range(12)] for _ in range(6)]
        fudas_on_field = set()
        for score in ordered_scores:
            id = score["id"]
            if not id in my_fuda_ids:
                continue
            row = score["row"]
            column = score["column"]
            if new_fudas_matrix[row][column] == -1 and (not id in fudas_on_field):
                new_fudas_matrix[row][column] = score["id"]
                fudas_on_field.add(id)

        return new_fudas_matrix

    def send_okurifuda(self, fudas_matrix):
        for row in range(len(fudas_matrix)-1, 0, -1):
            for column in range(len(fudas_matrix[row])):
                if fudas_matrix[row][column] != 1:
                    return (row, column)
        return (0, 0)

    def receive_okurifuda(self, fudas_matrix, row, column):
        for row in range(len(fudas_matrix)):
            for column in range(len(fudas_matrix[row])):
                if fudas_matrix[row][column] == 1:
                    return (row, column)
        return (0, 0)
