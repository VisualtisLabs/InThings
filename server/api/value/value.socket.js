/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Value = require('./value.model');

exports.register = function(socket) {
  Value.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Value.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('value:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('value:remove', doc);
}