import { KarutaLogic } from "./KarutaLogic";
import { config } from "../Config";

export class KarutaLogicGeneticAlgorithm extends KarutaLogic {
    private _gene: number[][][];
    public constructor(geneStr: string) {
        super();

        let serialGene: number[] = [];
        for (let locus of geneStr.split("\t")) {
            serialGene.push(Number.parseInt(locus));
        }
        this._gene = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            this._gene.push([]);
            for (let column = 0; column < config.N_FUDA_Y(); column++) {
                this._gene[row].push([]);
                for (let fudaId = 0; fudaId < 100; fudaId++) {
                    this._gene[row][column].push(serialGene[row * config.N_FUDA_Y() / 2 * 100 + column * 100 + fudaId]);
                }
            }
        }
    }

    public override async initialHandXy(fudasMatrix: number[][]): Promise<{ x: number, y: number }> {
        return { x: Math.random() * (config.FIELD_WIDTH()), y: 0 };
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


        let myFudasId: number[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_Y(); column++) {
                myFudasId.push(fudasMatrix[row][column]);
            }
        }

        let orderedScores: { fudaId: number, score: number, row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_Y(); column++) {
                for (let fudaId = 0; fudaId < 100; fudaId++) {
                    orderedScores.push({ fudaId: fudaId, score: this._gene[row][column][fudaId], row: row, column: column })
                }
            }
        }
        orderedScores.sort((a, b) => { return b.score - a.score; });

        let newFudasMatrix: number[][] = fudasMatrix.slice();
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            newFudasMatrix.push([]);
            for (let column = 0; column < config.N_FUDA_Y(); column++) {
                newFudasMatrix[row][column] = -1;
            }
        }

        let fudasOnField: number[] = [];
        for (let score of orderedScores) {
            const fudaId = score.fudaId;
            if (!myFudasId.includes(fudaId)) {
                continue;
            }
            const row = score.row;
            const column = score.column;
            if (newFudasMatrix[row][column] === -1 && !fudasOnField.includes(fudaId)) {
                newFudasMatrix[row][column] = fudaId;
                fudasOnField.push(fudaId);
            }
        }

        return newFudasMatrix;
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
