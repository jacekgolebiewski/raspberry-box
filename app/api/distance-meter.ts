import { Inject } from 'typescript-ioc';
import { GpioService } from '../service/integration/gpio/gpio-service';

export class DistanceMeter {

    //BCM mapping
    private readonly ECHO = 16;
    private readonly TRIG = 26;
    private readonly MICROSECDONDS_PER_CM = 1e6 / 34321;

    @Inject private gpioService: GpioService;

    private Gpio;
    private trigger;
    private echo;

    init() {
        this.Gpio = this.gpioService.gpioDriver;
        this.trigger = new this.Gpio(this.TRIG, {mode: this.Gpio.OUTPUT});
        this.echo = new this.Gpio(this.ECHO, {mode: this.Gpio.INPUT, alert: true});
        this.trigger.digitalWrite(0);
    }

    getDistance() {
        this.trigger.trigger(10, 1);
        this.watchHCSR04();
    }

    watchHCSR04() {
        let startTick;
        this.echo.on('alert', (level, tick) => {
            if (level == 1) {
                startTick = tick;
            } else {
                const endTick = tick;
                const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
                console.log(diff / 2 / this.MICROSECDONDS_PER_CM);
            }
        });
    }

}
