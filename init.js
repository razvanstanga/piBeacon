var config = [];
var fs = require('fs');
var array = fs.readFileSync('default/piBeacon').toString().split("\n");
for(i in array) {
	var variabile = array[i].toString().split("=");
	var key = variabile[0];
	var val = variabile[1];
	config[key] = val;
}
config['INTERVAL'] = config.INTERVAL * 1000;
config['macaddress'] = require('os').networkInterfaces()['eth0'][0].mac;

module.exports = config