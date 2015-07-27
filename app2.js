var config = require('./init');
var request = require('request');
var beacon = require('eddystone-beacon');

setInterval(function(){
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
		beacon.advertiseUrl("http://www.example3.com/");
	}
}, config.INTERVAL);