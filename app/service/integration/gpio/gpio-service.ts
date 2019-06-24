import { EnvironmentUtil } from "../../../shared/utils/environment-util";
import { ComponentService } from '../../../component/component-service';
import { Component } from '../../../component/component';

@Component.default
export class GpioService {

    public gpioDriver = EnvironmentUtil.isProduction() ? require('pigpio').Gpio : new GpioServiceMock();

}

class GpioServiceMock {

}
