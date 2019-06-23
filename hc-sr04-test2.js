const ECHO = 27;
const TRIG = 25;
const BUTTON = 28;

const Gpio = require('pigpio').Gpio;

// The number of microseconds it takes sound to travel 1cm at 20 degrees celcius
const MICROSECDONDS_PER_CM = 1e6/34321;

const trigger = new Gpio(TRIG, {mode: Gpio.OUTPUT});
const echo = new Gpio(ECHO, {mode: Gpio.INPUT, alert: true});

trigger.digitalWrite(0); // Make sure trigger is low

const watchHCSR04 = () => {
    let startTick;

    echo.on('alert', (level, tick) => {
        if (level == 1) {
            startTick = tick;
        } else {
            const endTick = tick;
            const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
            console.log(diff / 2 / MICROSECDONDS_PER_CM);
        }
    });
};

watchHCSR04();

// Trigger a distance measurement once per second
setInterval(() => {
    trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);
