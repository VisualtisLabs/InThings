'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var sensorTypes = ("catch passive reactive test").split(" ");
var urlMatch = [ new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"), "Not a valid URL" ];

var SensorsSchema = new Schema({
  name: { type: String, default: ""},
  url:  { type: String, default: ""},
  type: { type: String, enum: sensorTypes, default: "catch" },
  r_time: {	type:Number, min: 1, default: 10	},
  value: { type: String, min: 0, default: 0 },
  last_update: { type:Number, min: 0 },
  opts: {},
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  react: { type: Schema.Types.ObjectId, ref: 'React' }
});

SensorsSchema
  .virtual('data')
  .get(function() {
    return {
      '_id' : this._id,
      'name': this.name,
      'value': this.value,
      'update': this.last_update,
      'type': this.type,
      'opts' : this.opts,
      'creationDate' : this._id.getTimestamp(),
      'usermail' : this.user.email,
      'username' : this.user.name,
      'user' : this.user
    };
  });

SensorsSchema
  .virtual('detail')
  .get(function() {
    return {
      '_id' : this._id,
      'name': this.name,
      'value': this.value,
      'update': this.last_update,
      'type': this.type,
      'opts' : this.opts,
      'creationDate' : this._id.getTimestamp(),
      'usermail' : this.user.email,
      'username' : this.user.name,
      'url' : this.url,
      'r_time' : this.r_time,
      'react' : this.react,
      'user' : this.user
    };
  });

module.exports = mongoose.model('Sensors', SensorsSchema);