import { Gpio } from '../../../model/gpio';

export class GpioError extends Error {

    constructor(public gpio: Gpio, message: string) {
        super(message);
        Object.setPrototypeOf(this, GpioError.prototype);
    }

}