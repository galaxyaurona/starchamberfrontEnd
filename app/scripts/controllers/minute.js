'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:MinutetakingcontrollerCtrl
 * @description
 * # MinutetakingcontrollerCtrl
 * Controller of the starChamberUiApp
 */
angular.module('starChamberUiApp')
  .controller('MinuteTakingCtrl', function ($scope,agendaItems,UserService,$routeParams) {
        $scope.console = console;
      $scope.agendaItems = agendaItems;
        $scope.manager = UserService.userData.role =='manager';

    //TODO: WHAT THE HECK HAPPEN TO AGENDA ITEM PENDNG AND DENIED?
        $scope.voteFor = function(item,dName){
            console.log(item,dName);
            var indexDname = item.decisionsLabels.indexOf(dName);
            item.decisionsData[item.previousVote]--;
            item.decisionsData[indexDname]++;
            item.previousVote = indexDname;
        };
        $scope.initedCkEditor = false;
        console.log($routeParams);

        $scope.minuteNote = localStorage.getItem('minuteNote'+$routeParams.id)
        $scope.minuteNote = angular.isDefined($scope.minuteNote) ? JSON.parse($scope.minuteNote):"";

    angular.element(document).ready(function () {
      console.log('Hi');
      //document.getElementById("displayHTML").innerHTML=$scope.minuteNote;
    });
    $scope.$on('$viewContentLoaded', function(){
       document.getElementById("displayHTML").innerHTML=$scope.minuteNote;
     });
        $scope.initCkEditor = function(item){
            document.getElementById("displayHTML").innerHTML=$scope.minuteNote;
        }

        $scope.saveNote= function(note){
            //console.log(note);
            localStorage.setItem('minuteNote'+$routeParams.id,JSON.stringify(note));
            document.getElementById("displayHTML").innerHTML=note
        }
        angular.forEach($scope.agendaItems.approved, function (value, key) {
            value.decisionsLabels = [];
            value.decisionsData = [];
            angular.forEach(value.decisions,function(innerValue,innerKey){

                value.decisionsLabels.push(innerValue.dName);
                value.decisionsData.push(innerValue.dVotes.length);
            })

        });



  });
