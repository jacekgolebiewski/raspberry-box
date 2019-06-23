require('max7219-display')({
    device: '/dev/spidev0.0',
    controllerCount: 1,
    flip: 'none'
}).clear(0);
