'use strict';

var _ = require('lodash');
var React = require('./react.model');

// Get list of reacts
exports.index = function(req, res) {
  React.find(function (err, reacts) {
    if(err) { return handleError(res, err); }
    return res.json(200, reacts);
  });
};

// Get a single react
exports.show = function(req, res) {
  React.findById(req.params.id, function (err, react) {
    if(err) { return handleError(res, err); }
    if(!react) { return res.send(404); }
    return res.json(react);
  });
};

// Creates a new react in the DB.
exports.create = function(req, res) {
  React.create(req.body, function(err, react) {
    if(err) { return handleError(res, err); }
    return res.json(201, react);
  });
};

// Updates an existing react in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  React.findById(req.params.id, function (err, react) {
    if (err) { return handleError(res, err); }
    if(!react) { return res.send(404); }
    var updated = _.merge(react, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, react);
    });
  });
};

// Deletes a react from the DB.
exports.destroy = function(req, res) {
  React.findById(req.params.id, function (err, react) {
    if(err) { return handleError(res, err); }
    if(!react) { return res.send(404); }
    react.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}