import * as WebSocket from 'ws';
import { Request } from './model/request';
import { Logger } from '../service/logger/logger';
import { Inject } from 'typescript-ioc';
import { LockService } from '../service/lock/lock-service';

export class WebSocketClient {

    private readonly LOCK_ID = "WebSocketClient";

    @Inject private lockService: LockService;

    onRequest: (request: Request) => void;
    onDisconnect: () => void;

    constructor(public webSocket: WebSocket) {
    }

    public start() {
        this.webSocket.on('message', (message: string) => {
            Logger.trace(`received message: ${message}`);
            if(!this.lockService.acquire(this.LOCK_ID, "Tried simultaneous access to 'message' endpoint, rejected!")) {
                return
            }
            if (this.onRequest !== undefined) {
                this.onRequest(JSON.parse(message))
            }
            this.lockService.release(this.LOCK_ID);
        });
        this.webSocket.on('close', () => {
            this.onDisconnect && this.onDisconnect();
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
