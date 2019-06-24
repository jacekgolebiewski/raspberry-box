import { WebSocketClient } from './web-socket-client';
import { Request } from './model/request';
import { Logger } from '../service/logger/logger';
import { Inject, Singleton } from 'typescript-ioc';
import { LedMatrixService } from '../service/integration/ledmatrix/led-matrix-service';
import { ScreenRequest } from './model/screen/screen-request';
import { GpioService } from '../service/integration/gpio/gpio-service';
import { ButtonResponse } from './model/button/button-response';
import { Button } from './model/button/button';
import { ButtonAction } from './model/button/button-action';
import { PropertyRequest } from './model/property-request';
import { ScreenSaver } from './screen-saver';
import { Component } from '../component/component';
import { RandomUtil } from '../shared/utils/random-util';
import { DistanceMeter } from './distance-meter';
import { DistanceRequest } from './model/distance-request';
import { DistanceResponse } from './model/distance/distance-response';

@Component.default
@Singleton
export class Application {

    uid = RandomUtil.getRandom(100);

    @Inject private ledMatrixService: LedMatrixService;
    @Inject private gpioService: GpioService;
    @Inject private screenSaver: ScreenSaver;
    private distanceMeter: DistanceMeter = new DistanceMeter();

    private webSocketClient: WebSocketClient;

    private handlers: Map<string, ((Request) => void)> = new Map([
        [ScreenRequest.TYPE_NAME, (request) => this.onScreenRequest(request)],
        [DistanceRequest.TYPE_NAME, (request) => this.onDistanceRequest(request)],
        [PropertyRequest.TYPE_NAME, (request) => this.onPropertyRequest(request)]
    ]);

    //BCM mapping
    private pinToButton: Map<number, Button> = new Map([
        [20, Button.A],
        [21, Button.B]
    ]);

    private Gpio;

    init() {
        this.screenSaver.enable();
        this.configureGpio();
        this.distanceMeter.init();
        this.distanceMeter.onNewDistance = (distance) => {
            if(this.webSocketClient) {
                this.webSocketClient.sendMessage(undefined, new DistanceResponse(distance));
            }
        };
        this.distanceMeter.start();
    }

    private configureGpio() {
        this.Gpio = this.gpioService.gpioDriver;
        this.pinToButton.forEach((value, key) => {

            const button = new this.Gpio(key, {
                mode: this.Gpio.INPUT,
                pullUpDown: this.Gpio.PUD_DOWN,
                alert: true
            });

            button.glitchFilter(10000); // Level must be stable for 10 ms before an alert event is emitted.
            button.on('alert', (level, tick) => {
                if (level === 1) {
                    Logger.trace('Channel ' + key + ' value is now ' + level);
                    this.onGpioChange(key, level);
                }
            });
        });
    }

    private onGpioChange(pin: number, value: boolean) {
        if (this.pinToButton.get(pin) !== undefined) {
            this.onButtonStateChange(this.pinToButton.get(pin), value ? ButtonAction.PRESSED : ButtonAction.RELEASED);
        }
    }

    onConnected(webSocketClient: WebSocketClient): any {
        Logger.debug(`onConnected for application ${this.uid}`);
        this.screenSaver.disable();
        this.webSocketClient = webSocketClient;
        this.webSocketClient.onRequest = (request) => this.onRequest(request);
        this.webSocketClient.onDisconnect = () => {
            Logger.debug("Client disconnected");
            this.screenSaver.enable();
        };
    }

    private onButtonStateChange(button: Button, action: ButtonAction) {
        Logger.debug(`onButtonStateChange for application ${this.uid}`);
        Logger.trace(`Changed state of button ${button} to ${action}`);
        if (this.webSocketClient !== undefined) {
            Logger.trace(`webSocketClient available`);
            this.webSocketClient.sendMessage(undefined, new ButtonResponse(button, action));
        }
    }

    onRequest(request: Request): void {
        Logger.debug(`onRequest:request.type = ${request.type}`);
        let handler = this.handlers.get(request.type);
        if (handler !== undefined) {
            handler(request);
        } else {
            this.webSocketClient.sendText(request, "Not supported operation");
        }
    }

    onScreenRequest(request: ScreenRequest): void {
        Logger.trace(`onScreenRequest(...)`);
        this.ledMatrixService.custom(request.matrix);
    }

    private onPropertyRequest(request: PropertyRequest) {
        if (request.key === "test_delay") {
            setTimeout(() => {
                this.webSocketClient.sendText(request, `${request.value}ms delayed test response`);
            }, +request.value);
        }
    }

    private onDistanceRequest(request: DistanceRequest) {
        this.distanceMeter.getDistance();
    }
}
