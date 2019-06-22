import * as express from 'express';
import * as WebSocket from 'ws';
import * as http from 'http';
import { Component } from '../component/component';
import { WebSocketClient } from './web-socket-client';
import { Application } from './application';
import { ApplicationConfig } from '../shared/constants/config/application-config';
import { ConfigKey } from '../shared/constants/config/config-key';
import { application } from 'express';

@Component.default
export class WebSocketEndpoint {

    server: http.Server;
    app: express.Application;
    websocketServer: WebSocket.Server;
    application: Application = new Application(undefined);

    constructor() {
        this.init();
    }

    init() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.websocketServer = new WebSocket.Server({server: this.server});

        this.app.get('/', function (req, res) {
            res.send('Raspberry box Application. Connect with WebSocket to use!');
        });

        // init should be inside method
        this.application.init();
        this.websocketServer.on('connection', (ws: WebSocket) => {
            this.application.webSocketClient = new WebSocketClient(ws);
        });

        const PORT = ApplicationConfig.get(ConfigKey.DEFAULT_PORT);

        this.server.listen(PORT, function () {
            console.log(`Example app listening on port ${PORT}!`);
        });
    }

}
