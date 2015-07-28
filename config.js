var request = require('request');
var beacon = require('eddystone-beacon');

var config = [];
var fs = require('fs');
var array = fs.readFileSync('/etc/default/piBeacon').toString().split("\n");
for(i in array) {
	var variabile = array[i].toString().split("=");
	var key = variabile[0];
	var val = variabile[1];
	config[key] = val;
}
config['INTERVAL'] = config.INTERVAL * 1000;
config['macaddress'] = require('os').networkInterfaces()['eth0'][0].mac;

config.daemon = function(ID){
	config.run(ID);
	setInterval(config.run(ID), config.INTERVAL);
}

config.run = function(ID){
	if (config.SERVER){
		request({
			url: config.SERVER+'&macaddress'+config.macaddress,
			json: true
		}, function (error, response, body) {
			if (!error && response.statusCode === 200) {
				if (body.url != config.urlcache) {
					beacon.advertiseUrl(body.url);
					config.urlcache = body.url;
				}
			}
		});
	} else {
		beacon.advertiseUrl("http://www.example"+ID+".com/");
	}
}

module.exports = config