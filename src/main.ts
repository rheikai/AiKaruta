import { karutas } from "./karutas";
import { config } from "./Config";
import { logger } from "./Logger";
import { PlayerHandXy } from "./PlayerHandXy";
import { FudasOnFieldMatrix } from "./FudasOnFieldMatrix";
import { KarutaLogicRandom } from "./KarutaLogics/KarutaLogicRandom";
import { KarutaLogicKanaDepthRowWeights } from "./KarutaLogics/KarutaLogicKanaDepthRowWeights";
import { KarutaLogicManual } from "./KarutaLogics/KarutaLogicManual";
import { KarutaLogicGeneticAlgorithm } from "./KarutaLogics/KarutaLogicGeneticAlgorithm";


const karutaField: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("#karuta_field")!;
karutaField.height = config.FIELD_HEIGHT() + 10;
karutaField.width = config.FIELD_WIDTH() + 10;
const context = karutaField.getContext("2d")!;

const player1Logic = new KarutaLogicGeneticAlgorithm(document.querySelector<HTMLTextAreaElement>("div#player1 > textarea#gene")!.value);
const player2Logic = new KarutaLogicGeneticAlgorithm(document.querySelector<HTMLTextAreaElement>("div#player2 > textarea#gene")!.value);

// const player1Logic = new KarutaLogicManual(
//     document.querySelector<HTMLDivElement>("div#player1 > div#message_box")!,
//     document.querySelector<HTMLTextAreaElement>("div#player1 > textarea#fudas_matrix")!,
//     document.querySelector<HTMLInputElement>("div#player1 > input#initial_hand_x")!,
//     document.querySelector<HTMLInputElement>("div#player1 > input#send_okurifuda_row")!,
//     document.querySelector<HTMLInputElement>("div#player1 > input#send_okurifuda_column")!,
//     document.querySelector<HTMLInputElement>("div#player1 > input#receive_okurifuda_row")!,
//     document.querySelector<HTMLInputElement>("div#player1 > input#receive_okurifuda_column")!,
//     document.querySelector<HTMLButtonElement>("div#player1 > button#submission_button")!
// );
// const player2Logic = new KarutaLogicManual(
//     document.querySelector<HTMLDivElement>("div#player2 > div#message_box")!,
//     document.querySelector<HTMLTextAreaElement>("div#player2 > textarea#fudas_matrix")!,
//     document.querySelector<HTMLInputElement>("div#player2 > input#initial_hand_x")!,
//     document.querySelector<HTMLInputElement>("div#player2 > input#send_okurifuda_row")!,
//     document.querySelector<HTMLInputElement>("div#player2 > input#send_okurifuda_column")!,
//     document.querySelector<HTMLInputElement>("div#player2 > input#receive_okurifuda_row")!,
//     document.querySelector<HTMLInputElement>("div#player2 > input#receive_okurifuda_column")!,
//     document.querySelector<HTMLButtonElement>("div#player2 > button#submission_button")!
// );

// const player1Logic = new KarutaLogicRandom();
// const player2Logic = new KarutaLogicRandom();

const fudasOnFieldMatrix = new FudasOnFieldMatrix(player1Logic, player2Logic);
const player1 = new PlayerHandXy(player1Logic);
const player2 = new PlayerHandXy(player2Logic);

let gameCount = 0;
let maxGameCount = 0;
let yomifudaId = -1;
let yomaretaStr = "";


function initializeGameState(): void {
    fudasOnFieldMatrix.setFudasMatrix().then(() => {
        fudasOnFieldMatrix.render(context);
        logger.newGame();
        gameCount++;

        startFudayomiState();
    });
}

async function startFudayomiState(): Promise<void> {

    yomifudaId = fudasOnFieldMatrix.selectOneFudaRandom()!;
    logger.setYomiuda(yomifudaId);

    await player1.setInitialHandXy(fudasOnFieldMatrix, false);
    await player2.setInitialHandXy(fudasOnFieldMatrix, true);
    logger.setHandXy(player1.getHandXy(), player2.getHandXy());

    fudasOnFieldMatrix.render(context);
    player1.renderHand(context);
    player2.renderHand(context);

    await fudayomiState(0);
}

async function fudayomiState(frame: number): Promise<void> {
    player1.setNextHandXy(yomaretaStr, fudasOnFieldMatrix);
    player2.setNextHandXy(yomaretaStr, fudasOnFieldMatrix);
    logger.setHandXy(player1.getHandXy(), player2.getHandXy());

    context.clearRect(0, 0, karutaField.width, karutaField.height);
    fudasOnFieldMatrix.render(context);
    player1.renderHand(context);
    player2.renderHand(context);


    const fudaWinner = fudasOnFieldMatrix.getFudaWinner(yomifudaId, player1.getHandXy(), player2.getHandXy());
    if (fudaWinner === null) {
        yomaretaStr = karutas[yomifudaId].kana.join("").substring(0, Math.ceil(frame * config.YOMI_CHAR_PER_FRAME()));
        setTimeout(await fudayomiState, 1000 / config.FPS() / config.PLAY_SPEED_RATIO(), frame + 1);
    } else {
        const takenFudaRow = fudasOnFieldMatrix.getFudaRowColumnFromFudaId(yomifudaId)!.row;
        if (fudaWinner === 1 && takenFudaRow >= config.N_FUDA_Y() / 2) {
            await fudasOnFieldMatrix.okurifudaFrom(1);
        } else if (fudaWinner === 2 && takenFudaRow < config.N_FUDA_Y() / 2) {
            await fudasOnFieldMatrix.okurifudaFrom(2);
        }

        fudasOnFieldMatrix.removeFuda(yomifudaId);
        logger.setFudaWinner(fudaWinner);

        const winner = fudasOnFieldMatrix.getGameWinner();
        if (winner === null) {
            await startFudayomiState();
        } else {
            await endFudayomiState(winner);
        }
    }
}

async function endFudayomiState(winner: number): Promise<void> {
    logger.setGameWinner(winner);

    if (gameCount < maxGameCount) {
        await initializeGameState();
    } else {
        document.querySelector<HTMLTextAreaElement>("#games_log")!.value = logger.toString();
        console.log(logger.getWinCount());
    }
}

document.querySelector("#start_games")?.addEventListener("click", () => {

    document.querySelector<HTMLTextAreaElement>("#games_log")!.value = "";
    maxGameCount = Number.parseInt(document.querySelector<HTMLInputElement>("#max_game_count")!.value);
    gameCount = 0;
    logger.clear();
    console.log("NEW GAMES!");
    initializeGameState();
});
