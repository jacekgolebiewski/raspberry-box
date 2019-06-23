import { Component } from '../../../component/component';
import { EnvironmentUtil } from '../../../shared/utils/environment-util';
import { LedMatrixDriverMock } from './led-matrix-driver-mock';
import { Logger } from '../../logger/logger';
import { LedMatrixFont } from './led-matrix-font';

@Component.default
export class LedMatrixService {

    private readonly CONTROLLER_NUMBER = 0;

    matrixDriver: LedMatrixDriverMock;

    isWorking = false;

    constructor() {
        this.init();
    }

    init() {
        let options = {
            device: '/dev/spidev0.0',
            controllerCount: 1,
            flip: 'vertical',
            rotate: 270
        };
        if (EnvironmentUtil.isProduction()) {
            let Max7219 = require('max7219-display');
            this.matrixDriver = new Max7219(options);
        } else {
            this.matrixDriver = new LedMatrixDriverMock(options);
        }
    }

    async custom(matrix: Array<Array<number>>) {
        if (this.isWorking) {
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

    async charFixed(character: string) {
        const matrix = this.getCharMatrix(character);
        this.custom(matrix);
    }

    getCharMatrix(character: string) {
        if(character == undefined) {
            character = " ";
        }
        const ascii = character.charCodeAt(0);
        const char = LedMatrixFont.SINCLAIR_FONT[ascii];
        return this.rotate(char.map(row => {
            const bin: String = row.toString(2);
            return bin
                ['padStart'](8, '0')
                .split('')
                .map(i => parseInt(i))
        }));
    }

    async setBrightness(brightness: number) {
        await this.matrixDriver.setIntensity(this.CONTROLLER_NUMBER, brightness);
    }

    private rotate(matrix) {
        const N = matrix.length - 1;
        const result = matrix.map((row, i) =>
            row.map((val, j) => matrix[N - j][i])
        );
        matrix.length = 0;
        matrix.push(...result);
        return matrix;
    }

}
