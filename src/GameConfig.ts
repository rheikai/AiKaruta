import { FudasOnFieldMatrix } from "./FudasOnFieldMatrix";
import { KarutaLogic } from "./KarutaLogics/KarutaLogic";
import { PlayerHandXy } from "./PlayerHandXy";

export class GameConfig {
    private static _instance: GameConfig;

    private _nodejs: boolean;
    private _renderingContext: CanvasRenderingContext2D | null;

    private _fudasOnFieldMatrix: FudasOnFieldMatrix;
    private _player1Hand: PlayerHandXy;
    private _player2Hand: PlayerHandXy;

    private constructor(nodejs: boolean, renderingContext: CanvasRenderingContext2D | null, player1Logic: KarutaLogic, player2Logic: KarutaLogic) {
        this._nodejs = nodejs;
        this._renderingContext = renderingContext;

        this._fudasOnFieldMatrix = new FudasOnFieldMatrix(player1Logic, player2Logic);
        this._player1Hand = new PlayerHandXy(player1Logic);
        this._player2Hand = new PlayerHandXy(player2Logic);
    }

    public static initialize(nodejs: boolean, renderingContext: CanvasRenderingContext2D | null, player1Logic: KarutaLogic, player2Logic: KarutaLogic): void {
        GameConfig._instance = new GameConfig(nodejs, renderingContext, player1Logic, player2Logic);
    }

    public static nodejs(): boolean {
        return GameConfig._instance._nodejs;
    }

    public static renderingContext(): CanvasRenderingContext2D | null {
        return GameConfig._instance._renderingContext;
    }

    public static fudasOnFieldMatrix(): FudasOnFieldMatrix {
        return GameConfig._instance._fudasOnFieldMatrix;
    }

    public static player1Hand(): PlayerHandXy {
        return GameConfig._instance._player1Hand;
    }

    public static player2Hand(): PlayerHandXy {
        return GameConfig._instance._player2Hand;
    }
}
