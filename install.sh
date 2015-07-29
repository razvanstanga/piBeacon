#!/bin/bash

if [ "$(id -u)" != "0" ]; then
	echo "This script must be run as root"
	exit 1
fi

install_app (){
	echo "installing piBeacon"
	apt-get --no-install-recommends install bluetooth bluez-utils blueman libbluetooth-dev

	mkdir -p /opt/piBeacon && cd /opt/piBeacon

	git clone git://git.razvi.ro/piBeacon.git /opt/piBeacon

	wget http://node-arm.herokuapp.com/node_latest_armhf.deb
	sudo dpkg -i node_latest_armhf.deb
	rm node_latest_armhf.deb

	npm install eddystone-beacon
	npm install bleacon
	npm install forever-monitor
	npm install request
	npm install forever -g
	ln -s /usr/local/bin/node /usr/bin/node

	ln -s /opt/piBeacon/default/piBeacon /etc/default/piBeacon

	ln -s /opt/piBeacon/init/piBeacon.0 /etc/init.d/piBeacon.0
	update-rc.d piBeacon.0 defaults
	service piBeacon.0 start

	ln -s /opt/piBeacon/init/piBeacon.1 /etc/init.d/piBeacon.1
	update-rc.d piBeacon.1 defaults
	ln -s /opt/piBeacon/init/piBeacon.2 /etc/init.d/piBeacon.2
	update-rc.d piBeacon.2 defaults
	ln -s /opt/piBeacon/init/piBeacon.3 /etc/init.d/piBeacon.3
	update-rc.d piBeacon.3 defaults
}

uninstall_app (){
	echo "uninstall piBeacon"
	/etc/init.d/piBeacon.0 stop
	/etc/init.d/piBeacon.1 stop
	/etc/init.d/piBeacon.2 stop
	/etc/init.d/piBeacon.3 stop

	update-rc.d piBeacon.0 remove
	update-rc.d piBeacon.1 remove
	update-rc.d piBeacon.2 remove
	update-rc.d piBeacon.3 remove

        rm /etc/default/piBeacon
        rm /etc/init.d/piBeacon*

	apt-get remove bluetooth bluez-utils blueman libbluetooth-dev

	cd /opt/piBeacon
	npm uninstall eddystone-beacon
	npm uninstall bleacon
	npm uninstall forever-monitor
	npm uninstall request
	npm uninstall forever -g

        dpkg -r node
        rm /usr/bin/node

	rm -rf /opt/piBeacon
}

case "$1" in
	install)
		install_app
	;;

	uninstall)
		uninstall_app
	;;

	*)
		#install_app
	exit 1
	;;
esac

