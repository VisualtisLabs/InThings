'use strict';

var _ = require('lodash');
var Sensors = require('./sensors.model');
var React = require('../react/react.model');
var mongoose = require('mongoose');
var service = require('../../services/sensorsService/sensors');

// Get list of sensors
exports.index = function(req, res) {
  if(req.user.role=='admin'){
    Sensors.find(function (err, sensors) {
      if(err) { return handleError(res, err); }
      return res.json(200, sensors);
    });
  }
  else{
    return res.send(403);
  }
};

// Get use list of sensors
exports.myList = function(req, res) {
  if(req.user.role=='admin'){
    Sensors.find(function (err, sensors) {
      if(err) { return handleError(res, err); }
      return res.json(200, sensors);
    });
  }
  else{
    Sensors.find({'user':req.user._id}).exec(function (err, sensors) {
      if(err) { return handleError(res, err); }
      return res.json(200, sensors);
    });
  }
};

// Get a single sensors
exports.show = function(req, res) {
  Sensors.findById(req.params.id, function (err, sensors) {
    if(err) { return handleError(res, err); }
    if(!sensors) { return res.send(404); }
    if(JSON.stringify(req.user._id) != JSON.stringify(sensors.user)  && req.user.role!='admin'){
      return res.send(403);
    }
    return res.json(sensors);
  });
};

// Creates a new sensors in the DB.
exports.create = function(req, res) {
  //Keep last value at 0; 
  req.body.value = 0;
  req.body.last_update = 0;
  req.body.user = req.user.id;

  React.create({},function(err,react){
    if(err) { return handleError(res, err); }

    req.body.react = react;
    console.log(req.body);
    Sensors.create(req.body, function(err, sensors) {
      if(err) { return handleError(res, err); }
      return res.json(201, sensors);
    });

  });
};

// Updates an existing sensors in the DB.
exports.update = function(req, res) {
  if(req.body.user == req.user._id || req.user.role=='admin'){
  if(req.body._id) { delete req.body._id; }
  Sensors.findById(req.params.id, function (err, sensors) {
    if (err) { return handleError(res, err); }
    if(!sensors) { return res.send(404); }
    sensors.opts = req.body.opts;
    var updated = _.merge(sensors, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      setTimeout(function(){
        console.log(global.actualService);
        service.unsubscribeAll()},2000);
      return res.json(200, sensors);
    });
  });
}
else return res.send(403);
};

// Deletes a sensors from the DB.
exports.destroy = function(req, res) {
  Sensors.findById(req.params.id, function (err, sensors) {
    if(err) { return handleError(res, err); }
    if(!sensors) { return res.send(404); }
    sensors.remove(function(err) {
      if(err) { return handleError(res, err); }
      service.unsubscribeAll();
      return res.send(204);
    });
  });
};

exports.duplicate = function(req, res) {
  if(req.user._id == req.body.user || req.user.role == 'admin'){
    Sensors.findById(req.params.id,  function(err, doc) {
          doc._id = mongoose.Types.ObjectId();
          doc.isNew = true; //<--------------------IMPORTANT
          doc.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, doc);
          });
      }
  );
  }
  else return res.send(403);
};

/**
 * Get a sensor and it's user
 */
exports.showSensorUser = function (req, res, next) {
  Sensors.findById(req.params.id).populate('user').exec(function(err, doc) {
    if(err) return res.send(500);
      var r = doc;
      if(JSON.stringify(req.user._id) != JSON.stringify(doc.user._id) && req.user.role!='admin'){
        return res.send(403);
      }
     return res.json(r.data);
  });

};

/**
 * Get a sensor and it's detail data
 */
exports.showSensorDetail = function (req, res, next) {
  Sensors.findById(req.params.id).populate('user react').exec(function(err, doc) {
    if(err) return res.send(500);
    if(JSON.stringify(req.user._id) != JSON.stringify(doc.user._id)  && req.user.role!='admin'){
      return res.send(403);
    }
      var r = doc;
     return res.json(r.detail);
  });

};

// Get a single sensors
exports.data = function(req, res) {
  Sensors.findById(req.params.id, function (err, sensors) {
    if(err) { return handleError(res, err); }
    if(!sensors) { return res.send(404); }
    return res.json(sensors.data);
  });
};


function handleError(res, err) {
  return res.send(500, err);
}