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

    private _PLAY_SPEED_RATIO = 100;

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

    public HAND_DISPLACEMENT_PER_SEC(): number {
        return this._HAND_DISPLACEMENT_PER_SEC;
    }

    public setHAND_DISPLACEMENT_PER_SEC(value: number): void {
        this._HAND_DISPLACEMENT_PER_SEC = value;
    }
}

export const config = new Config();
