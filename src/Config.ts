class Config {
    public constructor() {

    }
    // mm
    private _FUDA_WIDTH = 52;
    private _FUDA_HEIGHT = 73;

    private _MARGIN_X = 0;
    private _MARGIN_Y1 = 15.1;
    private _MARGIN_Y3 = 45.3;

    private _N_FUDA_X = 12;
    private _N_FUDA_Y = 6;

    // Hz
    private _FPS = 10;

    private _PLAY_SPEED_RATIO = Infinity;

    private _YOMI_CHAR_PER_FRAME = 0.5;

    // mm
    private _HAND_DISPLACEMENT_PER_SEC = 400;


    public FUDA_WIDTH(): number {
        return this._FUDA_WIDTH;
    }

    public FUDA_HEIGHT(): number {
        return this._FUDA_HEIGHT;
    }

    public MARGIN_X(): number {
        return this._MARGIN_X;
    }

    public MARGIN_Y1(): number {
        return this._MARGIN_Y1;
    }

    public MARGIN_Y3(): number {
        return this._MARGIN_Y3;
    }

    public FIELD_WIDTH(): number {
        return this.FUDA_WIDTH() * this.N_FUDA_X() + this.MARGIN_X() * (this.N_FUDA_X() - 1);
    }

    public FIELD_HEIGHT(): number {
        return this.FUDA_HEIGHT() * this.N_FUDA_Y() + this.MARGIN_Y1() * (this.N_FUDA_Y() - 1) + this.MARGIN_Y3() - this.MARGIN_Y1();
    }

    public N_FUDA_X(): number {
        return this._N_FUDA_X;
    }

    public N_FUDA_Y(): number {
        return this._N_FUDA_Y;
    }

    public FPS(): number {
        return this._FPS;
    }

    public setFPS(value: number): void {
        this._FPS = value;
    }

    public PLAY_SPEED_RATIO(): number {
        return this._PLAY_SPEED_RATIO;
    }

    public setPLAY_SPEED_RATIO(value: number): void {
        this._PLAY_SPEED_RATIO = value;
    }

    public YOMI_CHAR_PER_FRAME(): number {
        return this._YOMI_CHAR_PER_FRAME;
    }

    public HAND_DISPLACEMENT_PER_SEC(): number {
        return this._HAND_DISPLACEMENT_PER_SEC;
    }

    public setHAND_DISPLACEMENT_PER_SEC(value: number): void {
        this._HAND_DISPLACEMENT_PER_SEC = value;
    }
}

export const config = new Config();
