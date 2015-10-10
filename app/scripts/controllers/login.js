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
    $scope.userService = UserService;
    $scope.loginInfo= {username:undefined,password:undefined}; //initialized login info
    $scope.boardSelection = false;
    $scope.tempToken = {};
    $rootScope.boardName = "Login";
    $scope.doLogin = function (){
      if ($scope.loginInfo.username && $scope.loginInfo.password){
        UserService.login($scope.loginInfo).then(function(data){ // success
          console.log('in here too');
          if (data.message){

          }else{
            $scope.tempToken = data;
            if (data.user.roleList.length>1) {
              $scope.roleList = data.user.roleList;
			  console.log($scope.roleList);
              $scope.boardSelection = true;
            }else{
              $scope.choosingBoard(data.user.roleList[0]);
            }
          }


        },function(error){
          console.log('error:',error);
          $scope.boardSelection = false;
          $scope.loginError = "Username and password combination is incorrect";
        },null)




      }// let html 5 do the checking
    };
    $scope.choosingBoard = function(currentBoard){
      UserService.selectBoard($scope.tempToken,currentBoard);
      if (!UserService.userData.importantRole) {
        $location.path('/concern');
      }else{
        $location.path('/dashboard');
      }
    }
  });
