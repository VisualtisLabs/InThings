/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Sensors = require('./sensors.model');

exports.register = function(socket) {
  Sensors.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Sensors.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('sensors:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('sensors:remove', doc);
}