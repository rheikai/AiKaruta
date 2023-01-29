import { KarutaLogic } from "./KarutaLogic";
import { config } from "../Config";

export class KarutaLogicRandom extends KarutaLogic {
    public constructor() {
        super();
    }

    public override initialHandXy(y: number, fudasMatrix: number[][]): { x: number, y: number } {
        return { x: Math.random() * (config.FUDA_WIDTH() * config.N_FUDA_X() + config.MARGIN_X() * (config.N_FUDA_X() - 1)), y: y };
    }

    public override fudasMatrix(fudasPlayer1: number[], fudasPlayer2: number[]): number[][] {
        let fudasMatrix: number[][] = super.fudasMatrix(fudasPlayer1, fudasPlayer2);

        let nonreservedPlayer1Matrix: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                nonreservedPlayer1Matrix.push({ row: row, column: column });
            }
        }
        for (let i = 0; i < fudasPlayer1.length; i++) {
            const index = Math.floor(Math.random() * nonreservedPlayer1Matrix.length);
            fudasMatrix[nonreservedPlayer1Matrix[index].row][nonreservedPlayer1Matrix[index].column] = fudasPlayer1[i];
            nonreservedPlayer1Matrix.splice(index, 1);
        }

        let nonreservedPlayer2Matrix: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                nonreservedPlayer2Matrix.push({ row: row, column: column });
            }
        }
        for (let i = 0; i < fudasPlayer2.length; i++) {
            const index = Math.floor(Math.random() * nonreservedPlayer2Matrix.length);
            fudasMatrix[nonreservedPlayer2Matrix[index].row + config.N_FUDA_Y() / 2][nonreservedPlayer2Matrix[index].column] = fudasPlayer2[i];
            nonreservedPlayer2Matrix.splice(index, 1);
        }

        return fudasMatrix;
    }

    public okurifuda(from: number, to: number, fudasMatrix: number[][]): { fromRowColumn: { row: number, column: number }, toRowColumn: { row: number, column: number } } {
        let player1Fudas: { row: number, column: number }[] = [];
        let player2Fudas: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (fudasMatrix[row][column] !== -1) {
                    player1Fudas.push({ row: row, column: column });
                }
            }
        }
        for (let row = config.N_FUDA_Y() / 2; row < config.N_FUDA_Y(); row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (fudasMatrix[row][column] !== -1) {
                    player2Fudas.push({ row: row, column: column });
                }
            }
        }

        const randomPlayer1Fuda = player1Fudas[Math.floor(Math.random() * player1Fudas.length)];
        const randomPlayer2Fuda = player2Fudas[Math.floor(Math.random() * player2Fudas.length)];

        if (from === 1) {
            return { fromRowColumn: randomPlayer1Fuda, toRowColumn: randomPlayer2Fuda };
        } else {
            return { fromRowColumn: randomPlayer2Fuda, toRowColumn: randomPlayer1Fuda };
        }
    }
}
