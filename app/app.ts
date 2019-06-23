import { GpioService } from "./service/integration/gpio/gpio-service";
import { AppBanner } from "./shared/misc/app-banner";
import { ComponentService } from "./component/component-service";
import { Inject } from 'typescript-ioc';
import { Logger } from './service/logger/logger';
import { EnvironmentUtil } from './shared/utils/environment-util';
import { SystemService } from './service/system-service';
import { WebSocketEndpoint } from './api/web-socket-endpoint';
import { Application } from './api/application';

export class App {
/*

    @Inject private application: Application;
    @Inject private webSocketEndpoint: WebSocketEndpoint;
    @Inject private gpioService: GpioService;
    @Inject private systemService: SystemService;
*/

    async start() {
        const rpio = require('rpio')
        rpio.init({
            gpiomem: true,
            mapping: 'physical'
        });

        console.log('Started...');
        rpio.open(36, rpio.INPUT, rpio.PULL_DOWN);
        rpio.poll(36, function (pin) {
            console.log('Pressed button ' + pin);
        });
    }
    /*
    async start() {
        Logger.critical(`Running with Environment.${EnvironmentUtil.currentEnvironment}`);
        AppBanner.printTitle();
        this.configureGpioService();
        this.startApplication();
        this.startEndpoint();
    }

    private configureGpioService() {
        // this.gpioService.init();
        // this.systemService.onExit((done: Function) => {
        //     this.gpioService.onExit();
        //     done.apply(this);
        // });
    }

    private startApplication() {
        this.application = new Application();
        this.application.init();
    }

    private startEndpoint() {
        setTimeout(() => {
            this.webSocketEndpoint = new WebSocketEndpoint();
            this.webSocketEndpoint.init();
        }, 1000);
    }*/
}

export default new App()
