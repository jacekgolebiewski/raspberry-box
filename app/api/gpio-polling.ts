import { Inject } from 'typescript-ioc';
import { GpioService } from '../service/integration/gpio/gpio-service';
import { Logger } from '../service/logger/logger';

export class GpioPolling {

    @Inject private gpioService: GpioService;

    private interval;
    private value: number = 0;

    constructor(public pin: number) {
    }

    start(onChangeCallback: (number) => void, rateInMs: number) {
        this.interval = setInterval(() => {
            let val = this.gpioService.rpio.read(this.pin);
            if (this.value !== val) {
                this.value = val;
                onChangeCallback && onChangeCallback(this.value);
            }
            Logger.debug(`Value of pin ${this.pin} is ${this.value} and ${val}`);
        }, rateInMs);
    }

    stop() {
        clearInterval(this.interval);
    }

}
