'use strict';

var service = null;

var sensorsService = function(){

var Sensors = require('../../api/sensors/sensors.model');
var Value = require('../../api/value/value.model');
var React = require('../../api/react/react.model');
var ValueCtrl = require('../../api/value/value.controller');
var http = require("request");
var relayr = require("relayr");
var mail = require("../mail");
var twitter = require("../twitter");

var relayrSensors = [];
var go = true;

if(service == null){
	service = "";
	service = new sensorsService();
}
else{

this.sendRequest = function(sensor){
	var d = new Date();
	
	console.log(d.getTime() +" - "+(sensor.last_update + sensor.r_time*1000 )	);
	if(d.getTime() > (sensor.last_update + sensor.r_time*1000 )){
		http.get(sensor.url, function(error, response, body){
			if (!error && response.statusCode == 200) {
		        // Print out the response body
		        console.log(sensor.url);
		        d = new Date();
		        sensor.last_update = d.getTime(); 
		        sensor.save();
		    }
		});
	}
};

this.registerRelayr = function(sensor){

	var t = this;

	var relayrKeys = {
	    app_id: sensor.opts.app,
	    dev_id: sensor.opts.device,
	    token:  sensor.opts.token
	};

	relayrSensors.push(sensor);

	relayr.connect(relayrKeys);

	relayr.listen(function(err,data,deviceid){
    //fires for every sensor event
    if (err) {
        console.log("Oh No!", err)
    } 
    else {
    	if(deviceid == sensor.opts.device){
    		t.processRelayrSensor(sensor, data);
    	}
    }
	
  });

};

this.start = function(){

		var service = this;

		Sensors.find().populate("react").exec(function (err, sensorss) {
		    if(err) { return handleError(res, err); }
		    var array = sensorss;
		   
		    array.forEach(function(sensor, index){
		    	
		    	if(sensor.type == "reactive" && sensor.opts.model == "relayr"){
		    		
		    		var isRelayred = false;
		    		
		    		relayrSensors.forEach(function(rSensor, index){
		    			if(JSON.stringify(rSensor._id) == JSON.stringify(sensor._id)) {
		    				rSensor.react = sensor.react;
		    				isRelayred = true;
		    			}
		    		});

		    		if(!isRelayred&&go){
		    			service.registerRelayr(sensor);
		    		}
		    	}

		    	else if(sensor.type == "catch"){
		    		var d = new Date();
		    		if(d.getTime()>(sensor.last_update+(sensor.r_time*1000))){
		    			updateSensorLastTime(sensor);
		    			catchData(sensor); 
		    		}
		    	}

		    	else if(sensor.type == "passive"){	
		    		if(sensor.last_update == 0){
		    			updateSensorLastTime(sensor);
		    			updateValues(sensor);
		    		}
		    	}

		    });

		    if(go)
		  		service.start();    
		});
	};

var catchData = function(sensor){
	var val=false;
	http.get(sensor.url, function(error, response, body){
		try { body = JSON.parse(body);}
		catch(e){ return;}
		if(typeof sensor.opts.metric != undefined || sensor.opts.metric != ""){
			val = body[sensor.opts.metric];
		}
		else val = body;
		
		if(val){
			updateValues(sensor, val);
		}

	});
}

var updateSensorLastTime = function(sensor){
	if(sensor.type == "catch"){
		var d = new Date();
		sensor.last_update = d.getTime();
	}

	if(sensor.type == "passive"){
		sensor.last_update = 1;
	}

	var id = sensor._id;
	
	var sensorClone = JSON.parse(JSON.stringify(sensor.toObject()));
	sensorClone.react = sensor.react._id;
	delete sensorClone._id;
	Sensors.findByIdAndUpdate(id, sensorClone, function(err,sensor){
		if(err) console.log("ERROR ACTUALIZANDO LAST_UPDATE: "+err);
	});

}


var updateValues = function(sensor, val){
	var date = new Date(Date.now());
	var dateString = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate());
	http.get("http://localhost:9000/api/values/exists/"+sensor._id+"/"+dateString, function(error, response, body){

				if (!error && response.statusCode == 400) {

					var v = {
						date: dateString,
						sensor: sensor._id,
						times: [date],
						values: [val],
					}

					Value.create(v, function(err, value) {
					    if(err) { console.log("ERROR GUARDANDO VALOR: "+err); }
					    return true;
					  });
				}

				else if(!error && response.statusCode == 200){

					body = JSON.parse(body);

					if(!body.values.length || body.values == undefined || typeof body.values == undefined){
						body.values = [];
						body.times = [];
					}
					if(sensor.type == 'passive')
						val = body.values[body.values.length-1];


						checkReact(sensor,val);

					if(sensor!= 'passive'){

					body.values.push(val);
					body.times.push(date);

					var id = body._id;
					
					delete body._id;

					Value.findByIdAndUpdate( id, body, function(err, value) {
					    if(err) { console.log("ERROR ACTUALIZANDO VALOR: "+err); }
					    return true;
					  });
				}

				}

				else if(error) console.log(error);
			});

}

this.processRelayrSensor = function(sensor, data){
	var t = this;
	sensor.last_update = (new Date()).getTime();
	    	console.log(data[sensor.opts.metric]);
	    	
	    	var val = data[sensor.opts.metric];
	    	if(typeof val == undefined || val == undefined){
	    		t.unsubscribeAll();
	    	}

	    	else{
	    		updateValues(sensor, val);
    		}	
}	

/* SEND NOTICES */

var sendMail = function(react,val){
	mail.sendMail(react.email, "Aviso InThings", react.message+"\n"+"Valor recibido: "+val+".",function(){return null;});
}

var sendTwitterMessage = function(react,val){
	twitter.sendDirectMessage(react.twitter,react.twitterMessage+". Valor recibido: "+val);
}

var sendReactRequest = function(react,val){
	var req = react.request.replace("$r_val",val+"");
	console.log(req);
	http.get(req, function(error, response, body){
			if (!error && response.statusCode == 200) {
		        // Print out the response body
		        console.log(body);
		    }
		});
}

/* UPDATE NOTICE FOR LAST VALUE */

var updateNotice = function(react, val){

		react.lastNotice = val;

		var saveReact = {};
		saveReact.timeStart = react.timeStart;
		saveReact.timeEnd = react.timeEnd;
		saveReact.time = react.time;
		saveReact.value = react.value;
		saveReact.type = react.type;
		saveReact.lastNotice = react.lastNotice;
		saveReact.email = react.email;
		saveReact.message = react.message;
		saveReact.twitter = react.twitter;
		saveReact.twitterMessage = react.twitterMessage;
		saveReact.request = react.request;

		React.findByIdAndUpdate( react._id, saveReact, function(err, value) {
					    if(err) { console.log("ERROR ACTUALIZANDO REACT: "+err); }
					    return true;
					  });
}


/* RUN NOTICE FUNCS */

var sendReact = function(react, val){
	var date = new Date();
	console.log(react.time + " " + react.timeStart + " " + react.timeEnd);
	if((react.timeStart != -1 && react.timeEnd != -1 && date.getHours() >= react.timeStart && date.getHours() <= react.timeStart) || (react.time && react.timeStart == -1 && react.timeEnd == -1)){
		if(react.email!="")
			sendMail(react, val);
		if(react.twitter!="")
			sendTwitterMessage(react, val);

		if(react.request!="")
			sendReactRequest(react, val);
	}

}

/* CHECK IF REACT MUST BE EXEC */

var checkReact = function(sensor,val){
	var react = sensor.react;
	if(react.type!="" && react.value!="" && (react.email!="" || react.twitter!="")){

		switch(react.type){
			case "gt" : 
				if(parseFloat(val) > parseFloat(react.value) && react.lastNotice <= react.value){
					console.log("Aviso mayor que...");
					sendReact(react,val);
				}	
			break;
			case "lt" : 
				if(parseFloat(val) < parseFloat(react.value) && react.lastNotice >= react.value){
					console.log("Aviso menor que...");
					sendReact(react,val);
				}	
			break;
			case "eq" : 
				if(parseFloat(val) == parseFloat(react.value) && ((react.lastNotice < react.value) || (react.lastNotice > react.value))){
					console.console.log(message);("Aviso igual que...");
					sendReact(react,val);
				}	
			break;
		}
		updateNotice(react,val);
	}
}

/* REMOVE ALL SENSORS FROM PUBNUB CONNECTION AND RESTART SERVICE */

this.unsubscribeAll = function(){
	go = false;
	console.log("UNSUBSCRIBE SENSOR");
	relayr.unsubscribeAll();
	relayrSensors = [];

	service = new sensorsService();
	service.start();
};
}

}

sensorsService();

module.exports = service;
