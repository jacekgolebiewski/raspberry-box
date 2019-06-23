const gpio = require('rpi-gpio');
const ECHO = 36;
const TRIG = 37;
const BUTTON = 38;


var usonic = require('mmm-usonic-fixed');

usonic.init(function (error) {
    if (error) {
        console.log(error);
    } else {
        var sensor = usonic.createSensor(ECHO, TRIG, 750);
        console.log(sensor());
    }
});

