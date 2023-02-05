import { karutas } from "./karutas";
import { PlayerHandXy } from "./PlayerHandXy";
import { FudasOnFieldMatrix } from "./FudasOnFieldMatrix";
import { config } from "./Config";
import { KarutaLogicRandom } from "./KarutaLogics/KarutaLogicRandom";
import { logger } from "./Logger";
import { KarutaLogicKanaDepthRowWeights } from "./KarutaLogics/KarutaLogicKanaDepthRowWeights";


const karutaField: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("#karuta_field")!;
karutaField.height = config.FIELD_HEIGHT() + 10;
karutaField.width = config.FIELD_WIDTH() + 10;
const context = karutaField.getContext("2d")!;

const player1Logic = new KarutaLogicKanaDepthRowWeights(
    [120, 80, 60, 50, 40, 30, 20, 10, 0, 0, 0, 0, 0, 0],
    [1.2, 1.1, 1, 1, 0.9, 0.7]);
const player2Logic = new KarutaLogicRandom();

const fudasOnFieldMatrix = new FudasOnFieldMatrix(player1Logic, player2Logic);
let player1 = new PlayerHandXy(player1Logic);
let player2 = new PlayerHandXy(player2Logic);

fudasOnFieldMatrix.setFudasMatrix();
fudasOnFieldMatrix.render(context);

let gameCount = 0;
let maxGameCount = Number.parseInt(document.querySelector<HTMLInputElement>("#max_game_count")!.value);

function goNextFrame(yomifudaId: number, yomaretaStr: string, frame: number) {
    player1.setNextHandXy(yomaretaStr, fudasOnFieldMatrix);
    player2.setNextHandXy(yomaretaStr, fudasOnFieldMatrix);
    logger.setHandXy(player1.getHandXy(), player2.getHandXy());

    context.clearRect(0, 0, karutaField.width, karutaField.height);
    fudasOnFieldMatrix.render(context);
    player1.renderHand(context);
    player2.renderHand(context);

    const fudaWinner = fudasOnFieldMatrix.getFudaWinner(yomifudaId, player1.getHandXy(), player2.getHandXy());
    if (fudaWinner === null) {
        setTimeout(goNextFrame, 1000 / config.FPS() / config.PLAY_SPEED_RATIO(), yomifudaId, karutas[yomifudaId].kana.join("").substring(0, Math.ceil((1000 - frame) * config.YOMI_CHAR_PER_FRAME())), frame - 1);
    } else {
        const takenFudaRow = fudasOnFieldMatrix.getFudaRowColumnFromFudaId(yomifudaId)!.row;
        if (fudaWinner === 1 && takenFudaRow >= config.N_FUDA_Y() / 2) {
            fudasOnFieldMatrix.okurifudaFrom(1);
        } else if (fudaWinner === 2 && takenFudaRow < config.N_FUDA_Y() / 2) {
            fudasOnFieldMatrix.okurifudaFrom(2);
        }

        fudasOnFieldMatrix.removeFuda(yomifudaId);
        logger.setFudaWinner(fudaWinner);

        const winner = fudasOnFieldMatrix.getGameWinner();
        if (winner === null) {
            goNextYomifuda();
        } else {
            logger.setGameWinner(winner);
            fudasOnFieldMatrix.setFudasMatrix();
            fudasOnFieldMatrix.render(context);

            if (gameCount < maxGameCount) {
                gameCount++;
                logger.newGame();
                goNextYomifuda();
            } else {
                document.querySelector<HTMLTextAreaElement>("#game_logs")!.value = logger.toString();
                console.log(logger.getWinCount());
                document.querySelector<HTMLButtonElement>("#start_games")?.click();
            }
        }
    }
}

function goNextYomifuda() {
    const yomifudaId = fudasOnFieldMatrix.selectOneFudaRandom()!;
    logger.setYomiuda(yomifudaId);

    player1.setInitialHandXy(fudasOnFieldMatrix, false);
    player2.setInitialHandXy(fudasOnFieldMatrix, true);
    logger.setHandXy(player1.getHandXy(), player2.getHandXy());

    fudasOnFieldMatrix.render(context);
    player1.renderHand(context);
    player2.renderHand(context);

    goNextFrame(yomifudaId, "", 1000);
}

document.querySelector("#start_games")?.addEventListener("click", () => {
    gameCount = 0;
    gameCount++;
    logger.clear();
    document.querySelector<HTMLTextAreaElement>("#game_logs")!.value = "";
    maxGameCount = Number.parseInt(document.querySelector<HTMLInputElement>("#max_game_count")!.value);
    logger.newGame();
    console.log("NEW GAME!");
    goNextYomifuda();
});

