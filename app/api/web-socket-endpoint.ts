import * as express from 'express';
import * as WebSocket from 'ws';
import * as http from 'http';
import { Component } from '../component/component';
import { WebSocketClient } from './web-socket-client';
import { Application } from './application';

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

        this.server.listen(9001, function () {
            console.log('Example app listening on port 3000!');
        });
    }

}
