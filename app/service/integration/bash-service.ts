import { Component } from '../../component/component';

const exec = require('child_process').exec;

@Component.default
export class BashService {

    run(command, cb) {
        let callback = cb ? cb : () => {};
        exec(command, callback);
    }

}