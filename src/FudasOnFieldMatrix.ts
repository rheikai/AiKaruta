import { config } from "./Config";
import { KarutaLogic } from "./KarutaLogics/KarutaLogic";
import { karutas } from "./karutas";

export class FudasOnFieldMatrix {
    private _fudasMatrix: number[][];
    private _karutaLogicPlayer1: KarutaLogic;
    private _karutaLogicPlayer2: KarutaLogic;

    public constructor(karutaLogicPlayer1: KarutaLogic, karutaLogicPlayer2: KarutaLogic) {
        this._karutaLogicPlayer1 = karutaLogicPlayer1;
        this._karutaLogicPlayer2 = karutaLogicPlayer2;
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

        const fudaMatrixPlayer1 = this._karutaLogicPlayer1.fudasMatrix(fudasPlayer1, fudasPlayer2);
        const fudaMatrixPlayer2 = this._karutaLogicPlayer2.fudasMatrix(fudasPlayer2, fudasPlayer1);
        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                this._fudasMatrix[row][column] = fudaMatrixPlayer1[row][column];
            }
        }

        for (let row = config.N_FUDA_Y() / 2; row < config.N_FUDA_Y(); row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                this._fudasMatrix[row][column] = fudaMatrixPlayer2[config.N_FUDA_Y() - row - 1][config.N_FUDA_X() - column - 1];
            }
        }
    }

    public okurifudaFrom(player: number): void {
        function revRc(rc: { row: number, column: number }): { row: number, column: number } {
            return { row: config.N_FUDA_Y() - rc.row - 1, column: config.N_FUDA_X() - rc.column - 1 };
        }

        let oldRowColumn = { row: 0, column: 0 };
        let newRowColumn = { row: 0, column: 0 };
        if (player === 1) {
            oldRowColumn = this._karutaLogicPlayer1.sendOkurifuda(this._fudasMatrix.slice());
            newRowColumn = revRc(this._karutaLogicPlayer2.receiveOkurifuda(this.getReversedMatrix(), revRc(oldRowColumn)));
        } else {
            oldRowColumn = revRc(this._karutaLogicPlayer2.sendOkurifuda(this.getReversedMatrix()));
            newRowColumn = this._karutaLogicPlayer1.receiveOkurifuda(this._fudasMatrix.slice(), oldRowColumn);
        }
        this._fudasMatrix[newRowColumn.row][newRowColumn.column] = this._fudasMatrix[oldRowColumn.row][oldRowColumn.column];
        this._fudasMatrix[oldRowColumn.row][oldRowColumn.column] = -1;
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

    public getFudaWinner(yomifudaId: number, handXyPlayer1: { x: number, y: number }, handXyPlayer2: { x: number, y: number }): number | null {
        const fudaXy = this.getFudaXyFromFudaId(yomifudaId);
        if (fudaXy === null) {
            return null;
        }

        const player1HandOnYomifuda = fudaXy.top <= handXyPlayer1.y && handXyPlayer1.y <= fudaXy.bottom && fudaXy.left <= handXyPlayer1.x && handXyPlayer1.x <= fudaXy.right;
        const player2HandOnYomifuda = fudaXy.top <= handXyPlayer2.y && handXyPlayer2.y <= fudaXy.bottom && fudaXy.left <= handXyPlayer2.x && handXyPlayer2.x <= fudaXy.right;

        if (!player1HandOnYomifuda && !player2HandOnYomifuda) {
            return null;
        }
        if (player1HandOnYomifuda && !player2HandOnYomifuda) {
            return 1;
        }
        if (!player1HandOnYomifuda && player2HandOnYomifuda) {
            return 2;
        }

        const fudaCenterX = (fudaXy.left + fudaXy.right) * 0.5;
        const fudaCenterY = (fudaXy.top + fudaXy.bottom) * 0.5;

        const distancePlayer1 = Math.pow(fudaCenterX - handXyPlayer1.x, 2) + Math.pow(fudaCenterY - handXyPlayer1.y, 2);
        const distancePlayer2 = Math.pow(fudaCenterX - handXyPlayer2.x, 2) + Math.pow(fudaCenterY - handXyPlayer2.y, 2);

        if (distancePlayer1 < distancePlayer2) {
            return 1;
        } else if (distancePlayer1 > distancePlayer2) {
            return 2;
        } else {
            return Math.floor(Math.random() * 2) + 1;
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

    public getGameWinner(): number | null {
        if (this.getFudasPlayer1().find(fudaId => fudaId !== -1) === undefined) {
            return 1;
        }
        if (this.getFudasPlayer2().find(fudaId => fudaId !== -1) === undefined) {
            return 2;
        }
        return null;
    }

    public getReversedMatrix(): number[][] {
        let reversedMatrix: number[][] = [];
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            reversedMatrix.push([]);
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                reversedMatrix[row][column] = this._fudasMatrix[config.N_FUDA_Y() - row - 1][config.N_FUDA_X() - column - 1];
            }
        }
        return reversedMatrix;
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
