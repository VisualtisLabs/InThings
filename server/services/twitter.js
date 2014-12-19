"use strict";

var Twitter = require('node-twitter'), twitter;

// You could use node-passport and passport-twitter to get an access token easily
// See http://blog.coolaj86.com/articles/how-to-tweet-from-nodejs.html
twitter = new Twitter.RestClient(
	"CLIENT"
	, "SECRET"
	, "TOKEN"
	, "TOKEN SECRET"
	);

exports.sendDirectMessage = function(to, message){
	console.log(to+" ---- "+ message);
	twitter.directMessagesNew(
		{ screen_name: to,
	 	  text: message
	}
	, function (err, data) {
		if (err) {
			console.error(err);
		} else {
			console.log("TWITTER MESSAGE: "+data);
		}
	}
	);
}