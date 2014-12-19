'use strict';

angular.module('nodeServerApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('sensors', {
        url: '/sensors',
        templateUrl: 'app/sensors/sensors.html',
        controller: 'SensorsCtrl',
        authenticate: true	
      })

      .state('sensorsEdit', {
        url: '/sensors/edit/:id',
        templateUrl: 'app/sensors/sensors-form.html',
        controller: 'SensorsEditorCtrl',
        authenticate: true	
      })

      .state('sensorsDetail', {
        url: '/sensors/view/:id',
        templateUrl: 'app/sensors/sensor-detail.html',
        controller: 'SensorDetailCtrl',
        authenticate: true  
      })

      .state('sensorsCreate', {
        url: '/sensors/add',
        templateUrl: 'app/sensors/sensors-form.html',
        controller: 'SensorsEditorCtrl',
        authenticate: true	
      });
  });