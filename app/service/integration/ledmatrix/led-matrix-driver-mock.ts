import { LedMatrixOptions } from './led-matrix-options';
import { Logger } from '../../logger/logger';

export class LedMatrixDriverMock {

    constructor(public options: LedMatrixOptions) {
        Logger.info(`LedMatrixDriverMock(${JSON.stringify(options)})`)
    }

    async reset(controllerNumber: number) {
        Logger.info(`reset(controllerNumber=${JSON.stringify(controllerNumber)})`)
    }

    async set(controllerNumber: number, matrix: Array<Array<number>>) {
        Logger.info(`reset(controllerNumber=${JSON.stringify(controllerNumber)}, matrix=...)`);
        matrix.forEach(row => {
            Logger.debug(JSON.stringify(row));
        })
    }

    async letter(controllerNumber: number, letter: string) {
        Logger.info(`reset(controllerNumber=${JSON.stringify(controllerNumber)}, letter=${letter})`);
    }
}
