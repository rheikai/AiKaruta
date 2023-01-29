import { karutas } from "./karutas";
import { PlayerHandXy } from "./PlayerHandXy";
import { fudasOnFieldMatrix } from "./FudasOnFieldMatrix";
import { config } from "./Config";


let p1 = new PlayerHandXy();
let p2 = new PlayerHandXy();

const karutaField: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>("#karuta_field")!;
const context = karutaField.getContext("2d")!;

fudasOnFieldMatrix.setFudaMatrixRandom();
fudasOnFieldMatrix.render(context);


function goNextFrame(targetFudaId: number, yomaretaStr: string) {
    p1.setNextHandXy(yomaretaStr);
    p2.setNextHandXy(yomaretaStr);

    context.clearRect(0, 0, karutaField.width, karutaField.height);
    fudasOnFieldMatrix.render(context);
    p1.renderHand(context);
    p2.renderHand(context);

    if (fudasOnFieldMatrix.fudaTaken(targetFudaId, p1.getHandXy(), p2.getHandXy()) === null) {
        setTimeout(goNextFrame, 1000 / config.FPS() / config.PLAY_SPEED_RATIO(), targetFudaId, yomaretaStr);
    } else {
        fudasOnFieldMatrix.removeFuda(targetFudaId);
        goNextYomifuda();
    }
}

function goNextYomifuda() {
    p1.setInitialHandXy(0);
    p2.setInitialHandXy(config.FUDA_HEIGHT() * config.N_FUDA_Y() + config.MARGIN_Y1() * config.N_FUDA_Y() + config.MARGIN_Y3() - config.MARGIN_Y1());

    fudasOnFieldMatrix.render(context);
    p1.renderHand(context);
    p2.renderHand(context);

    const targetFudaId = fudasOnFieldMatrix.selectOneFudaRandom();
    if (targetFudaId === null) {
        alert("おわり！");
        fudasOnFieldMatrix.setFudaMatrixRandom();
        fudasOnFieldMatrix.render(context);
    } else {
        goNextFrame(targetFudaId, karutas[targetFudaId].kana.join(""));
    }
}

document.querySelector("#b")?.addEventListener("click", () => {
    goNextYomifuda();
});

