import { WebSocketClient } from './web-socket-client';
import { Request } from './model/request';
import { LedRequest } from './model/led/led-request';
import { Logger } from '../service/logger/logger';
import { Inject } from 'typescript-ioc';
import { LedMatrixService } from '../service/integration/ledmatrix/led-matrix-service';
import { LedColor } from './model/led/led-color';
import { LedState } from './model/led/led-state';
import { ScreenRequest } from './model/screen/screen-request';
import { GpioService } from '../service/integration/gpio/gpio-service';
import { ButtonResponse } from './model/button/button-response';
import { Button } from './model/button/button';
import { ButtonAction } from './model/button/button-action';

export class Application {

    @Inject private ledMatrixService: LedMatrixService;
    @Inject private gpioService: GpioService;

    handlers: Map<string, ((Request ) => void)> = new Map([
        [LedRequest.TYPE_NAME, (request) => this.onLedRequest(request)],
        [ScreenRequest.TYPE_NAME, (request) => this.onScreenRequest(request)]
    ]);

    pinToButton: Map<number, Button> = new Map([
        [3, Button.A],
        [27, Button.B]
    ]);

    constructor(public webSocketClient: WebSocketClient) {
        this.init();
    }

    private init() {
        this.webSocketClient.onRequest = (request) => this.onRequest(request);
        this.webSocketClient.init();
        this.pinToButton.forEach((value, key) => this.initButton(key));
    }

    initButton(pin: number): void {
        Logger.debug('Initializing pin ' + pin);
        this.gpioService.openIN(pin);
        this.gpioService.poll(pin, (val) => {
            Logger.debug('Pressed button ' + pin);
            this.onButtonStateChange(
                this.pinToButton.get(pin),
                val === 1 ? ButtonAction.PRESSED : ButtonAction.RELEASED)
        });
    }

    private onButtonStateChange(button: Button, action: ButtonAction) {
        this.webSocketClient.sendMessage(undefined, new ButtonResponse(button, action))
    }

    onRequest(request: Request): void {
        let handler = this.handlers.get(request.type);
        if (handler !== undefined) {
            handler(request);
        } else {
            this.webSocketClient.sendText(request, "Not supported operation");
        }
    }

    onLedRequest(request: LedRequest): void {
        Logger.info(`onLedRequest: ${JSON.stringify(request)}`);
        if (request.color === LedColor.RED) {
            if (request.state === LedState.ON) {
                // ...
            } else {
                // ...
            }
        }

    }

    onScreenRequest(request: ScreenRequest): void {
        Logger.info(`onScreenRequest(...)`);
        this.ledMatrixService.custom(request.matrix);
    }
}
