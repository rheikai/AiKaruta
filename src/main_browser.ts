import { config } from "./Config";
import { logger } from "./Logger";
import { KarutaLogicRandom } from "./KarutaLogics/KarutaLogicRandom";
import { GameConfig } from "./GameConfig";
import { runGames } from "./game_automaton";

const karutaField = document.querySelector<HTMLCanvasElement>("#karuta_field")!;
karutaField!.height = config.FIELD_HEIGHT() + 10;
karutaField!.width = config.FIELD_WIDTH() + 10;
const context = karutaField!.getContext("2d")!;

const player1Logic = new KarutaLogicRandom();
const player2Logic = new KarutaLogicRandom();


document.querySelector("#start_games")?.addEventListener("click", () => {
    document.querySelector<HTMLTextAreaElement>("#games_log")!.value = "";
    const maxGameCount = Number.parseInt(document.querySelector<HTMLInputElement>("#max_game_count")!.value);
    GameConfig.initialize(false, context, player1Logic, player2Logic);

    logger.clear();
    console.log("NEW GAMES!");
    runGames(maxGameCount).then(() => {
        document.querySelector<HTMLTextAreaElement>("#games_log")!.value = logger.toString();
        console.log(logger.getWinCount());
    });
});
