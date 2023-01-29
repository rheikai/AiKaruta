import { config } from "../Config";

export abstract class KarutaLogic {
    protected constructor() {

    }

    public initialHandXy(y: number, fudasMatrix: number[][]): { x: number, y: number } {
        return { x: 0, y: y };
    }

    public fudasMatrix(fudasPlayer1: number[], fudasPlayer2: number[]): number[][] {
        let fudasMatrix: number[][] = [];
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            fudasMatrix.push([]);
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                fudasMatrix[row].push(-1);
            }
        }
        return fudasMatrix;
    }

    public okurifuda(from: number, to: number, fudasMatrix: number[][]): { fromRowColumn: { row: number, column: number }, toRowColumn: { row: number, column: number } } {
        return { fromRowColumn: { row: 0, column: 0 }, toRowColumn: { row: 0, column: 0 } };
    }
}
