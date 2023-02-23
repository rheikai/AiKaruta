import { KarutaLogic } from "./KarutaLogic";
import { config } from "../Config";

export class KarutaLogicRandom extends KarutaLogic {
    public constructor() {
        super();
    }

    public override async initialHandXy(fudasMatrix: number[][]): Promise<{ x: number, y: number }> {
        return Promise.resolve({ x: Math.random() * (config.FIELD_WIDTH()), y: 0 });
    }

    public override async fudasMatrix(myFudas: number[], opponentFudas: number[]): Promise<number[][]> {
        let fudasMatrix: number[][] = await super.fudasMatrix(myFudas, opponentFudas);

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

        return Promise.resolve(fudasMatrix);
    }

    public override async sendOkurifuda(fudasMatrix: number[][]): Promise<{ row: number, column: number }> {
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

    public override async receiveOkurifuda(fudasMatrix: number[][], sentFuda: { row: number, column: number }): Promise<{ row: number, column: number }> {
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
