const Max7219 = require('max7219-display');
const matrix = new Max7219({
    device: '/dev/spidev0.0',
    controllerCount: 1,
    flip: 'none'
});
matrix.reset(0);
matrix.clear(0);
