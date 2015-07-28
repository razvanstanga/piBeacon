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
				if (body.url != app.urlcache) {
					beacon.advertiseUrl(body.url);
					app.urlcache = body.url;
				}
			}
		});
	} else {
		beacon.advertiseUrl("http://www.example"+DEVICE_ID+".com/");
	}
}

module.exports = app
