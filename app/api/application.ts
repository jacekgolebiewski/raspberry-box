import { WebSocketClient } from './web-socket-client';
import { Request } from './model/request';
import { Logger } from '../service/logger/logger';
import { Inject } from 'typescript-ioc';
import { LedMatrixService } from '../service/integration/ledmatrix/led-matrix-service';
import { ScreenRequest } from './model/screen/screen-request';
import { GpioService } from '../service/integration/gpio/gpio-service';
import { ButtonResponse } from './model/button/button-response';
import { Button } from './model/button/button';
import { ButtonAction } from './model/button/button-action';
import { ConfigurationService } from '../service/configuration-service';
import { PropertyRequest } from './model/property-request';
import { ScreenSaver } from './screen-saver';

export class Application {

    @Inject private ledMatrixService: LedMatrixService;
    @Inject private gpioService: GpioService;
    @Inject private configurationService: ConfigurationService;
    @Inject private screenSaver: ScreenSaver;

    public webSocketClient: WebSocketClient;

    private handlers: Map<string, ((Request) => void)> = new Map([
        [ScreenRequest.TYPE_NAME, (request) => this.onScreenRequest(request)],
        [PropertyRequest.TYPE_NAME, (request) => this.onPropertyRequest(request)]
    ]);

    private pinToButton: Map<number, Button> = new Map([
        [36, Button.A],
        [38, Button.B]
    ]);

    private gpio;


    init() {
        this.screenSaver.enable();
        this.configureGpio();
    }

    private configureGpio() {
        this.gpio = this.gpioService.gpioDriver;
        this.pinToButton.forEach((value, key) => this.gpio.setup(key, this.gpio.DIR_IN, this.gpio.EDGE_BOTH));
        this.gpio.on('change', (channel, value) => {
            Logger.trace('Channel ' + channel + ' value is now ' + value);
            this.onGpioChange(channel, value);
        });
    }

    private onGpioChange(pin: number, value: boolean) {
        if (this.pinToButton.get(pin) !== undefined) {
            this.onButtonStateChange(this.pinToButton.get(pin), value ? ButtonAction.PRESSED : ButtonAction.RELEASED);
        }
    }

    onConnected(webSocketClient: WebSocketClient): any {
        this.screenSaver.disable();
        this.webSocketClient = webSocketClient;
        this.webSocketClient.onRequest = (request) => this.onRequest(request);
        this.webSocketClient.onDisconnect = () => {
            Logger.debug("Client disconnected");
            this.screenSaver.enable();
        };
    }

    private onButtonStateChange(button: Button, action: ButtonAction) {
        Logger.trace(`Changed state of button ${button} to ${action}`);
        if(this.webSocketClient) {
            this.webSocketClient.sendMessage(undefined, new ButtonResponse(button, action));
        }
    }

    onRequest(request: Request): void {
        Logger.debug(`onRequest:request.type = ${request.type}`);
        let handler = this.handlers.get(request.type);
        if (handler !== undefined) {
            handler(request);
        } else {
            this.webSocketClient.sendText(request, "Not supported operation");
        }
    }

    onScreenRequest(request: ScreenRequest): void {
        Logger.trace(`onScreenRequest(...)`);
        this.ledMatrixService.custom(request.matrix);
    }

    private onPropertyRequest(request: PropertyRequest) {
        if (request.key === "test_delay") {
            setTimeout(() => {
                this.webSocketClient.sendText(request, `${request.value}ms delayed test response`);
            }, +request.value);
        }
        this.configurationService.setProperty(request.key, request.value);
    }
}
