import { KarutaLogic } from "./KarutaLogic";
import { config } from "../Config";

export class KarutaLogicManual extends KarutaLogic {
    private _messageBox: HTMLDivElement;
    private _fudasMatrixTextarea: HTMLTextAreaElement;
    private _initialHandXInput: HTMLInputElement;
    private _sendOkurifudaRowInput: HTMLInputElement;
    private _sendOkurifudaColumnInput: HTMLInputElement;
    private _receiveOkurifudaRowInput: HTMLInputElement;
    private _receiveOkurifudaColumnInput: HTMLInputElement;
    private _submissionButton: HTMLButtonElement;

    public constructor(messageBox: HTMLDivElement,
        fudasMatrixTextarea: HTMLTextAreaElement,
        initialHandXInput: HTMLInputElement,
        sendOkurifudaRowInput: HTMLInputElement, sendOkurifudaColumnInput: HTMLInputElement,
        receiveOkurifudaRowInput: HTMLInputElement, receiveOkurifudaColumnInput: HTMLInputElement,
        submissionButton: HTMLButtonElement) {
        super();
        this._messageBox = messageBox;
        this._fudasMatrixTextarea = fudasMatrixTextarea;
        this._initialHandXInput = initialHandXInput;
        this._sendOkurifudaRowInput = sendOkurifudaRowInput;
        this._sendOkurifudaColumnInput = sendOkurifudaColumnInput;
        this._receiveOkurifudaRowInput = receiveOkurifudaRowInput;
        this._receiveOkurifudaColumnInput = receiveOkurifudaColumnInput;
        this._submissionButton = submissionButton;
    }

    public override async initialHandXy(fudasMatrix: number[][]): Promise<{ x: number, y: number }> {
        this._messageBox.innerText = "initialHandXy";

        return this.getEventHandler(() => {
            return { x: Number.parseFloat(this._initialHandXInput.value), y: 0 };
        });
    }

    public override async fudasMatrix(myFudas: number[], opponentFudas: number[]): Promise<number[][]> {
        let fudasMatrix: number[][] = await super.fudasMatrix(myFudas, opponentFudas);

        let myFudasTmp = myFudas.slice();
        let opponentFudasTmp = opponentFudas.slice();

        for (let row = 0; row < config.N_FUDA_Y() / 2; row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                fudasMatrix[row][column] = myFudasTmp[0];
                myFudasTmp = myFudasTmp.slice(1);
                if (myFudasTmp.length === 0) {
                    break;
                }
            }
            if (myFudasTmp.length === 0) {
                break;
            }
        }

        for (let row = config.N_FUDA_Y() / 2; row < config.N_FUDA_Y(); row++) {
            for (let column = 0; column < config.N_FUDA_X(); column++) {
                fudasMatrix[row][column] = opponentFudasTmp[0];
                opponentFudasTmp = opponentFudasTmp.slice(1);
                if (opponentFudasTmp.length === 0) {
                    break;
                }
            }
            if (opponentFudasTmp.length === 0) {
                break;
            }
        }

        this._messageBox.innerText = "fudasMatrix";
        this.showFudaxMatrixInTextarea(fudasMatrix);

        return this.getEventHandler(() => {
            const fudasMatrixStr = this._fudasMatrixTextarea.value;
            let lines = fudasMatrixStr.split("\n");
            for (let row = 0; row < lines.length; row++) {
                const cells = lines[row].split("\t");
                for (let column = 0; column < cells.length; column++) {
                    fudasMatrix[row][column] = Number.parseInt(cells[column]);
                }
            }
            this._fudasMatrixTextarea.value = "";
            return fudasMatrix;
        });
    }

    public override async sendOkurifuda(fudasMatrix: number[][]): Promise<{ row: number, column: number }> {
        this.showFudaxMatrixInTextarea(fudasMatrix);
        this._messageBox.innerText = "sendOkurifuda";

        return this.getEventHandler(() => {
            return { row: Number.parseFloat(this._sendOkurifudaRowInput.value), column: Number.parseInt(this._sendOkurifudaColumnInput.value) };
        });
    }

    public override async receiveOkurifuda(fudasMatrix: number[][], sentFuda: { row: number, column: number }): Promise<{ row: number, column: number }> {
        this.showFudaxMatrixInTextarea(fudasMatrix);
        this._messageBox.innerText = "receiveOkurifuda";

        this._sendOkurifudaRowInput.value = sentFuda.row.toString();
        this._sendOkurifudaColumnInput.value = sentFuda.row.toString();

        return this.getEventHandler(() => {
            return { row: Number.parseFloat(this._receiveOkurifudaRowInput.value), column: Number.parseInt(this._receiveOkurifudaColumnInput.value) };
        });
    }

    private getEventHandler<T>(callback: Function): Promise<T> {
        return new Promise((res, rej) => {
            const button = this._submissionButton;
            const handler = () => {
                button.removeEventListener("click", handler);
                this._messageBox.innerText = "";

                res(callback());
            };
            button.addEventListener("click", handler);
        });
    }

    private showFudaxMatrixInTextarea(fudasMatrix: number[][]): void {
        let fudasMatrixStr = "";
        for (let row = 0; row < config.N_FUDA_Y(); row++) {
            fudasMatrixStr += fudasMatrix[row].join("\t") + "\n";
        }
        fudasMatrixStr = fudasMatrixStr.substring(0, fudasMatrixStr.length - 1);
        this._fudasMatrixTextarea.value = fudasMatrixStr;
    }
}
