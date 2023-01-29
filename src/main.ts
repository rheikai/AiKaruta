import { karutas } from "./karutas";
import { PlayerHandXy } from "./PlayerHandXy";
import { FudasOnFieldMatrix } from "./FudasOnFieldMatrix";
import { config } from "./Config";
import { KarutaLogicRandom } from "./KarutaLogics/KarutaLogicRandom";


const karutaField: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("#karuta_field")!;
const context = karutaField.getContext("2d")!;


const fudasOnFieldMatrix = new FudasOnFieldMatrix(new KarutaLogicRandom());
let player1 = new PlayerHandXy(new KarutaLogicRandom());
let player2 = new PlayerHandXy(new KarutaLogicRandom());

fudasOnFieldMatrix.setFudasMatrix();
fudasOnFieldMatrix.render(context);


function goNextFrame(targetFudaId: number, yomaretaStr: string) {
    player1.setNextHandXy(yomaretaStr, fudasOnFieldMatrix);
    player2.setNextHandXy(yomaretaStr, fudasOnFieldMatrix);

    context.clearRect(0, 0, karutaField.width, karutaField.height);
    fudasOnFieldMatrix.render(context);
    player1.renderHand(context);
    player2.renderHand(context);

    const fudaTaken = fudasOnFieldMatrix.fudaTaken(targetFudaId, player1.getHandXy(), player2.getHandXy());
    if (fudaTaken === null) {
        setTimeout(goNextFrame, 1000 / config.FPS() / config.PLAY_SPEED_RATIO(), targetFudaId, yomaretaStr);
    } else {
        const takenFudaRow = fudasOnFieldMatrix.getFudaRowColumnFromFudaId(targetFudaId)!.row;
        if (fudaTaken === 1 && takenFudaRow > config.N_FUDA_Y() / 2) {
            fudasOnFieldMatrix.okurifuda(1, 2);
        } else if (fudaTaken === 2 && takenFudaRow <= config.N_FUDA_Y() / 2) {
            fudasOnFieldMatrix.okurifuda(2, 1);
        }

        fudasOnFieldMatrix.removeFuda(targetFudaId);

        const winner = fudasOnFieldMatrix.getWinner();
        if (winner === null) {
            goNextYomifuda();
        } else {
            alert(`おわり！　${winner}の勝ち！`);
            fudasOnFieldMatrix.setFudasMatrix();
            fudasOnFieldMatrix.render(context);

            goNextYomifuda();
        }
    }
}

function goNextYomifuda() {
    player1.setInitialHandXy(0, fudasOnFieldMatrix.getFudasMatrix());
    player2.setInitialHandXy(config.FUDA_HEIGHT() * config.N_FUDA_Y() + config.MARGIN_Y1() * config.N_FUDA_Y() + config.MARGIN_Y3() - config.MARGIN_Y1(), fudasOnFieldMatrix.getFudasMatrix());

    fudasOnFieldMatrix.render(context);
    player1.renderHand(context);
    player2.renderHand(context);

    const targetFudaId = fudasOnFieldMatrix.selectOneFudaRandom()!;
    goNextFrame(targetFudaId, karutas[targetFudaId].kana.join(""));
}

document.querySelector("#b")?.addEventListener("click", () => {
    goNextYomifuda();
});

