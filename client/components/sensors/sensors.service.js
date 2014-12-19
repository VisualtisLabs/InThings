'use strict';

angular.module('nodeServerApp')
  .service('Sensors', function ($resource) {
    return $resource('/api/sensors/:controller/:id', {
      id: '@_id'
    },
    {
      get: {
        method: 'GET'
      },
      post: {
        method: 'POST',
      },
      getSensorUser: {
        method: 'GET',
        params: {
          controller:'sensorUser'
        }
      },
      getSensorDetail: {
        method: 'GET',
        params: {
          controller:'sensorDetail'
        }
      }
    }
  );

  });
