import { KarutaLogic } from "./KarutaLogic";
import { config } from "../Config";
import { karutas } from "../karutas";
import { KarutaLogicRandom } from "./KarutaLogicRandom";

export class KarutaLogicScf extends KarutaLogic {
    private _maxScfIterations = 100;
    private _depthWeights = [40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 10, 29, 28, 27, 26, 25, 24, 23, 22, 21,];

    public constructor() {
        super();
    }

    public override initialHandXy(fudasMatrix: number[][]): { x: number, y: number } {
        let fudasOnField: { id: number, row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (fudasMatrix[row][column] !== -1) {
                    fudasOnField.push({ id: fudasMatrix[row][column], row: row, column: column });
                }
            }
        }

        let kanaTree = new KanaTree();
        for (let fuda of fudasOnField) {
            kanaTree.setFuda(karutas[fuda.id].kana.join(""));
        }

        let columnWeight = 0;
        let columnSum = 0;
        for (let fuda of fudasOnField) {
            const depth = kanaTree.getDepth(karutas[fuda.id].kana.join(""));
            columnWeight += this._depthWeights[depth] * (config.FUDA_WIDTH() * fuda.column * 0.5 + config.MARGIN_X() * fuda.column);
            columnSum += config.FUDA_WIDTH() * fuda.column * 0.5 + config.MARGIN_X() * fuda.column;
        }
        const x = columnWeight / columnSum;

        return { x: x, y: 0 };
    }

    public override fudasMatrix(fudasPlayer1: number[], fudasPlayer2: number[]): number[][] {
        let fudasMatrix: number[][] = super.fudasMatrix(fudasPlayer1, fudasPlayer2);


        return new KarutaLogicRandom().fudasMatrix(fudasPlayer1, fudasPlayer2);
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

class KanaTree {
    private _children: Map<string, KanaTree>;
    public constructor() {
        this._children = new Map<string, KanaTree>();
    }

    public setFuda(kanas: string): void {
        if (kanas.length === 0) {
            return;
        }
        const firstKana = kanas[0];
        if (!this._children.has(firstKana)) {
            this._children.set(firstKana, new KanaTree());
        }
        this._children.get(firstKana)?.setFuda(kanas.substring(1));
    }

    public getDepth(kanas: string): number {
        if (this._children.has(kanas[0]) && this._children.size > 1) {
            return this._children.get(kanas[0])?.getDepth(kanas.substring(1))! + 1;
        } else {
            return 0;
        }
    }
}