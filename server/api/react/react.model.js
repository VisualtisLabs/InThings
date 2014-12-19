'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReactSchema = new Schema({
  type: { type: String, default: '', lowercase: true },
  value: { type: String, default: '0', lowercase: true },
  time: {type: Boolean, default: false },
  timeStart:  {type: Number, default: -1 },
  timeEnd:  {type: Number, default:  -1 },
  email: { type: String, default: '', lowercase: true },
  message: { type: String, default: '' },
  twitter: { type: String, default: '' },
  twitterMessage: { type: String, default: '' },
  request: { type: String, default: '' },
  lastNotice: {type: Number, default: -1}
});

module.exports = mongoose.model('React', ReactSchema);