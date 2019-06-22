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

export class Application {

    @Inject private ledMatrixService: LedMatrixService;
    @Inject private gpioService: GpioService;
    @Inject private configurationService: ConfigurationService;

    public webSocketClient: WebSocketClient;

    handlers: Map<string, ((Request) => void)> = new Map([
        [ScreenRequest.TYPE_NAME, (request) => this.onScreenRequest(request)],
        [PropertyRequest.TYPE_NAME, (request) => this.onPropertyRequest(request)]
    ]);

    pinToButton: Map<number, Button> = new Map([
        [16, Button.A],
        [21, Button.B]
    ]);

    constructor() {
        this.init()
    }

    init() {
        this.pinToButton.forEach((value, key) => this.initButton(key));
        this.gpioService.openOUT(20, 0);
    }

    onConnected(webSocketClient: WebSocketClient): any {
        this.webSocketClient = webSocketClient;
        this.webSocketClient.onRequest = (request) => this.onRequest(request);
        this.webSocketClient.init();
    }

    initButton(pin: number): void {
        Logger.debug('Initializing pin ' + pin);
/*
        const rpio = this.gpioService.rpio;
        rpio.open(16, rpio.INPUT)
        rpio.poll(16, (pin) => {
            console.log("changed!");
        })
*/
        this.gpioService.openIN(pin);
        this.gpioService.poll(pin, (val) => {
            Logger.debug('Pressed button ' + pin);
            this.gpioService.write(20, val);
            this.onButtonStateChange(
                this.pinToButton.get(pin),
                val === 1 ? ButtonAction.PRESSED : ButtonAction.RELEASED)
        });
    }

    private onButtonStateChange(button: Button, action: ButtonAction) {
        if(this.webSocketClient !== undefined) {
           this.webSocketClient.sendMessage(undefined, new ButtonResponse(button, action))
        }
    }

    onRequest(request: Request): void {
        let handler = this.handlers.get(request.type);
        if (handler !== undefined) {
            handler(request);
        } else {
            this.webSocketClient.sendText(request, "Not supported operation");
        }
    }

    onScreenRequest(request: ScreenRequest): void {
        Logger.info(`onScreenRequest(...)`);
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
