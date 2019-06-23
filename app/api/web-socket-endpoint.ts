import * as express from 'express';
import * as WebSocket from 'ws';
import * as http from 'http';
import { Component } from '../component/component';
import { WebSocketClient } from './web-socket-client';
import { Application } from './application';
import { ApplicationConfig } from '../shared/constants/config/application-config';
import { ConfigKey } from '../shared/constants/config/config-key';
import { Logger } from '../service/logger/logger';
import { Inject } from 'typescript-ioc';

@Component.default
export class WebSocketEndpoint {

    @Inject private application: Application;

    server: http.Server;
    app: express.Application;
    websocketServer: WebSocket.Server;

    init() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.websocketServer = new WebSocket.Server({server: this.server});

        this.app.get('/', function (req, res) {
            res.send('RaspberryBox Application. Connect with WebSocket to use!');
        });

        this.websocketServer.on('connection', (ws: WebSocket) => {
            Logger.info("WebSocketEndpoint: Connected new client");
            const webSocketClient = new WebSocketClient(ws);
            Logger.trace(`this.application.onConnected(webSocketClient): ${webSocketClient}`);
            this.application.onConnected(webSocketClient);
            webSocketClient.start();
        });

        const PORT = ApplicationConfig.get(ConfigKey.DEFAULT_PORT);

        this.server.listen(PORT, function () {
            console.log(`Raspberry box listening on port ${PORT}!`);
        });
    }

}
