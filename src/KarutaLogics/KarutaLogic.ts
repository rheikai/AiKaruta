import { config } from "../Config";

export abstract class KarutaLogic {
    protected constructor() {

    }

    public async initialHandXy(fudasMatrix: number[][]): Promise<{ x: number, y: number }> {
        return Promise.resolve({ x: 0, y: 0 });
    }

    public async fudasMatrix(myFudas: number[], opponentFudas: number[]): Promise<number[][]> {
        let fudasMatrix: number[][] = [];
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            fudasMatrix.push([]);
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                fudasMatrix[row].push(-1);
            }
        }
        return Promise.resolve(fudasMatrix);
    }

    public async sendOkurifuda(fudasMatrix: number[][]): Promise<{ row: number, column: number }> {
        let myFudas: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (fudasMatrix[row][column] !== -1) {
                    myFudas.push({ row: row, column: column });
                }
            }
        }
        return Promise.resolve(myFudas[Math.floor(Math.random() * myFudas.length)]);
    }

    public async receiveOkurifuda(fudasMatrix: number[][], sentFuda: { row: number, column: number }): Promise<{ row: number, column: number }> {
        let myFudas: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (fudasMatrix[row][column] === -1) {
                    myFudas.push({ row: row, column: column });
                }
            }
        }
        return Promise.resolve(myFudas[Math.floor(Math.random() * myFudas.length)]);
    }
}
