'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ValueSchema = new Schema({
  date: String,
  times: [Date],
  values: [],
  sensor: String
});

module.exports = mongoose.model('Value', ValueSchema);