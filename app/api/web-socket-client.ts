import * as WebSocket from 'ws';
import { Request } from './model/request';
import { Logger } from '../service/logger/logger';

export class WebSocketClient {

    onRequest: (request: Request) => void;

    constructor(public webSocket: WebSocket) {
    }

    public init() {
        this.webSocket.on('message', (message: string) => {
            Logger.trace(`received: ${message}`);
            if (this.onRequest !== undefined) {
                this.onRequest(JSON.parse(message))
            }
        });
        this.onConnect();
    }

    private onConnect() {
        Logger.debug("Connected to client");
    }

    sendText(request, text) {
        this.sendMessage(request, {"type": "message", message: text});
    }

    sendMessage(request, response) {
        response.request = request;
        this.webSocket.send(JSON.stringify(response));
    }
}
