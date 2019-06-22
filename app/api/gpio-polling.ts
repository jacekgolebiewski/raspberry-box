import { Inject } from 'typescript-ioc';
import { GpioService } from '../service/integration/gpio/gpio-service';

export class GpioPolling {

    @Inject private gpioService: GpioService;

    private interval;
    private value: number = 0;

    constructor(public pin: number) {
    }

    start(onChangeCallback: (number) => void, rateInMs: number) {
        this.interval = setInterval(() => {
            let val = this.gpioService.read(this.pin);
            if (this.value !== val) {
                this.value = val;
                onChangeCallback && onChangeCallback(this.value);
            }
        }, rateInMs);
    }

    stop() {
        clearInterval(this.interval);
    }

}
