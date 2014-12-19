
//HERE WE WILL REQUIRE ALL OUR SERVICES
module.exports = function(){
	var sensors = require('./sensorsService/sensors');

	sensors.start();
	console.log("starting app");
};
