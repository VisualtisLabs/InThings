'use strict';

angular.module('nodeServerApp')
  .service('Values', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return $resource('/api/values/:controller/:sensor/:date/:other', {
      id: '@_id'
    },
    {
      get: {
        method: 'GET'
      },
      post: {
        method: 'POST',
      },
      getSensorDateValues: {
        method: 'GET',
        params: {
          controller:'exists'
        }
      }
    }
  );
  });
