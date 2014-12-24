'use strict';

var express = require('express');
var controller = require('./sensors.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/zeroUpdate/:id', controller.setZeroUpdate);
router.get('/mylist', auth.isAuthenticated(), controller.myList);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.get('/info/:id', controller.data);
router.get('/sensorUser/:id', auth.isAuthenticated(), controller.showSensorUser);
router.get('/sensorDetail/:id', auth.isAuthenticated(), controller.showSensorDetail);
router.get('/duplicate/:id', auth.isAuthenticated(), controller.duplicate);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;