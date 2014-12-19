/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var React = require('./react.model');

exports.register = function(socket) {
  React.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  React.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('react:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('react:remove', doc);
}