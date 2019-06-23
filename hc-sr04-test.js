const gpio = require('rpi-gpio');

const ECHO = 36;
const TRIG = 37;
const BUTTON = 38;

gpio.setup(TRIG, gpio.DIR_OUT);
gpio.setup(ECHO, gpio.DIR_IN, gpio.EDGE_BOTH);
gpio.setup(BUTTON, gpio.DIR_IN, gpio.EDGE_BOTH);


async function readPin(pin) {
    return new Promise((resolve, reject) => {
        gpio.read(pin, function(err, value) {
            if (err) throw err;
            resolve(pin);
        });
    });
}

async function checkDistance() {
    gpio.on('change', (channel, value) => {
        if(channel === BUTTON) {
            console.log(`TRIG ${value}`);
            gpio.write(TRIG, value);
        } else {
            console.log(`Poll ${channel} val: ${value}`);
        }
    });
    /*

        console.log('checkDistance()');
        gpio.write(TRIG, true);
        for(let i = 0; i< 1000; i++) {
            console.log('Waiting...');
        }
        gpio.write(TRIG, false);
        console.log('triggered');
    */

    while (true) {
        let value = await readPin(ECHO);
        if (value === true) {
            break;
        }
    }
    /*    let startDate = new Date();
        console.log('found 1 on ECHO pin');

        while (true) {
            let value = await readPin(ECHO);
            if (value === false) {
                break;
            }
        }
        let endDate = new Date();
        console.log('found 0 on ECHO pin');

        console.log(`${startDate.getTime()} / ${endDate.getTime()}`);*/
}
/*
    gpio.on('change', (channel, value) => {

    });*/

