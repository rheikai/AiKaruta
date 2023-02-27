import { logger } from "./Logger";
import { GameConfig } from "./GameConfig";
import { runGames } from "./game_automaton";
import { KarutaLogicRandom } from "./KarutaLogics/KarutaLogicRandom";
import { KarutaLogicGeneticAlgorithm } from "./KarutaLogics/KarutaLogicGeneticAlgorithm";

const karutaField = document.querySelector<HTMLCanvasElement>("#karuta_field")!;
const context = karutaField!.getContext("2d")!;

const player1Logic = new KarutaLogicRandom();
const player2Logic = new KarutaLogicGeneticAlgorithm(document.querySelector<HTMLTextAreaElement>("div#player2_interactive > textarea")!.value);


document.querySelector("#start_games")?.addEventListener("click", () => {
    document.querySelector<HTMLTextAreaElement>("#games_log")!.value = "";
    const maxGameCount = Number.parseInt(document.querySelector<HTMLInputElement>("#max_game_count")!.value);
    GameConfig.initialize(false, context, player1Logic, player2Logic);
    logger.clear();
    runGames(maxGameCount).then(() => {
        document.querySelector<HTMLTextAreaElement>("#games_log")!.value = logger.toString();
    });
});
