import { karutas } from "./karutas";
import { PlayerHandXy } from "./PlayerHandXy";
import { FudasOnFieldMatrix } from "./FudasOnFieldMatrix";
import { config } from "./Config";
import { KarutaLogicRandom } from "./KarutaLogics/KarutaLogicRandom";
import { logger } from "./Logger";


const karutaField: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("#karuta_field")!;
const context = karutaField.getContext("2d")!;


const fudasOnFieldMatrix = new FudasOnFieldMatrix(new KarutaLogicRandom());
let player1 = new PlayerHandXy(new KarutaLogicRandom());
let player2 = new PlayerHandXy(new KarutaLogicRandom());

fudasOnFieldMatrix.setFudasMatrix();
fudasOnFieldMatrix.render(context);

let game_count = 0;
const MAX_GAME_COUNT = Number.parseInt(document.querySelector<HTMLInputElement>("#max_game_count")!.value);

function goNextFrame(yomifudaId: number, yomaretaStr: string) {
    player1.setNextHandXy(yomaretaStr, fudasOnFieldMatrix);
    player2.setNextHandXy(yomaretaStr, fudasOnFieldMatrix);
    logger.setHandXy(player1.getHandXy(), player2.getHandXy());

    context.clearRect(0, 0, karutaField.width, karutaField.height);
    fudasOnFieldMatrix.render(context);
    player1.renderHand(context);
    player2.renderHand(context);

    const fudaWinner = fudasOnFieldMatrix.getFudaWinner(yomifudaId, player1.getHandXy(), player2.getHandXy());
    if (fudaWinner === null) {
        setTimeout(goNextFrame, 1000 / config.FPS() / config.PLAY_SPEED_RATIO(), yomifudaId, yomaretaStr);
    } else {
        const takenFudaRow = fudasOnFieldMatrix.getFudaRowColumnFromFudaId(yomifudaId)!.row;
        if (fudaWinner === 1 && takenFudaRow > config.N_FUDA_Y() / 2) {
            fudasOnFieldMatrix.okurifuda(1, 2);
        } else if (fudaWinner === 2 && takenFudaRow <= config.N_FUDA_Y() / 2) {
            fudasOnFieldMatrix.okurifuda(2, 1);
        }

        fudasOnFieldMatrix.removeFuda(yomifudaId);
        logger.setFudaWinner(fudaWinner);

        const winner = fudasOnFieldMatrix.getGameWinner();
        if (winner === null) {
            goNextYomifuda();
        } else {
            logger.setGameWinner(winner);
            console.log(`${winner}の勝ち！`);
            fudasOnFieldMatrix.setFudasMatrix();
            fudasOnFieldMatrix.render(context);

            if (game_count < MAX_GAME_COUNT) {
                game_count++;
                logger.newGame();
                goNextYomifuda();
            } else {
                document.querySelector<HTMLTextAreaElement>("#game_logs")!.value = logger.toString();
            }
        }
    }
}

function goNextYomifuda() {
    const yomifudaId = fudasOnFieldMatrix.selectOneFudaRandom()!;
    logger.setYomiuda(yomifudaId);

    player1.setInitialHandXy(0, fudasOnFieldMatrix.getFudasMatrix());
    player2.setInitialHandXy(config.FUDA_HEIGHT() * config.N_FUDA_Y() + config.MARGIN_Y1() * config.N_FUDA_Y() + config.MARGIN_Y3() - config.MARGIN_Y1(), fudasOnFieldMatrix.getFudasMatrix());
    logger.setHandXy(player1.getHandXy(), player2.getHandXy());

    fudasOnFieldMatrix.render(context);
    player1.renderHand(context);
    player2.renderHand(context);

    goNextFrame(yomifudaId, karutas[yomifudaId].kana.join(""));
}

document.querySelector("#start_games")?.addEventListener("click", () => {
    game_count++;
    logger.newGame();
    goNextYomifuda();
});

