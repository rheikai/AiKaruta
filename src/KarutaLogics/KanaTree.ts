export class KanaTree {
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
