var request = require('request');
var beacon = require('eddystone-beacon');

var app = [];
var fs = require('fs');
var array = fs.readFileSync('/etc/default/piBeacon').toString().split("\n");
for(i in array) {
	var variabile = array[i].toString().split("=");
	var key = variabile[0];
	var val = variabile[1];
	app[key] = val;
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
	throw new Error('Raspberry Pi has only 4 usb ports so maximul 4 devices');
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
				if (body.url && body.url != app.urlcache) {
					beacon.advertiseUrl(body.url);
					app.urlcache = body.url;
				} else if (body.uid && body.uid != app.uidcache) {
					//beacon.advertiseUid(body.uid); disable until eddystone-beacon supports it or use other library
					app.uidcache = body.uid;
				}
			}
		});
	} else {
		beacon.advertiseUrl("http://www.example"+DEVICE_ID+".com/");
	}
}

module.exports = app