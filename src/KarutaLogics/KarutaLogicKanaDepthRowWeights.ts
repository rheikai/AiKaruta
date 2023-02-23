import { config } from "../Config";
import { karutas } from "../karutas";
import { KarutaLogicRandom } from "./KarutaLogicRandom";
import { KanaTree } from "./KanaTree";

export class KarutaLogicKanaDepthRowWeights extends KarutaLogicRandom {
    private _depthWeights: number[];
    private _rowWeights: number[];

    public constructor(depthWeights: number[], rowWeights: number[]) {
        super();
        this._depthWeights = depthWeights;
        this._rowWeights = rowWeights;
    }

    public override async initialHandXy(fudasMatrix: number[][]): Promise<{ x: number, y: number }> {
        const kanaTree = this.getKanaTree(fudasMatrix);
        const fudasOnField = this.getFudasOnField(fudasMatrix);

        let columnWeight = 0;
        let weightSum = 0;
        for (let fuda of fudasOnField) {
            const depth = kanaTree.getDepth(karutas[fuda.id].kana.join(""));
            const weight = this._depthWeights[depth] * this._rowWeights[fuda.row];
            columnWeight += weight * fuda.column;
            weightSum += weight;
        }
        return { x: columnWeight / weightSum / config.N_FUDA_X() * config.FIELD_WIDTH(), y: 0 };
    }

    public override async fudasMatrix(myFudas: number[], opponentFudas: number[]): Promise<number[][]> {
        let fudasMatrix: number[][] = await super.fudasMatrix(myFudas, opponentFudas);
        const kanaTree = this.getKanaTree(fudasMatrix);

        for (let i = 0; i < 20; i++) {
            for (let row1 = 0; row1 < config.N_FUDA_Y() / 2; row1++) {
                for (let column1 = 0; column1 < config.N_FUDA_X(); column1++) {
                    for (let row2 = 0; row2 < config.N_FUDA_Y() / 2; row2++) {
                        for (let column2 = 0; column2 < config.N_FUDA_X(); column2++) {
                            if (row2 < row1 || (row2 === row1 && column2 <= column1) || fudasMatrix[row1][column1] === fudasMatrix[row2][column2]) {
                                continue;
                            }

                            let currentScore = 0;
                            for (let row = 0; row < config.N_FUDA_Y(); row++) {
                                for (let column = 0; column < config.N_FUDA_X(); column++) {
                                    if (fudasMatrix[row][column] !== -1) {
                                        currentScore += this._rowWeights[row]
                                            * this._depthWeights[kanaTree.getDepth(karutas[fudasMatrix[row][column]].kana.join(""))];
                                    }
                                }
                            }

                            const tmp1 = fudasMatrix[row1][column1];
                            const tmp2 = fudasMatrix[row2][column2];
                            fudasMatrix[row1][column1] = tmp2;
                            fudasMatrix[row2][column2] = tmp1;

                            let swappedScore = 0;
                            for (let row = 0; row < config.N_FUDA_Y(); row++) {
                                for (let column = 0; column < config.N_FUDA_X(); column++) {
                                    if (fudasMatrix[row][column] !== -1) {
                                        swappedScore += this._rowWeights[row]
                                            * this._depthWeights[kanaTree.getDepth(karutas[fudasMatrix[row][column]].kana.join(""))];
                                    }
                                }
                            }

                            if (swappedScore <= currentScore) {
                                fudasMatrix[row1][column1] = tmp1;
                                fudasMatrix[row2][column2] = tmp2;
                            }
                        }
                    }
                }
            }
        }
        return fudasMatrix.slice();
    }

    public override async sendOkurifuda(fudasMatrix: number[][]): Promise<{ row: number, column: number }> {
        const kanaTree = this.getKanaTree(fudasMatrix);

        let fudaRcMaxDepth = { row: 0, column: 0 };
        let maxDepth = 0;
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (fudasMatrix[row][column] !== -1) {
                    const depth = kanaTree.getDepth(karutas[fudasMatrix[row][column]].kana.join(""));
                    if (depth >= maxDepth) {
                        fudaRcMaxDepth = { row: row, column: column };
                        maxDepth = depth;
                    }
                }
            }
        }
        return fudaRcMaxDepth;
    }

    public override async receiveOkurifuda(fudasMatrix: number[][], sentFuda: { row: number, column: number }): Promise<{ row: number, column: number }> {
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (fudasMatrix[row][column] === -1) {
                    return { row: row, column: column };
                }
            }
        }
        return { row: 0, column: 0 };
    }

    protected getFudasOnField(fudasMatrix: number[][]): { id: number, row: number, column: number }[] {
        let fudasOnField: { id: number, row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (fudasMatrix[row][column] !== -1) {
                    fudasOnField.push({ id: fudasMatrix[row][column], row: row, column: column });
                }
            }
        }
        return fudasOnField;
    }

    protected getKanaTree(fudasMatrix: number[][]): KanaTree {
        const fudasOnField = this.getFudasOnField(fudasMatrix);
        let kanaTree = new KanaTree();
        for (let fuda of fudasOnField) {
            kanaTree.setFuda(karutas[fuda.id].kana.join(""));
        }
        return kanaTree;
    }
}
