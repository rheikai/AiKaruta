import { config } from "../Config";

export abstract class KarutaLogic {
    protected constructor() {

    }

    public initialHandXy(fudasMatrix: number[][]): { x: number, y: number } {
        return { x: 0, y: 0 };
    }

    public fudasMatrix(myFudas: number[], opponentFudas: number[]): number[][] {
        let fudasMatrix: number[][] = [];
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            fudasMatrix.push([]);
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                fudasMatrix[row].push(-1);
            }
        }
        return fudasMatrix;
    }

    public sendOkurifuda(fudasMatrix: number[][]): { row: number, column: number } {
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

    public receiveOkurifuda(fudasMatrix: number[][], sentFuda: { row: number, column: number }): { row: number, column: number } {
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
