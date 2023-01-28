import { fudaMatrix } from "./FudaMatrix";
import { config } from "./Config";
import { karutas } from "./karutas";

export class Player {
    private _handPosition: { x: number, y: number };
    public constructor() {
        this._handPosition = { x: 0, y: 0 };
    }

    public getHandPosition(): { x: number, y: number } {
        return { x: this._handPosition.x, y: this._handPosition.y };
    }

    public setInitialHandPosition(y: number): void {
        this._handPosition = { x: config.FUDA_WIDTH * config.N_FUDA_X * 0.5, y: y };
    }

    public setNextHandPosition(yomaretaStr: string): void {
        let numPossibleFudas = 0;
        let sumXPossibleFudas = 0;
        let sumYPossibleFudas = 0;

        for (let row = 0; row < config.N_FUDA_Y; row++) {
            for (let column = 0; column < config.N_FUDA_X; column++) {
                const idx = fudaMatrix.getFudaMatrix()[row][column];
                if (idx !== -1 && karutas[idx].kana.join().startsWith(yomaretaStr)) {
                    numPossibleFudas++;
                    const fudaLocation = fudaMatrix.getFudaPosition(idx);
                    if (fudaLocation !== null) {
                        sumXPossibleFudas += (fudaLocation.left + fudaLocation.right) * 0.5;
                        sumYPossibleFudas += (fudaLocation.top + fudaLocation.bottom) * 0.5;
                    }
                }
            }
        }
        if (numPossibleFudas == 0) {
            return;
        }

        const possibleFudaPositionsCenter = {
            x: sumXPossibleFudas / numPossibleFudas,
            y: sumYPossibleFudas / numPossibleFudas
        };


        const distance = Math.sqrt(Math.pow(possibleFudaPositionsCenter.x - this._handPosition.x, 2) + Math.pow(possibleFudaPositionsCenter.y - this._handPosition.y, 2));
        const tripPerFrame = config.HAND_DISPLACEMENT_PER_SEC / config.FPS;
        if (distance <= tripPerFrame) {
            return;
        }

        this._handPosition = {
            x: this._handPosition.x + (possibleFudaPositionsCenter.x - this._handPosition.x) * tripPerFrame / distance,
            y: this._handPosition.y + (possibleFudaPositionsCenter.y - this._handPosition.y) * tripPerFrame / distance
        };
    }

    public renderHand(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.arc(this._handPosition.x, this._handPosition.y, 10, 0, Math.PI * 2);
        context.stroke();
    }
}