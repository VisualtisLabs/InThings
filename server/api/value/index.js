'use strict';

var express = require('express');
var controller = require('./value.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/exists/:sensor/:date', controller.sensorDateExists);
router.get('/update/:sensor/:value', controller.updateSensorDateValues);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;