export class App {
/*

    @Inject private application: Application;
    @Inject private webSocketEndpoint: WebSocketEndpoint;
    @Inject private gpioService: GpioService;
    @Inject private systemService: SystemService;
*/

    async start() {
        const gpio = require('rpi-gpio');
        console.log('Started...');
        gpio.on('change', function(channel, value) {
            console.log('Channel ' + channel + ' value is now ' + value);
        });
        gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);
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
