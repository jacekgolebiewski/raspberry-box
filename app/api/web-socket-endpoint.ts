import * as express from 'express';
import * as WebSocket from 'ws';
import * as http from 'http';
import { Component } from '../component/component';
import { WebSocketClient } from './web-socket-client';
import { Application } from './application';
import { ApplicationConfig } from '../shared/constants/config/application-config';
import { ConfigKey } from '../shared/constants/config/config-key';

@Component.default
export class WebSocketEndpoint {

    server: http.Server;
    app: express.Application;
    websocketServer: WebSocket.Server;

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

        this.websocketServer.on('connection', (ws: WebSocket) => {
            new Application(new WebSocketClient(ws));
        });

        const PORT = ApplicationConfig.get(ConfigKey.DEFAULT_PORT);

        this.server.listen(PORT, function () {
            console.log(`Example app listening on port ${PORT}!`);
        });
    }

}
