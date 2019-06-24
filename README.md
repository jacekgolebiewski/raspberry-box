# RaspberryBox

Simple Typescript Node application with WebSocket API to write games/applications on DIY gamebox.

## Components

* RaspberryPI 3 B+
* Led matrix with MAX7219 controller as a gamebox screen (using SPI interface)
* HC-SR04 ultrasonic sensor
* 2x tact switch

## Circuit

![circuit_scheme](docs/circuit.png?raw=true "circuit.png")

## Configuration

For configuration instructions see `configuration/configuration.md` file.

## Issues && improvements

Note that this is a simple project/idea and it may contain some bugs, but I am not planning to do a lot of code here. 
If you want to enchance or fix it feel free to fork this repo.

## Running application

WARNING: Before you run this application ensure that you have connected circuit components correctly and configured raspberry as in `configuration/configuration.md` file.
 
To run application manually simply execute: `npm install` and `npm start`

If you wish to run application on environment other than raspbian you can skip optional dependencies, 
which can fail to install: `npm install --no-optional`

## Dependencies

Application depends on:<br>
`max7219-display` - to control led matrix using SPI interface<br>
`pigpio` - to control gpio's: hc-sr04 and buttons<br>
`other common packages` - support for http, websocket, typescript, tests

### Problem with rpio

I planned to use `https://github.com/jperkin/node-rpio` library for gpio support, 
but it crashed on gpio polling on kernel 4.14<br>

ref: https://github.com/raspberrypi/linux/issues/2550
