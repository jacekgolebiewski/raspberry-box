export class LedMatrixOptions {

    constructor(
        public device: string = '/dev/spidev0.0', //'/dev/spidev0.0'
        public controllerCount: number = 1,
        public flip?: 'none' //none, vertical, horizontal, both
    ) {}
}
