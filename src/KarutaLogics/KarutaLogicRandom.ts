import { KarutaLogic } from "./KarutaLogic";
import { config } from "../Config";

export class KarutaLogicRandom extends KarutaLogic {
    public constructor() {
        super();
    }

    public override initialHandXy(fudasMatrix: number[][]): { x: number, y: number } {
        return { x: Math.random() * (config.FUDA_WIDTH() * config.N_FUDA_X() + config.MARGIN_X() * (config.N_FUDA_X() - 1)), y: 0 };
    }

    public override fudasMatrix(myFudas: number[], opponentFudas: number[]): number[][] {
        let fudasMatrix: number[][] = super.fudasMatrix(myFudas, opponentFudas);

        let nonreservedMyFudasMatrix: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                nonreservedMyFudasMatrix.push({ row: row, column: column });
            }
        }
        for (let i = 0; i < myFudas.length; i++) {
            const index = Math.floor(Math.random() * nonreservedMyFudasMatrix.length);
            fudasMatrix[nonreservedMyFudasMatrix[index].row][nonreservedMyFudasMatrix[index].column] = myFudas[i];
            nonreservedMyFudasMatrix.splice(index, 1);
        }

        let nonreservedOpponentFudasMatrix: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                nonreservedOpponentFudasMatrix.push({ row: row, column: column });
            }
        }
        for (let i = 0; i < opponentFudas.length; i++) {
            const index = Math.floor(Math.random() * nonreservedOpponentFudasMatrix.length);
            fudasMatrix[nonreservedOpponentFudasMatrix[index].row + config.N_FUDA_Y() / 2][nonreservedOpponentFudasMatrix[index].column] = opponentFudas[i];
            nonreservedOpponentFudasMatrix.splice(index, 1);
        }

        return fudasMatrix;
    }

    public override sendOkurifuda(fudasMatrix: number[][]): { row: number, column: number } {
        let myFudas: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (fudasMatrix[row][column] !== -1) {
                    myFudas.push({ row: row, column: column });
                }
            }
        }
        return myFudas[Math.floor(Math.random() * myFudas.length)];
    }

    public override receiveOkurifuda(fudasMatrix: number[][], sentFuda: { row: number, column: number }): { row: number, column: number } {
        let myFudas: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (fudasMatrix[row][column] === -1) {
                    myFudas.push({ row: row, column: column });
                }
            }
        }
        return myFudas[Math.floor(Math.random() * myFudas.length)];
    }
}
