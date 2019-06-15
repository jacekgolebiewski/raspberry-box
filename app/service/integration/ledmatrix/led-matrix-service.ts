import { Component } from '../../../component/component';
import { EnvironmentUtil } from '../../../shared/utils/environment-util';
import { LedMatrixOptions } from './led-matrix-options';
import { LedMatrixDriverMock } from './led-matrix-driver-mock';

@Component.default
export class LedMatrixService {

    private readonly CONTROLLER_NUMBER = 0;

    matrixDriver: LedMatrixDriverMock;

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

    async display(matrix: Array<Array<number>>) {
        await this.matrixDriver.reset(this.CONTROLLER_NUMBER);
        await this.matrixDriver.set(this.CONTROLLER_NUMBER, matrix);
    }

}
