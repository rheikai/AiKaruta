import { karutas } from "./karutas";
import { Player } from "./Player";
import { fudaMatrix } from "./FudaMatrix";
import { config } from "./Config";
import { fudasOnField } from "./FudasOnField";

fudasOnField.selectFudasRandom();
let p1 = new Player();
let p2 = new Player();


const canvas: HTMLCanvasElement = document.querySelector<HTMLCanvasElement>('#tutorial')!;
const context = canvas.getContext('2d')!;
fudaMatrix.setFudaMatrixRandom(fudasOnField.getFudasP1(), fudasOnField.getFudasP2());
p1.setInitialHandPosition(0);
p2.setInitialHandPosition(config.FUDA_HEIGHT * config.N_FUDA_Y * 2 + config.MARGIN_Y1 * config.N_FUDA_Y * 2 + config.MARGIN_Y3 - config.MARGIN_Y1);
fudaMatrix.render(context);




function goNextFrame(targetFudaId: number, yomaretaStr: string, frame: number) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    fudaMatrix.render(context);

    p1.setNextHandPosition(yomaretaStr);
    p2.setNextHandPosition(yomaretaStr);

    p1.renderHand(context);
    p2.renderHand(context);

    if (fudaMatrix.fudaTaken(targetFudaId, p1.getHandPosition(), p2.getHandPosition()) === null && frame > 0) {
        setTimeout(goNextFrame, 1000 / config.FPS, targetFudaId, yomaretaStr, frame - 1);
    }
}

const yomare = fudasOnField.selectOneFudaRandom();
console.log("!!!!", yomare);
goNextFrame(yomare, karutas[yomare].kana.join(), 1000);
