import { LedMatrixOptions } from './led-matrix-options';
import { Logger } from '../../logger/logger';

export class LedMatrixDriverMock {

    constructor(public options: LedMatrixOptions) {
        Logger.info(`LedMatrixDriverMock(${JSON.stringify(options)})`)
    }

    reset(controllerNumber: number) {
        Logger.info(`reset(controllerNumber=${JSON.stringify(controllerNumber)})`)
    }

    set(controllerNumber: number, matrix: Array<Array<number>>) {
        Logger.info(`reset(set=${JSON.stringify(controllerNumber)}, matrix=...)`);
        matrix.forEach(row => {
            Logger.debug(JSON.stringify(row));
        })
    }

}
