import { Inject } from 'typescript-ioc';
import { LedMatrixService } from '../service/integration/ledmatrix/led-matrix-service';
import { Component } from '../component/component';

@Component.default
export class ScreenSaver {

    SCREEN_SAVER_TEXT = "confitura2019 ISOLUTION GAME BOX Zapraszamy   ";
    @Inject private ledMatrixService: LedMatrixService;

    private enabled: boolean = false;
    private interval;
    private textIndex = 0;

    enable() {
        this.enabled = true;
        this.textIndex = 0;
        this.interval = setInterval(() => {
            this.nextScreenSaverStep();
        }, 1500)
    }

    private nextScreenSaverStep() {
        this.textIndex = (this.textIndex + 1) % this.SCREEN_SAVER_TEXT.length;
        this.ledMatrixService.charFixed(this.SCREEN_SAVER_TEXT[this.textIndex]);
    }

    disable() {
        this.enabled = false;
        clearInterval(this.interval);
    }
}
