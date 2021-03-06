var request = require('request');
var eddystoneBeacon = require('eddystone-beacon');
var iBeacon = require('bleacon');

var app = [];
var fs = require('fs');
var array = fs.readFileSync('/etc/default/piBeacon').toString().split("\n");
for(i in array) {
	if (array[i].toString()) {
		var variabile = array[i].toString().split('="');
		var key = variabile[0];
		var val = variabile[1].replace('"', '');
		app[key] = val;
	}
}

app['INTERVAL'] = app.INTERVAL * 1000;
app['MACADDRESS'] = require('os').networkInterfaces()['eth0'][0].mac;

if ( app.NAME == undefined || app.NAME == "" ) {
	throw new Error('Please fill in NAME in /etc/default/piBeacon');
} else if ( app.INTERVAL == undefined || app.INTERVAL == "" ) {
	throw new Error('Please fill in INTERVAL in /etc/default/piBeacon');
} else if ( app.DEVICES == undefined || app.DEVICES == "" ) {
	throw new Error('Please fill in DEVICES in /etc/default/piBeacon');
} else if ( app.DEVICES > 4 ) {
	throw new Error('Raspberry Pi has only 4 usb ports so maximum 4 devices');
} else if ( app.MACADDRESS == undefined || app.MACADDRESS == "" ) {
	throw new Error('Cannot get device eth0 mac address');
}

app.daemon = function(DEVICE_ID)
{
	app.run(DEVICE_ID);
	setInterval(app.run(DEVICE_ID), app.INTERVAL);
}

app.run = function(DEVICE_ID)
{
	if (app.SERVER){
		request({
			url: app.SERVER+'&macaddress='+app.MACADDRESS+'&name='+app.NAME+'&device_id='+DEVICE_ID,
			json: true
		}, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				if (body.type == 'eddystone-url') {
					if (body.url && body.url != app.urlcache) {
						eddystoneBeacon.advertiseUrl(body.url);
						app.urlcache = body.url;
					}
				} else if (body.type == 'eddystone-uid') {
					if (body.namespaceId && body.instanceId && body.namespaceId+'-'+body.instanceId != app.uidcache) {
						eddystoneBeacon.advertiseUid(body.namespaceId, body.instanceId);
						app.uidcache = body.namespaceId+'-'+body.instanceId;
					}
				} else if (body.type == 'ibeacon') {
					if (body.uuid && body.uuid != app.uuidcache) {
						var uuid = body.uuid;
						var major = body.major ? body.major : 0; // 0 - 65535
						var minor = body.monor ? body.minor : 0; // 0 - 65535
						var measuredPower = body.measuredPower ? body.measuredPower :  -59; // -128 - 127 (measured RSSI at 1 meter)

						iBeacon.startAdvertising(uuid, major, minor, measuredPower);
						app.uuidcache = body.uuid;
					}
				}
			}
		});
	} else {
		eddystoneBeacon.advertiseUrl("http://www.example"+DEVICE_ID+".com/");
	}
}

module.exports = app
