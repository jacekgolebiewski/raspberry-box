import { WebSocketClient } from './web-socket-client';
import { Request } from './model/request';
import { LedRequest } from './model/led/led-request';
import { Logger } from '../service/logger/logger';
import { Inject } from 'typescript-ioc';
import { LedMatrixService } from '../service/integration/ledmatrix/led-matrix-service';
import { LedColor } from './model/led/led-color';
import { LedState } from './model/led/led-state';
import { ScreenRequest } from './model/screen/screen-request';

export class Application {

    @Inject private ledMatrixService: LedMatrixService;

    handlers: Map<string, ((Request ) => void)> = new Map([
        [LedRequest.TYPE_NAME, (request) => this.onLedRequest(request)],
        [ScreenRequest.TYPE_NAME, (request) => this.onScreenRequest(request)]
    ]);

    constructor(public webSocketClient: WebSocketClient) {
        webSocketClient.onRequest = (request) => this.onRequest(request);
        webSocketClient.init();
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
        this.ledMatrixService.display(request.matrix);
    }

    //TODO jg: build sendMessage Response for buttons

}
