import { Inject } from 'typescript-ioc';
import { Application } from './api/application';
import { WebSocketEndpoint } from './api/web-socket-endpoint';
import { GpioService } from './service/integration/gpio/gpio-service';
import { Logger } from './service/logger/logger';
import { EnvironmentUtil } from './shared/utils/environment-util';
import { AppBanner } from './shared/misc/app-banner';
import { ApplicationConfig } from './shared/constants/config/application-config';
import { ConfigKey } from './shared/constants/config/config-key';

export class App {

    @Inject private application: Application;
    @Inject private webSocketEndpoint: WebSocketEndpoint;
    @Inject private gpioService: GpioService;

    async start() {
        Logger.critical(`Running with Environment.${EnvironmentUtil.currentEnvironment}`);
        Logger.critical(`Logging level is: ${ApplicationConfig.get(ConfigKey.LOG_LEVEL).prefix}`);
        AppBanner.printTitle();
        this.startApplication();
        this.startEndpoint();
    }

    private startApplication() {
        this.application = new Application();
        this.application.init();
    }

    private startEndpoint() {
        this.webSocketEndpoint = new WebSocketEndpoint(this.application);
        this.webSocketEndpoint.init();
    }
}

export default new App()
