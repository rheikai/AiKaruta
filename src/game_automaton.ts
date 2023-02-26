import { karutas } from "./karutas";
import { logger } from "./Logger";
import { GameConfig } from "./GameConfig";
import { config } from "./Config";

let yomifudaId = -1;
let yomaretaStr = "";

export async function runGames(maxGameCount: number): Promise<void> {
    for (let i = 0; i < maxGameCount; i++) {
        console.log(i);
        await initializeGameState();
    }
}

async function initializeGameState(): Promise<void> {
    await GameConfig.fudasOnFieldMatrix().setFudasMatrix();
    if (!GameConfig.nodejs()) {
        GameConfig.fudasOnFieldMatrix().render(GameConfig.renderingContext()!);
    }
    logger.newGame();

    await startFudayomiState();
}

async function startFudayomiState(): Promise<void> {

    yomifudaId = GameConfig.fudasOnFieldMatrix().selectOneFudaRandom()!;
    logger.setYomiuda(yomifudaId);

    await GameConfig.player1Hand().setInitialHandXy(GameConfig.fudasOnFieldMatrix(), false);
    await GameConfig.player2Hand().setInitialHandXy(GameConfig.fudasOnFieldMatrix(), true);
    logger.setHandXy(GameConfig.player1Hand().getHandXy(), GameConfig.player2Hand().getHandXy());

    if (!GameConfig.nodejs()) {
        GameConfig.fudasOnFieldMatrix().render(GameConfig.renderingContext()!);
        GameConfig.player1Hand().renderHand(GameConfig.renderingContext()!);
        GameConfig.player2Hand().renderHand(GameConfig.renderingContext()!);
    }

    await fudayomiState(0);
}

async function fudayomiState(frame: number): Promise<void> {
    GameConfig.player1Hand().setNextHandXy(yomaretaStr, GameConfig.fudasOnFieldMatrix());
    GameConfig.player2Hand().setNextHandXy(yomaretaStr, GameConfig.fudasOnFieldMatrix());
    logger.setHandXy(GameConfig.player1Hand().getHandXy(), GameConfig.player2Hand().getHandXy());

    if (!GameConfig.nodejs()) {
        GameConfig.renderingContext()!.clearRect(0, 0, 99999, 99999);
        GameConfig.fudasOnFieldMatrix().render(GameConfig.renderingContext()!);
        GameConfig.player1Hand().renderHand(GameConfig.renderingContext()!);
        GameConfig.player2Hand().renderHand(GameConfig.renderingContext()!);
    }


    const fudaWinner = GameConfig.fudasOnFieldMatrix().getFudaWinner(yomifudaId, GameConfig.player1Hand().getHandXy(), GameConfig.player2Hand().getHandXy());
    if (fudaWinner === null) {
        yomaretaStr = karutas[yomifudaId].kana.join("").substring(0, Math.ceil(frame * config.YOMI_CHAR_PER_FRAME()));
        if (!GameConfig.nodejs()) {
            await new Promise(res => setTimeout(res, 1000 / config.FPS() / config.PLAY_SPEED_RATIO()));
        }
        await fudayomiState(frame + 1);
    } else {
        const takenFudaRow = GameConfig.fudasOnFieldMatrix().getFudaRowColumnFromFudaId(yomifudaId)!.row;
        if (fudaWinner === 1 && takenFudaRow >= config.N_FUDA_Y() / 2) {
            await GameConfig.fudasOnFieldMatrix().okurifudaFrom(1);
        } else if (fudaWinner === 2 && takenFudaRow < config.N_FUDA_Y() / 2) {
            await GameConfig.fudasOnFieldMatrix().okurifudaFrom(2);
        }

        GameConfig.fudasOnFieldMatrix().removeFuda(yomifudaId);
        logger.setFudaWinner(fudaWinner);

        const winner = GameConfig.fudasOnFieldMatrix().getGameWinner();
        if (winner === null) {
            await startFudayomiState();
        } else {
            endGameState(winner);
        }
    }
}

function endGameState(winner: number): void {
    logger.setGameWinner(winner);
}

