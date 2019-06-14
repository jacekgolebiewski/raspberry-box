import { GpioService } from "./service/integration/gpio/gpio-service";
import { AppBanner } from "./shared/misc/app-banner";
import { ComponentService } from "./component/component-service";
import { Inject } from 'typescript-ioc';
import { Logger } from './service/logger/logger';
import { EnvironmentUtil } from './shared/utils/environment-util';
import { SystemService } from './service/system-service';
import { WebSocketEndpoint } from './api/web-socket-endpoint';

export class App {

    @Inject private gpioService: GpioService;
    @Inject private systemService: SystemService;

    static eagerComponents = [
        WebSocketEndpoint
    ];

    async start() {
        Logger.critical(`Running with Environment.${EnvironmentUtil.currentEnvironment}`);
        AppBanner.printTitle();
        ComponentService.initComponents(App.eagerComponents);

        //TODO jg: think about switching with eagerComponents
        this.configureGpioService();
    }

    private configureGpioService() {
        this.gpioService.init();
        this.systemService.onExit((done: Function) => {
            this.gpioService.onExit();
            done.apply(this);
        });
    }
}

export default new App()
