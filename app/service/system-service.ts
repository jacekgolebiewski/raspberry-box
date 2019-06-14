import { Component } from '../component/component';

@Component.default
export class SystemService {

    exited: boolean = false;

    onExit(cb: Function): void {
        const exitCallback = () => {
            if(!this.exited) {
                this.exited = true;
                cb && cb(process.exit);
            }
        };

        process.stdin.resume();
        process.on('exit', exitCallback);
        process.on('SIGINT', exitCallback);
        process.on('SIGUSR1', exitCallback);
        process.on('SIGUSR2', exitCallback);
        process.on('uncaughtException', function(err){
            console.log(err.stack);
            exitCallback();
        });
    }

}