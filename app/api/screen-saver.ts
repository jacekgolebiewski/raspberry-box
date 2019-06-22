import { Inject } from 'typescript-ioc';
import { LedMatrixService } from '../service/integration/ledmatrix/led-matrix-service';
import { Component } from '../component/component';

@Component.default
export class ScreenSaver {

    SCREEN_SAVER_TEXT = "confitura2019 with ISOLUTION GAME BOX";
    MIN_BRIGHTNESS = 0;
    MAX_BRIGHTNESS = 15;

    @Inject private ledMatrixService: LedMatrixService;

    private enabled: boolean = false;
    private interval;
    private brightness: number = this.MIN_BRIGHTNESS;
    private textIndex = 0;

    enable() {
        this.enabled = true;
        this.interval = setInterval(() => {
            this.nextScreenSaverStep();
        }, 100)
    }

    private nextScreenSaverStep() {
        this.brightness = (this.brightness + 1) % (this.MAX_BRIGHTNESS + 1);
        if (this.brightness === 0) {
            this.textIndex += 1;
        }
        this.ledMatrixService.setBrightness(this.brightness);
        this.ledMatrixService.char(this.SCREEN_SAVER_TEXT[this.textIndex]);
    }

    disable() {
        this.enabled = false;
        clearInterval(this.interval);
    }
}
