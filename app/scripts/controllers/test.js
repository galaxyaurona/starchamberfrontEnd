'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:TestctrlCtrl
 * @description
 * # TestctrlCtrl
 * Controller of the starChamberUiApp
 */
angular.module('starChamberUiApp')
  .controller('TestCtrl', function ($scope,$rootScope,$filter,$http) {

    // status : scheduled- pending - polling
    // scheduled: modified or rescheduled or cancelled or modifiable
    // pending: polling
    $scope.backendRoute = "http://www.ltuteamg.com:8000/api/users/auth"
    ;
    $scope.submit = function(action){
      console.log($scope.jsonData);
      if (!angular.isDefined($scope.jsonData)){
        $scope.jsonDataParsed = {};
      }else{
        if (angular.isString($scope.jsonData))
          $scope.jsonDataParsed = JSON.parse($scope.jsonData);
      }

      $scope.method = "";
      $scope.success = false;
      switch (action){
        case 1:$scope.method='POST';break;
        case 2:$scope.method='GET';break;
        case 3:$scope.method='PUT';break;

      }


      $scope.config = "emtpy";
      $scope.header = "empty";
      $scope.data ="empty";
      $scope.status = "empty";
      var req = {
        method:$scope.method,
        url:$scope.backendRoute,
        headers:{
          'Content-type': 'application/json'
        },
        data: $scope.jsonDataParsed
      }

      $http(req).then(function(response){
        $scope.success = true;
        $scope.response = JSON.stringify(response, null ,4);
        $scope.config = JSON.stringify(response.config, null, 4);
        $scope.data = JSON.stringify(response.data, null, 4);
        $scope.status = JSON.stringify(response.status, null, 4);
        $scope.header = JSON.stringify(response.headers, null, 4);

      },function(error){
        $scope.success = false;
        $scope.data ="Error response from server";
      });
    }

  });


