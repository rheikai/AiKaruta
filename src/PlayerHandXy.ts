import { fudasOnFieldMatrix } from "./FudasOnFieldMatrix";
import { config } from "./Config";
import { karutas } from "./karutas";

export class PlayerHandXy {
    private _handXy: { x: number, y: number };
    public constructor() {
        this._handXy = { x: 0, y: 0 };
    }

    public getHandXy(): { x: number, y: number } {
        return { x: this._handXy.x, y: this._handXy.y };
    }

    public setInitialHandXy(y: number): void {
        this._handXy = { x: config.FUDA_WIDTH() * config.N_FUDA_X() * 0.5, y: y };
    }

    public setNextHandXy(yomaretaStr: string): void {
        let numPossibleFudas = 0;
        let sumXPossibleFudas = 0;
        let sumYPossibleFudas = 0;

        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                const index = fudasOnFieldMatrix.getFudaMatrix()[row][column];
                if (index !== -1 && karutas[index].kana.join("").startsWith(yomaretaStr)) {
                    const fudaXy = fudasOnFieldMatrix.getFudaXyFromFudaId(index);
                    if (fudaXy !== null) {
                        numPossibleFudas++;
                        sumXPossibleFudas += (fudaXy.left + fudaXy.right) * 0.5;
                        sumYPossibleFudas += (fudaXy.top + fudaXy.bottom) * 0.5;
                    }
                }
            }
        }

        if (numPossibleFudas == 0) {
            return;
        }

        const possibleFudasCenter = {
            x: sumXPossibleFudas / numPossibleFudas,
            y: sumYPossibleFudas / numPossibleFudas
        };

        const distance = Math.sqrt(Math.pow(possibleFudasCenter.x - this._handXy.x, 2) + Math.pow(possibleFudasCenter.y - this._handXy.y, 2));
        const tripPerFrame = config.HAND_DISPLACEMENT_PER_SEC() / config.FPS();
        if (distance <= tripPerFrame) {
            this._handXy = {
                x: possibleFudasCenter.x,
                y: possibleFudasCenter.y
            }
            return;
        }

        this._handXy = {
            x: this._handXy.x + (possibleFudasCenter.x - this._handXy.x) * tripPerFrame / distance,
            y: this._handXy.y + (possibleFudasCenter.y - this._handXy.y) * tripPerFrame / distance
        };
    }

    public renderHand(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.arc(this._handXy.x, this._handXy.y, 10, 0, Math.PI * 2);
        context.stroke();
    }
}