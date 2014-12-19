'use strict';

angular.module('nodeServerApp')

.controller('SensorDetailCtrl', function ($stateParams, $http, $scope, $location, Sensors, Values, Auth) {

     $scope.sensor = "";

     $scope.chartObject = {};

     $scope.chartObject.type = "LineChart";

     
      Sensors.getSensorDetail({id: $stateParams.id},function(message){
      console.log(message);
      message.creationDate = (new Date(message.creationDate)).toLocaleString(); 

      if(message.user._id != Auth.getCurrentUser()._id && !Auth.isAdmin())
            $location.path('/');
          else $scope.sensor = message;

      console.log($scope.sensor);
      

      $scope.reactConditions = [
        {
          name: "Select condition",
          val:""
        },

        {
          name: "Greater than...",
          val:"gt"
        },
        {
          name: "Less than...",
          val:"lt"
        },
        {
          name: "Equals...",
          val:"eq"
        }
     ];

     $scope.timeConditions = [
        {
          name: "Select condition",
          val:""
        },
        {
          name: "Any time",
          val:"any"
        },

        {
          name: "Between...",
          val:"bwn"
        }
     ];

     $scope.hours = [
        {
          val:"0"
        },
        {
          val:"1"
        },

        {
          val:"2"
        },
        {
          val:"3"
        },
        {
          val:"4"
        },
        {
          val:"5"
        },
        {
          val:"6"
        },
        {
          val:"7"
        },
        {
          val:"8"
        },
        {
          val:"9"
        },
        {
          val:"10"
        },
        {
          val:"11"
        },
        {
          val:"12"
        },
        {
          val:"13"
        },
        {
          val:"14"
        },
        {
          val:"15"
        },
        {
          val:"16"
        },
        {
          val:"17"
        },
        {
          val:"18"
        },
        {
          val:"19"
        },
        {
          val:"20"
        },
        {
          val:"21"
        },
        {
          val:"22"
        },
        {
          val:"23"
        },
     ];


     $scope.updateEndHour = function(startHour) {
        $scope.endHours = $scope.hours.slice(startHour);
        console.log($scope.endHours);
        endHours.append("")
    }

    $scope.reactEmail = {
      "email" : $scope.sensor.react.email,
      "message" : $scope.sensor.react.message,
      "placeholder" : "Email address"
    }

    if( typeof $scope.reactEmail.email != undefined && $scope.reactEmail.email.length){
      $scope.reactEmail.checked=true;
    }

    else $scope.reactEmail.checked=false;


    $scope.reactRequest = {
      "request" : $scope.sensor.react.request,
      "placeholder" : "Request URL"
    }

    if( typeof $scope.reactRequest.request != undefined && $scope.reactRequest.request.length){
      $scope.reactRequest.checked=true;
    }

    else $scope.reactRequest.checked=false;
   


    $scope.reactTwitter = {
      "user" : $scope.sensor.react.twitter,
      "message" : $scope.sensor.react.twitterMessage,
       "placeholder" : "Twitter user"
    }

    if( typeof $scope.reactTwitter.user != undefined && $scope.reactTwitter.user.length){
      $scope.reactTwitter.checked=true;
    }

    else $scope.reactTwitter.checked=false;

      $scope.chartObject.data = {"cols": [
     {id: "t", label: "Fecha", type: "string"},
     {id: "s", label: $scope.sensor.opts.metric, type: "number"}
     ], "rows": [
     ]};


     $scope.reactCondition = $scope.sensor.react.type;
     $scope.startTimeHours = ""+($scope.sensor.react.timeStart);
     $scope.endTimeHours = ""+($scope.sensor.react.timeEnd);
     
     if($scope.sensor.react.time && $scope.sensor.react.timeStart==-1){
        $scope.timeCondition = "any"
     }

     else if(!$scope.sensor.react.time)
        $scope.timeCondition = ""

     else $scope.timeCondition = "bwn";

     $scope.reactLimit = $scope.sensor.react.value;
     $scope.endHours = $scope.hours;   


      $scope.resetTime = function(){
        this.endTimeHours = -1;
        this.startTimeHours = -1;
      }

      $scope.resetTwitter = function(){
        this.reactTwitter.user = "";
        this.reactTwitter.message = "";
      }

      $scope.resetRequest = function(){
        this.reactRequest.request = "";
      }

      $scope.resetEmail = function(){
        this.reactEmail.email="";
        this.reactEmail.message = "";
      }

      $scope.saveReact = function(event){

          $(event.target).html("Saving...");

          this.sensor.react.email = this.reactEmail.email;
          this.sensor.react.message = this.reactEmail.message;
          this.sensor.react.twitter = this.reactTwitter.user;
          this.sensor.react.twitterMessage = this.reactTwitter.message;
          this.sensor.react.request = this.reactRequest.request;

          console.log( this.reactCondition + " ------ " + this.reactLimit);

          this.sensor.react.type = this.reactCondition;

          if(this.timeCondition != ""){
            this.sensor.react.time = true;
          }
          else this.sensor.react.time = false;

          this.sensor.react.timeStart = parseInt(this.startTimeHours);
          this.sensor.react.timeEnd = parseInt(this.endTimeHours);
          this.sensor.react.value = this.reactLimit;


          console.log(this.sensor.react);
        
          $http.put("api/react/"+this.sensor.react._id, this.sensor.react).success(function(message) {
              $(event.target).html("Saved");
              $location.path('/sensors');
            }); 

      }

      generateGraph();
      setInterval(generateGraph, 15000);

    });

    function generateGraph(){

      var date = new Date(Date.now());
      Values.getSensorDateValues(
        {sensor: $stateParams.id, date: (date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())},
        function(data){
          var rows = [];
          for (var i = 0; i<data.values.length;i++){
            rows.push(
              {c: [
                {v: (new Date(data.times[i])).toLocaleTimeString()},
                {v: data.values[i]},
                ]});

          }

          $scope.chartObject.data.rows = rows;
        });

    }
});
