import { WebSocketClient } from './web-socket-client';
import { Request } from './model/request';
import { LedRequest } from './model/led/led-request';
import { Logger } from '../service/logger/logger';

export class Application {

    handlers: Map<string, ((Request) => void)> = new Map([
        [LedRequest.TYPE_NAME, () => this.onLedRequest]
    ]);

    constructor(public webSocketClient: WebSocketClient) {
        webSocketClient.onRequest = () => this.onRequest;
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
    }

    //TODO jg: build sendMessage Response

}
