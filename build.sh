
wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb
npm install eddystone-beacon
npm install forever-monitor
npm install forever -g
ln -s /usr/local/bin/node /usr/bin/node

apt-get install bluetooth bluez-utils blueman libbluetooth-dev

ln -s init/piBeacon /etc/init.d/piBeacon.0
update-rc.d piBeacon.0 defaults
