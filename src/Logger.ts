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
    }[];
    public constructor() {
        this._logs = [];
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

    public getWinCount(): { player1: number, player2: number } {
        let winCountPlayer1 = 0;
        let winCountPlayer2 = 0;
        for (let game of this._logs) {
            if (game.winner === 1) {
                winCountPlayer1++;
            } else {
                winCountPlayer2++;
            }
        }
        return { player1: winCountPlayer1, player2: winCountPlayer2 };
    }

    public toString(): string {
        return JSON.stringify(this._logs);
    }

    public clear(): void {
        this._logs = [];
    }
}

export const logger = new Logger();
