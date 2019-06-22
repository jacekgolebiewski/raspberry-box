import { EnvironmentUtil } from "../../../shared/utils/environment-util";
import { Logger } from "../../logger/logger";
import { Gpio } from "../../../model/gpio";
import { RpioMock } from "./rpio-mock";
import { GpioType } from "../../../model/gpio-type";
import { ComponentService } from '../../../component/component-service';
import { Component } from '../../../component/component';
import { GpioError } from './GpioError';
import * as _ from 'lodash';

@Component.default
export class GpioService {

    readonly AVAILABLE_GPIO = [36, 38];

    private readonly OPTIONS: RPIO.Options = {
        gpiomem: true,
        mapping: 'physical' // pin number = physical pinout number
    };

    public rpio: Rpio = EnvironmentUtil.isProduction() ? require('rpio') : ComponentService.get(RpioMock);
    gpios: Array<Gpio> = [];

    init() {
        Logger.debug(JSON.stringify(this.OPTIONS));
        this.rpio.init(this.OPTIONS);
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

    private validateGpioId(id: number): void {
        if (this.AVAILABLE_GPIO.indexOf(id) < 0) {
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
        const _this = this;
        this.rpio.poll(id, function(pin: number) {
            const val = _this.read(pin);
            Logger.trace(`GpioService: polled pin ${pin} with value ${val}`);
            cb && cb(val);
        });
    }

    clearPoll(id: number) {
        this.get(id, GpioType.IN);
        this.rpio.poll(id, undefined);
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

    onExit() {
        Logger.debug("GpioService.onExit invoked");
        this.closeAll();
    }

}
