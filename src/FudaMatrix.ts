import { config } from "./Config";

class FudaMatrix {
    private _fudaMatrix: number[][];
    public constructor() {
        this._fudaMatrix = [];
        for (let row = 0; row < config.N_FUDA_Y * 2; row++) {
            this._fudaMatrix.push([]);
            for (let column = 0; column < config.N_FUDA_X; column++) {
                this._fudaMatrix[row].push(-1);
            }
        }
    }

    public getFudaMatrix() {
        return this._fudaMatrix.slice();
    }

    public setFudaMatrix(fudaPositions: number[][]): void {
        if (fudaPositions.length !== config.N_FUDA_Y * 2) {
            return;
        }

        for (let i = 0; i < config.N_FUDA_Y * 2; i++) {
            if (fudaPositions[i].length !== config.N_FUDA_X) {
                return;
            }
        }

        this._fudaMatrix = fudaPositions;
    }

    public setFudaMatrixRandom(fudasPlayer1: number[], fudasPlayer2: number[]): void {
        this._fudaMatrix = [];
        for (let row = 0; row < config.N_FUDA_Y * 2; row++) {
            this._fudaMatrix.push([]);
            for (let column = 0; column < config.N_FUDA_X; column++) {
                this._fudaMatrix[row].push(-1);
            }
        }


        let nonreservedMyPositions: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y; row++) {
            for (let column = 0; column < config.N_FUDA_X; column++) {
                nonreservedMyPositions.push({ row: row, column: column });
            }
        }
        for (let i = 0; i < fudasPlayer1.length; i++) {
            const idx = Math.floor(Math.random() * nonreservedMyPositions.length);
            this._fudaMatrix[nonreservedMyPositions[idx].row][nonreservedMyPositions[idx].column] = fudasPlayer1[i];
            nonreservedMyPositions.splice(idx, 1);
        }


        let nonreservedOpponentPositions: { row: number, column: number }[] = [];
        for (let row = 0; row < config.N_FUDA_Y; row++) {
            for (let column = 0; column < config.N_FUDA_X; column++) {
                nonreservedOpponentPositions.push({ row: row, column: column });
            }
        }
        for (let i = 0; i < fudasPlayer2.length; i++) {
            const idx = Math.floor(Math.random() * nonreservedMyPositions.length);
            this._fudaMatrix[nonreservedOpponentPositions[idx].row + config.N_FUDA_Y][nonreservedOpponentPositions[idx].column] = fudasPlayer2[i];
            nonreservedOpponentPositions.splice(idx, 1);
        }
    }

    public setFudaMatrixSfc(fudasPlayer1: number[], fudasPlayer2: number[]): void {
        return;
    }

    public getFudaPosition(fudaId: number): { top: number, bottom: number, left: number, right: number } | null {
        for (let row = 0; row < config.N_FUDA_Y * 2; row++) {
            for (let column = 0; column < config.N_FUDA_X; column++) {
                if (this._fudaMatrix[row][column] === fudaId) {
                    return this.getFudaPositionHelper(row, column);
                }
            }
        }
        return null;
    }

    private getFudaPositionHelper(row: number, column: number): { top: number, bottom: number, left: number, right: number } {
        let top = 0;
        let bottom = 0;
        let left = config.FUDA_WIDTH * column;
        let right = config.FUDA_WIDTH * (column + 1);

        if (row < config.N_FUDA_Y) {
            top = config.FUDA_HEIGHT * row + config.MARGIN_Y1 * row;
            bottom = top + config.FUDA_HEIGHT;
        } else {
            top = config.FUDA_HEIGHT * row + config.MARGIN_Y1 * row + config.MARGIN_Y3 - config.MARGIN_Y1;
            bottom = top + config.FUDA_HEIGHT;
        }
        return { top: top, bottom: bottom, left: left, right: right };
    }

    public fudaTaken(targetFudaId: number, handPositionP1: { x: number, y: number }, handPositionP2: { x: number, y: number }): number | null {
        const fudaPosition = this.getFudaPosition(targetFudaId);
        if (fudaPosition === null) {
            return null;
        }

        const p1HandOnTargetFuda = fudaPosition.top <= handPositionP1.y && handPositionP1.y <= fudaPosition.bottom && fudaPosition.left <= handPositionP1.x && handPositionP1.x <= fudaPosition.right;
        const p2HandOnTargetFuda = fudaPosition.top <= handPositionP2.y && handPositionP2.y <= fudaPosition.bottom && fudaPosition.left <= handPositionP2.x && handPositionP2.x <= fudaPosition.right;

        if (!p1HandOnTargetFuda && !p2HandOnTargetFuda) {
            return null;
        }
        if (p1HandOnTargetFuda && !p2HandOnTargetFuda) {
            return 1;
        }
        if (!p1HandOnTargetFuda && p2HandOnTargetFuda) {
            return 2;
        }

        const fudaCenterX = (fudaPosition.left + fudaPosition.right) * 0.5;
        const fudaCenterY = (fudaPosition.top + fudaPosition.bottom) * 0.5;

        const distanceP1 = Math.pow(fudaCenterX - handPositionP1.x, 2) + Math.pow(fudaCenterY - handPositionP1.y, 2);
        const distanceP2 = Math.pow(fudaCenterX - handPositionP2.x, 2) + Math.pow(fudaCenterY - handPositionP2.y, 2);

        if (distanceP1 <= distanceP2) {
            return 1;
        } else {
            return 2;
        }
    }

    public removeFuda(fudaId: number): void {
        for (let row = 0; row < config.N_FUDA_Y * 2; row++) {
            for (let column = 0; column < config.N_FUDA_X; column++) {
                if (this._fudaMatrix[row][column] === fudaId) {
                    this._fudaMatrix[row][column] = -1;
                }
            }
        }
    }

    public render(context: CanvasRenderingContext2D): void {
        let a = 0;
        for (let row = 0; row < config.N_FUDA_Y * 2; row++) {
            for (let column = 0; column < config.N_FUDA_X; column++) {
                const position = this.getFudaPositionHelper(row, column);

                context.strokeRect(position.left, position.top, config.FUDA_WIDTH, config.FUDA_HEIGHT);
                if (this._fudaMatrix[row][column] !== -1) {
                    context.fillText(this._fudaMatrix[row][column].toString(), (position.left + position.right) * 0.5, (position.top + position.bottom) * 0.5);
                    a++;
                }
            }
        }
        console.log(a);
    }
}

export let fudaMatrix = new FudaMatrix();
