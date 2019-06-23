const ECHO = 36;
const TRIG = 37;
const BUTTON = 38;


const usonic = require('mmm-usonic-fixed');

usonic.init(function (error) {
    if (error) {
        console.log(error);
    } else {
        var sensor = usonic.createSensor(ECHO, TRIG, 750);
        console.log(sensor());
    }
});

