'use strict';

angular.module('nodeServerApp')
  .controller('SensorsCtrl', function ($scope, $http, $location, Sensors, Auth, User, $state) {
  	$http.get("api/sensors/mylist").success(function(message) {

      var sensors = message;

      function init(i){
        if(sensors.length>i){
          Sensors.getSensorUser({id: sensors[i]._id},function(sensor){
           console.log(sensor);
            sensors[i] = sensor;
          });

          init(i+1);
          
        }
        else{
           $scope.sensorList = sensors;
        }

      };

      init(0);
      
    });

    $scope.isSensorUser = function(sensor){
      console.log(JSON.stringify(sensor.user._id) +" -- "+ JSON.stringify(Auth.getCurrentUser()._id))
      return JSON.stringify(sensor.user._id) == JSON.stringify(Auth.getCurrentUser()._id);
    }

    $scope.isAdmin = Auth.isAdmin();

    $scope.message = 'Hello';

    $scope.delete = function(sensor) {
      Sensors.remove({ id: sensor._id });
      angular.forEach($scope.sensorList, function(s, i) {
        if (s === sensor) {
          $scope.sensorList.splice(i, 1);
        }
      });
    }

      $scope.edit = function(sensor) {
        $location.path("/sensors/edit/"+sensor._id);
      }

      $scope.duplicate = function(sensor) {
        $http.get("api/sensors/duplicate/"+sensor._id, null).success(function() {
              $state.reload();
            });
      }

      $scope.add = function() {
        $location.path("/sensors/add");
      }

});
