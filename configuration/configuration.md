# Raspberry configuration to run RaspberryBox

## Version info
NOTE: configuration below was tested on:
`Linux raspberrypi 4.14.98-v7+ #1200 SMP Tue Feb 12 20:27:48 GMT 2019 armv7l`
with image `2019-04-08-raspbian-stretch-full`.
You may need to some details if you're working with different version

## Configuration guide

* Go to raspi-config and enable SPI interface (for led matrix usage)
* Install node and npm - confirmed compatibility with node 10.16.0 (includes npm 6.9.0)
IMPORTANT! TO correctly install node and npm for your hardware follow this guide: 
https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/<br>
* Create and go to directory `/home/pi/apps/`
* Clone repository
* Go to `raspberry-box` directory and install packages: `npm install`
* Run `npm start`

## Autostart configuration (after Configuration guide)
* Install forever: `sudo npm i -g forever`
* Copy service file from configuration directory to relevant directory on your raspberry
* Run as root:
```
chmod 755 /etc/init.d/raspberry-box
sudo update-rc.d raspberry-box defaults
systemctl daemon-reload
```
* Reboot 

## Read logs
```
journalctl -xe
journalctl -u raspberry-box.service --no-pager -f -n 100
tail -f -n 100 log/forever.log
```

## Manage daemon status
```
systemctl stop raspberry-box.service
systemctl status raspberry-box.service
systemctl start raspberry-box.service
```






