import { EnvironmentUtil } from "../../../shared/utils/environment-util";
import { Logger } from "../../logger/logger";
import { Gpio } from "../../../model/gpio";
import { RpioMock } from "./rpio-mock";
import { GpioType } from "../../../model/gpio-type";
import { ComponentService } from '../../../component/component-service';
import { Component } from '../../../component/component';
import { GpioError } from './GpioError';

@Component.default
export class GpioService {

    public gpioDriver = EnvironmentUtil.isProduction() ? require('pigpio').Gpio : ComponentService.get(RpioMock);

}
