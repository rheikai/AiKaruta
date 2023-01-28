import { karutas } from "./karutas";

class FudasOnField {
    private _fudasP1: number[];
    private _fudasP2: number[];
    public constructor() {
        this._fudasP1 = [];
        this._fudasP2 = [];
    }

    public getFudasP1(): number[] {
        return this._fudasP1.slice();
    }

    public getFudasP2(): number[] {
        return this._fudasP2.slice();
    }

    public selectFudasRandom(): void {
        this._fudasP1 = [];
        this._fudasP2 = [];

        let fudaIds = [];
        for (let i = 0; i < karutas.length; i++) {
            fudaIds.push(i);
        }

        for (let i = 0; i < 25; i++) {
            const idx = Math.floor(Math.random() * fudaIds.length);
            this._fudasP1.push(fudaIds[idx]);
            fudaIds.splice(idx, 1);
        }

        for (let i = 0; i < 25; i++) {
            const idx = Math.floor(Math.random() * fudaIds.length);
            this._fudasP2.push(fudaIds[idx]);
            fudaIds.splice(idx, 1);
        }
    }

    public selectOneFudaRandom(): number {
        const rand = Math.floor(Math.random() * (this._fudasP1.length + this._fudasP2.length));
        if (rand < this._fudasP1.length) {
            return this._fudasP1[rand];
        } else {
            return this._fudasP2[rand - this._fudasP1.length];
        }
    }

    public removeFuda(fudaId: number): void {
        let idx = this._fudasP1.findIndex(id => id === fudaId);
        if (idx !== -1) {
            this._fudasP1.splice(idx, 1);
        } else {
            idx = this._fudasP2.findIndex(id => id === fudaId);
            if (idx !== -1) {
                this._fudasP2.splice(idx, 1);
            }
        }
    }
}

export let fudasOnField = new FudasOnField();
