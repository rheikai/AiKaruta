import { config } from "./Config";
import { KarutaLogic } from "./KarutaLogics/KarutaLogic";
import { karutas } from "./karutas";

export class FudasOnFieldMatrix {
    private _fudasMatrix: number[][];
    private _karutaLogic: KarutaLogic;

    public constructor(karutaLogic: KarutaLogic) {
        this._karutaLogic = karutaLogic;

        this._fudasMatrix = [];
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            this._fudasMatrix.push([]);
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                this._fudasMatrix[row].push(-1);
            }
        }
    }

    public getFudasPlayer1(): number[] {
        let fudasPlayer1: number[] = [];
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                fudasPlayer1.push(this._fudasMatrix[row][column]);
            }
        }
        return fudasPlayer1;
    }

    public getFudasPlayer2(): number[] {
        let fudasPlayer2: number[] = [];
        for (let row = config.N_FUDA_Y() / 2; row < config.N_FUDA_Y(); row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                fudasPlayer2.push(this._fudasMatrix[row][column]);
            }
        }
        return fudasPlayer2;
    }

    public getFudasMatrix() {
        return this._fudasMatrix.slice();
    }

    public setFudasMatrix(): void {
        let fudasPlayer1: number[] = [];
        let fudasPlayer2: number[] = [];

        let fudaIds: number[] = [];
        for (let i = 0; i < karutas.length; i++) {
            fudaIds.push(i);
        }

        for (let i = 0; i < 25; i++) {
            const index = Math.floor(Math.random() * fudaIds.length);
            fudasPlayer1.push(fudaIds[index]);
            fudaIds.splice(index, 1);
        }

        for (let i = 0; i < 25; i++) {
            const index = Math.floor(Math.random() * fudaIds.length);
            fudasPlayer2.push(fudaIds[index]);
            fudaIds.splice(index, 1);
        }

        this._fudasMatrix = this._karutaLogic.fudasMatrix(fudasPlayer1, fudasPlayer2);
    }

    public okurifuda(from: number, to: number): void {
        const okurifuda = this._karutaLogic.okurifuda(from, to, this._fudasMatrix.slice());

        this._fudasMatrix[okurifuda.toRowColumn.row][okurifuda.toRowColumn.column] = this._fudasMatrix[okurifuda.fromRowColumn.row][okurifuda.toRowColumn.column];
        this._fudasMatrix[okurifuda.fromRowColumn.row][okurifuda.fromRowColumn.column] = -1;
    }

    public getFudaRowColumnFromFudaId(fudaId: number): { row: number, column: number } | null {
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (this._fudasMatrix[row][column] === fudaId) {
                    return { row: row, column: column };
                }
            }
        }
        return null;
    }

    public getFudaXyFromFudaId(fudaId: number): { top: number, bottom: number, left: number, right: number } | null {
        const fuda = this.getFudaRowColumnFromFudaId(fudaId);
        if (fuda !== null) {
            return this.getFudaXyFromRowColumn(fuda.row, fuda.column);
        } else {
            return null;
        }
    }

    private getFudaXyFromRowColumn(row: number, column: number): { top: number, bottom: number, left: number, right: number } {
        let top = 0;
        let bottom = 0;
        const left = config.FUDA_WIDTH() * column;
        const right = config.FUDA_WIDTH() * (column + 1);

        if (row < config.N_FUDA_Y() / 2) {
            top = config.FUDA_HEIGHT() * row + config.MARGIN_Y1() * row;
        } else {
            top = config.FUDA_HEIGHT() * row + config.MARGIN_Y1() * row + config.MARGIN_Y3() - config.MARGIN_Y1();
        }
        bottom = top + config.FUDA_HEIGHT();
        return { top: top, bottom: bottom, left: left, right: right };
    }

    public fudaTaken(targetFudaId: number, handXyPlayer1: { x: number, y: number }, handXyPlayer2: { x: number, y: number }): number | null {
        const fudaXy = this.getFudaXyFromFudaId(targetFudaId);
        if (fudaXy === null) {
            return null;
        }

        const player1HandOnTargetFuda = fudaXy.top <= handXyPlayer1.y && handXyPlayer1.y <= fudaXy.bottom && fudaXy.left <= handXyPlayer1.x && handXyPlayer1.x <= fudaXy.right;
        const player2HandOnTargetFuda = fudaXy.top <= handXyPlayer2.y && handXyPlayer2.y <= fudaXy.bottom && fudaXy.left <= handXyPlayer2.x && handXyPlayer2.x <= fudaXy.right;

        if (!player1HandOnTargetFuda && !player2HandOnTargetFuda) {
            return null;
        }
        if (player1HandOnTargetFuda && !player2HandOnTargetFuda) {
            return 1;
        }
        if (!player1HandOnTargetFuda && player2HandOnTargetFuda) {
            return 2;
        }

        const fudaCenterX = (fudaXy.left + fudaXy.right) * 0.5;
        const fudaCenterY = (fudaXy.top + fudaXy.bottom) * 0.5;

        const distancePlayer1 = Math.pow(fudaCenterX - handXyPlayer1.x, 2) + Math.pow(fudaCenterY - handXyPlayer1.y, 2);
        const distancePlayer2 = Math.pow(fudaCenterX - handXyPlayer2.x, 2) + Math.pow(fudaCenterY - handXyPlayer2.y, 2);

        if (distancePlayer1 <= distancePlayer2) {
            return 1;
        } else {
            return 2;
        }
    }

    public selectOneFudaRandom(): number | null {
        const fudasPlayer1 = this.getFudasPlayer1().filter(fudaId => fudaId !== -1);
        const fudasPlayer2 = this.getFudasPlayer2().filter(fudaId => fudaId !== -1);

        if (fudasPlayer1.length + fudasPlayer2.length === 0) {
            return null;
        }

        const index = Math.floor(Math.random() * (fudasPlayer1.length + fudasPlayer2.length));
        if (index < fudasPlayer1.length) {
            return fudasPlayer1[index];
        } else {
            return fudasPlayer2[index - fudasPlayer1.length];
        }
    }

    public removeFuda(fudaId: number): void {
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                if (this._fudasMatrix[row][column] === fudaId) {
                    this._fudasMatrix[row][column] = -1;
                }
            }
        }
    }

    public getWinner(): number | null {
        if (this.getFudasPlayer1().find(fudaId => fudaId !== -1) === undefined) {
            return 1;
        }
        if (this.getFudasPlayer2().find(fudaId => fudaId !== -1) === undefined) {
            return 2;
        }
        return null;
    }

    public render(context: CanvasRenderingContext2D): void {
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                const fudaXy = this.getFudaXyFromRowColumn(row, column);

                context.strokeRect(fudaXy.left, fudaXy.top, config.FUDA_WIDTH(), config.FUDA_HEIGHT());
                if (this._fudasMatrix[row][column] !== -1) {
                    context.fillText(this._fudasMatrix[row][column].toString(), (fudaXy.left + fudaXy.right) * 0.5, (fudaXy.top + fudaXy.bottom) * 0.5);
                }
            }
        }
    }
}
