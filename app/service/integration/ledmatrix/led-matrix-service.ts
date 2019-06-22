import { Component } from '../../../component/component';
import { EnvironmentUtil } from '../../../shared/utils/environment-util';
import { LedMatrixOptions } from './led-matrix-options';
import { LedMatrixDriverMock } from './led-matrix-driver-mock';
import { Logger } from '../../logger/logger';

@Component.default
export class LedMatrixService {

    private readonly CONTROLLER_NUMBER = 0;

    matrixDriver: LedMatrixDriverMock;

    isWorking = false;

    constructor() {
        this.init();
    }

    init() {
        let options = new LedMatrixOptions();
        if (EnvironmentUtil.isProduction()) {
            let Max7219 = require('max7219-display');
            this.matrixDriver = new Max7219(options);
        } else {
            this.matrixDriver = new LedMatrixDriverMock(options);
        }
    }

    async custom(matrix: Array<Array<number>>) {
        if(this.isWorking) {
            Logger.warn("Tried simultaneous access to screen, rejected!");
            return;
        }
        this.isWorking = true;
        await this.matrixDriver.reset(this.CONTROLLER_NUMBER);
        await this.matrixDriver.set(this.CONTROLLER_NUMBER, matrix);
        this.isWorking = false;
    }

    async char(character: string) {
        if (character.length != 1) {
            Logger.error("character param must have only 1 letter");
            return
        }
        await this.matrixDriver.reset(this.CONTROLLER_NUMBER);
        await this.matrixDriver.letter(this.CONTROLLER_NUMBER, character[0]);
    }


}
