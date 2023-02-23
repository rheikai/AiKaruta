class player_logic:
    def __init__(self):
        pass

    def initial_hand_x(self, fudax_matrix):
        return 0

    def fudas_matrix(self, fudax_matrix):
        return fudax_matrix

    def send_okurifuda(self, fudas_matrix):
        for row in range(len(fudas_matrix)):
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
