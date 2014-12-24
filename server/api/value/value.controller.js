'use strict';

var _ = require('lodash');
var Value = require('./value.model');
var http = require('request');

// Get list of values
exports.index = function(req, res) {
  Value.find(function (err, values) {
    if(err) { return handleError(res, err); }
    return res.json(200, values);
  });
};

// Get a single value
exports.show = function(req, res) {
  Value.findById(req.params.id, function (err, value) {
    if(err) { return handleError(res, err); }
    if(!value) { return res.send(404); }
    return res.json(value);
  });
};


//Check if exists a value which contains a date and a sensor
exports.sensorDateExists = function(req, res) {
  Value.findOne({date: req.params.date, sensor: req.params.sensor}, function (err, value) {
    if(err) { return handleError(res, err); }
    if(!value) { return res.send(400); }
    return res.json(value);
  });
};


//Add a value to an existing document or create new one (for today's date)
exports.updateSensorDateValues = function(req, res) {
  var date = new Date();
  var dateString = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate());
  
  Value.findOne({date: dateString, sensor: req.params.sensor}, function (err, value) {
    if(err) { return handleError(res, err); }

    if(!value) { //CREATE NEW VALUE VALUE

      var v = {
            date: dateString,
            sensor: req.params.sensor,
            times: [date],
            values: [req.params.value],
          }
      Value.create(v, function(err,val) {
        if(err) { return handleError(res, err); }
          return res.json(201, val);
      }); 
    
    }

    else{ //UPDATE EXISTING VALUE

      value.values.push(req.params.value);
      value.times.push(date);
      var v = {
            date: value.date,
            sensor: value.sensor,
            times: value.times,
            values: value.values,
          }
      Value.findOneAndUpdate(value._id,v,function(err,val){
        if(err) { return handleError(res, err); }
          return res.json(200, val);
      });

    }

    http.get("http://localhost:9000/api/sensors/zeroUpdate/"+req.params.sensor, function(error, response, body){
      if(!error){
        console.log("updated to 0 sensor: "+req.params.sensor);
      }
    });

  });
};

// Creates a new value in the DB.
exports.create = function(req, res) {
  Value.create(req.body, function(err, value) {
    if(err) { return handleError(res, err); }
    return res.json(201, value);
  });
};

exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Value.findById(req.params.id, function (err, value) {
    if (err) { return handleError(res, err); }
    if(!value) { return res.send(404); }
    var updated = _.merge(value, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, value);
    });
  });
};

// Deletes a value from the DB.
exports.destroy = function(req, res) {
  Value.findById(req.params.id, function (err, value) {
    if(err) { return handleError(res, err); }
    if(!value) { return res.send(404); }
    value.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


function handleError(res, err) {
  return res.send(500, err);
}