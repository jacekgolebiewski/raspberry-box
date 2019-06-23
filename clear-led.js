let Max7219 = require('max7219-display');
new Max7219({
    device: '/dev/spidev0.0',
    controllerCount: 1,
    flip: 'none'
}).clear(0);
