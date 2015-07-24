
wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb
npm install eddystone-beacon

apt-get install bluetooth bluez-utils blueman libbluetooth-dev

ln -s init/piBeacon /etc/init.d/piBeacon
update-rc.d piBeacon defaults
