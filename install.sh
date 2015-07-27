#!/bin/sh

if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root"
   exit 1
fi

apt-get install bluetooth bluez-utils blueman libbluetooth-dev

mkdir -p /opt/piBeacon && cd /opt/piBeacon

git clone git://git.razvi.ro/piBeacon.git /opt/piBeacon

wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
npm install eddystone-beacon
npm install forever-monitor
npm install request
npm install forever -g
ln -s /usr/local/bin/node /usr/bin/node

ln -s /opt/piBeacon/default/piBeacon /etc/default/piBeacon

ln -s /opt/piBeacon/init/piBeacon /etc/init.d/piBeacon.0
update-rc.d piBeacon.0 defaults
/etc/init.d/piBeacon.0 start

ln -s /opt/piBeacon/init/piBeacon /etc/init.d/piBeacon.1
update-rc.d piBeacon.1 defaults
ln -s /opt/piBeacon/init/piBeacon /etc/init.d/piBeacon.2
update-rc.d piBeacon.2 defaults
ln -s /opt/piBeacon/init/piBeacon /etc/init.d/piBeacon.3
update-rc.d piBeacon.3 defaults

