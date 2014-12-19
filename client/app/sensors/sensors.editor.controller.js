'use strict';

angular.module('nodeServerApp')
  .controller('SensorsEditorCtrl', function ($stateParams, $scope, $http, $location, Sensors, Auth, User, SweetAlert) {

    $scope.sensor = "";

    if($stateParams.id){

        $scope.aim = "Edit";

        $http.get("api/sensors/"+$stateParams.id).success(function(message) {
          if(message.user != Auth.getCurrentUser()._id && !Auth.isAdmin())
            $location.path('/');
          else $scope.sensor = message;
        });

         $scope.save = function() {
            if(this.validation()){
            $("button").html("Saving...");

            $http.put("api/sensors/"+$stateParams.id, $scope.sensor).success(function(message) {
              SweetAlert.swal("Sensor saved", "Now you can see your sensor updated on your sensor list!", "success");
              $location.path('/sensors');
            });
          }
       }
    }

    else{

        $scope.aim = "New";

        $scope.sensor = {
          "name": "",
          "url": "",
          "type": "catch",
          "r_time": 10,
          "opts" : {}
        };

        $scope.save = function() {
          if(this.validation()){
          $("button").html("Saving...");
          
            $scope.sensor.user = Auth.getCurrentUser()._id;
              console.log($scope.sensor.user);

            $http.post("api/sensors/", $scope.sensor).success(function(message) {


              SweetAlert.swal("Sensor saved", "Now you can see your sensor updated on your sensor list!", "success");

              $location.path('/sensors');
            });
        }
      }
    }

    function showValidationProblem(){
      SweetAlert.swal({
           title: "Validation problem",
           text: "Please fill out all fields!",
           type: "warning",
           showCancelButton: false,
           confirmButtonText: "OK"
        }, 
        function(){ 
           return false;
        });
    }



    $scope.validation = function() {
      if(this.sensor.type == "reactive" && (this.sensor.opts.model == "" || this.sensor.opts.device == "" || this.sensor.opts.app == "" || this.sensor.opts.token == "")){
        showValidationProblem();
        return false;
      }

      else if(this.sensor.type == "catch" && (this.sensor.url == "" || this.sensor.r_time == "")){
        showValidationProblem();
        return false;
      }

      return true;
    }

    $scope.resetType = function(){
      this.sensor.opts.model = "";
      this.sensor.opts.app = "";
      this.sensor.opts.device = "";
      this.sensor.opts.token = "";
      this.sensor.opts.metric = "";
      this.sensor.url = "";
      this.sensor.r_time = 10;
    }

});