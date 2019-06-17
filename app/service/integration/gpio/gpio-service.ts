import { EnvironmentUtil } from "../../../shared/utils/environment-util";
import { Logger } from "../../logger/logger";
import { Gpio } from "../../../model/gpio";
import { RpioMock } from "./rpio-mock";
import { GpioType } from "../../../model/gpio-type";
import { ComponentService } from '../../../component/component-service';
import { Component } from '../../../component/component';
import { GpioError } from './GpioError';
import * as _ from 'lodash';
import { TimeUtil } from '../../../shared/utils/time-util';

@Component.default
export class GpioService {

    readonly ALL_GPIO = [4, 5, 6, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];

    private GPIO_PWM_RANGE = 1000;
    private GPIO_PWM_DEFAULT_FREQUENCY_DIVIDER = 64;
    private readonly OPTIONS: RPIO.Options = {
        gpiomem: false, // required for: i²c, PWM, SPI
        mapping: 'gpio' // pin number = gpio number
    };

    private rpio: Rpio = EnvironmentUtil.isProduction() ? require('rpio') : ComponentService.get(RpioMock);

    gpios: Array<Gpio> = [];

    init() {
        this.rpio.init(this.OPTIONS);
        this.rpio.pwmSetClockDivider(this.GPIO_PWM_DEFAULT_FREQUENCY_DIVIDER); //300kHz
    }

    getOrUndefined(id: number, type?: GpioType): Gpio {
        return this.gpios.find((val: Gpio) => {
            return val.id === id
                && (!type || val.type === type)
        });
    }

    get(id: number, type?: GpioType): Gpio {
        let gpio = this.getOrUndefined(id, type);
        if (_.isNil(gpio)) {
            throw new GpioError(new Gpio(id, type), `Not found gpio with id=${id} and type=${type}. Did you forget to call 'open'?`);
        }
        return gpio;
    }

    exists(id: number, type?: GpioType): boolean {
        return this.getOrUndefined(id, type) !== undefined;
    }

    openIN(id: number) {
        this.validateGpioId(id);
        this.closeIfExists(id);
        this.rpio.open(id, this.rpio.INPUT);
        this.add(id, GpioType.IN);
    }

    openOUT(id: number, defaultState: number = 0) {
        this.validateGpioId(id);
        this.validateState(defaultState);
        this.closeIfExists(id);
        this.rpio.open(id, this.rpio.OUTPUT, defaultState);
        this.add(id, GpioType.OUT, defaultState);
    }

    openPWM(id: number) {
        this.rpio.open(id, this.rpio.PWM);
        this.rpio.pwmSetRange(id, this.GPIO_PWM_RANGE);
        this.add(id, GpioType.PWM);
    }

    private validateGpioId(id: number): void {
        if (this.ALL_GPIO.indexOf(id) < 0) {
            throw new GpioError(new Gpio(id, GpioType.IN), `Invalid gpio id: ${id}`);
        }
    }

    private validateState(state: number): void {
        if (state !== 0 && state !== 1) {
            throw new GpioError(undefined, `Invalid state: ${state}`);
        }
    }

    read(id: number): number {
        let gpio = this.get(id, GpioType.IN);
        let value = this.rpio.read(id);
        gpio.value = value;
        return value;
    }

    write(id: number, value: number): void {
        const gpio = this.get(id, GpioType.OUT);
        this.rpio.write(id, value);
        gpio.value = value;
    }

    poll(id: number, cb: (nVal) => any) {
        //this.clearPoll(id); //TODO jg: should consider checking if pin is polling
        this.rpio.poll(id, (pin: number) => {
            Logger.debug('Original poll of ' + pin);
            const val = this.read(pin);
            Logger.debug('Poll read val: ' + val);
            cb && cb(val);
        });
    }

    clearPoll(id: number) {
        this.get(id, GpioType.IN);
        this.rpio.poll(id, undefined);
    }

    /**
     * @deprecated Since 2.0, use Pca9685 instead
     */
    writePWM(id: number, pwmValue: number, pwmRange: number) {
        let val = this.GPIO_PWM_RANGE * (pwmRange / 100) * (pwmValue / 100);
        this.rpio.pwmSetData(id, val);
    }

    /**
     * @deprecated Since 2.0, use Pca9685 instead
     */
    private writeSoftPwm(gpio: Gpio) {
        //: SoftPwm = gpio.softPwm;
        const softPwmValue = {
            repeat: 0,
            dutyCycle: 0,
            period: 0
        };
        let times = [];
        for (let i = 0; i < softPwmValue.repeat; i++) {
            this.rpio.write(gpio.id, this.rpio.HIGH);
            times.push(TimeUtil.waitMillis(softPwmValue.dutyCycle));
            this.rpio.write(gpio.id, this.rpio.LOW);
            times.push(TimeUtil.waitMillis(softPwmValue.period - softPwmValue.dutyCycle));
        }

        Logger.trace(`Times array: ${times}`);
    }

    close(id: number) {
        this.closeGpio(this.get(id));
    }

    closeIfExists(id: number) {
        const gpio = this.getOrUndefined(id);
        if (!_.isNil(gpio)) {
            this.closeGpio(gpio);
        }
    }

    private closeGpio(gpio: Gpio) {
        this.rpio.close(gpio.id);
        this.gpios = _.filter(this.gpios, (g) => g.id !== gpio.id);
    }

    closeAll() {
        this.gpios.forEach(gpio => this.close(gpio.id));
    }

    private add(id: number, type: GpioType, value?: number) {
        this.pushGpio(new Gpio(id, type));
    }

    private pushGpio(gpio: Gpio) {
        this.gpios.push(gpio);
        this.gpios = _.sortBy(this.gpios, 'id');
    }

    /**
     * @deprecated Since 2.0, use Pca9685 instead
     * ustawia częstotlisc pwm, a wlasciwie dzielnik czestotliwosci
     *
     * z dokumentacji:
     *
     * Set the PWM refresh rate with pwmSetClockDivider(). This is a power-of-two divisor of the base 19.2MHz rate, with a maximum value of 4096 (4.6875kHz).
     *
     *  rpio.pwmSetClockDivider(64); //Set PWM refresh rate to 300kHz
     * Set the PWM range for a pin with pwmSetRange(). This determines the maximum pulse width.
     *
     * rpio.pwmSetRange(12, 1024);
     * Finally, set the PWM width for a pin with pwmSetData().
     *
     * rpio.pwmSetData(12, 512);
     */
    updatePwmFrequency(value: number) {
        this.rpio.pwmSetClockDivider(value);
    }

    onExit() {
        Logger.debug("GpioService.onExit invoked");
        this.closeAll();
    }

}
