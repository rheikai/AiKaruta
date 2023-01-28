class Config {
    public constructor() {

    }
    // px
    DISPLAY_X = 800;
    DISPLAY_Y = 600;

    // mm
    FUDA_WIDTH = 52;
    FUDA_HEIGHT = 73;

    MARGIN_X = 0;
    MARGIN_Y1 = 15.1;
    MARGIN_Y3 = 45.3;

    N_FUDA_X = 12;
    N_FUDA_Y = 3;

    // Hz
    FPS = 10;
    // mm
    HAND_DISPLACEMENT_PER_SEC = 400;
}

export let config = new Config();
