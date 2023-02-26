import { logger } from "./Logger";
import { GameConfig } from "./GameConfig";
import { runGames } from "./game_automaton";
import { KarutaLogicGeneticAlgorithm } from "./KarutaLogics/KarutaLogicGeneticAlgorithm";
import * as fs from "fs";

let player1GeneFilepath = process.argv[2];
let player2GeneFilepath = process.argv[3];
let gamesLogFilepath = process.argv[4];

const player1Logic = new KarutaLogicGeneticAlgorithm(fs.readFileSync(player1GeneFilepath, "utf-8").trim());
const player2Logic = new KarutaLogicGeneticAlgorithm(fs.readFileSync(player2GeneFilepath, "utf-8").trim());

GameConfig.initialize(true, null, player1Logic, player2Logic);

logger.clear();
runGames(20).then(() => {
    fs.writeFileSync(gamesLogFilepath, logger.toString());
});
