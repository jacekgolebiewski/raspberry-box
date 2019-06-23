const gpio = require('rpi-gpio');
const ECHO = 36;
const TRIG = 37;

gpio.setup(TRIG, gpio.DIR_OUT);
gpio.setup(ECHO, gpio.DIR_IN, gpio.EDGE_BOTH);


async function readPin(pin) {
    return new Promise((resolve, reject) => {
        gpio.read(pin, function(err, value) {
            if (err) throw err;
            resolve(pin);
        });
    });
}

async function checkDistance() {
    console.log('checkDistance()');
    gpio.write(TRIG, true);
    gpio.write(TRIG, false);
    console.log('triggered');

    while (true) {
        let value = await readPin(ECHO);
        if (value === true) {
            break;
        }
    }
    let startDate = new Date();
    console.log('found 1 on ECHO pin');

    while (true) {
        let value = await readPin(ECHO);
        if (value === false) {
            break;
        }
    }
    let endDate = new Date();
    console.log('found 0 on ECHO pin');

    console.log(`${startDate.getTime()} / ${endDate.getTime()}`);
}
/*
    gpio.on('change', (channel, value) => {

    });


    var start = new Date()
    var hrstart = process.hrtime()
    var simulateTime = 5

    setTimeout(function(argument) {
        // execution time simulated with setTimeout function
        var end = new Date() - start,
            hrend = process.hrtime(hrstart)

        console.info('Execution time: %dms', end)
        console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    }, simulateTime)*/



setInterval(() => {
    console.log('Checking distance...');
    checkDistance();
}, 1000);
