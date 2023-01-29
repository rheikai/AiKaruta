class Logger {
    private _logs: {
        winner: number,
        yomifudas: {
            id: number,
            winner: number,
            handXys: {
                player1: { x: number, y: number },
                player2: { x: number, y: number }
            }[]
        }[]
    }[] = [];
    public constructor() {
    }

    public newGame(): void {
        this._logs.push({
            winner: -1,
            yomifudas: []
        });
    }

    public setYomiuda(fudaId: number): void {
        this._logs[this._logs.length - 1].yomifudas.push({
            id: fudaId,
            winner: -1,
            handXys: []
        });
        console.log(this._logs);
    }

    public setHandXy(player1: { x: number, y: number }, player2: { x: number, y: number }): void {
        const currentFrameIndex = this._logs[this._logs.length - 1].yomifudas.length - 1;
        this._logs[this._logs.length - 1].yomifudas[currentFrameIndex].handXys.push({ player1: player1, player2: player2 });
    }

    public setFudaWinner(player: number): void {
        const currentFrameIndex = this._logs[this._logs.length - 1].yomifudas.length - 1;
        this._logs[this._logs.length - 1].yomifudas[currentFrameIndex].winner = player;
    }

    public setGameWinner(player: number): void {
        this._logs[this._logs.length - 1].winner = player;
    }
}

export const logger = new Logger();
