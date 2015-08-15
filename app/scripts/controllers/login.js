'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the starChamberUiApp
 */
angular.module('starChamberUiApp')
  .controller('LoginCtrl', function ($scope,$rootScope,$location,$http,UserService) {

    $scope.loginInfo= {username:undefined,password:undefined}; //initialized login info

    $rootScope.boardName = "Login";
    $scope.doLogin = function (){
      if ($scope.loginInfo.username && $scope.loginInfo.password){


        if (UserService.login($scope.loginInfo)){ // if login success
          UserService.isLogin(); // call this to initialize user Data
          if (!UserService.userData.importantRole) {
            $location.path('/concern');
          }else{
            $location.path('/dashboard');
          }
        }else{ // cannot login to server, handle login error here
          $scope.loginError = "Username and password combination is incorrect";
        }



      }// let html 5 do the checking
    };

  });
