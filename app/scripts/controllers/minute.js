'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:MinutetakingcontrollerCtrl
 * @description
 * # MinutetakingcontrollerCtrl
 * Controller of the starChamberUiApp
 */
angular.module('starChamberUiApp')
  .controller('MinuteTakingCtrl', function ($scope,agendaItems,UserService,$routeParams,$filter,minuteService,$interval,$sce,minute,minuteRESTService) {
    $scope.console = console;
    $scope.agendaItems = agendaItems;
    $scope.agendaItems = $filter('filter')($scope.agendaItems, {approvalStatus: "Approved"})
    $scope.manager = UserService.userData.role == 'manager';
    $scope.agendaItemModified = $scope.agendaItems;
    $scope.hideDebugInfo= true;
    console.log('agendaItem modified', $scope.agendaItemModified);
    angular.forEach($scope.agendaItems, function (value, key) {
      if (angular.isDefined(value.decision.key)){
        minuteService.getDecision(value.decision.key).then(function(decision){
          $scope.agendaItemModified[key].decision = decision;
          angular.forEach($scope.agendaItemModified[key].decision.options,function(value,key){
            value.voted = voted(value.users);
            console.log('new option',value);
          })
        })
      };
      minuteService.getNotes(value.id).then(function (notes) {
        console.log('notes', notes);
        if (notes.length == 0) {
          minuteService.createNote(value.id).then(function (note) {
            $scope.agendaItemModified[key].note = note;
          });
        } else {
          $scope.agendaItemModified[key].note = notes[0];
        }
      })
    });

    function voted(usersList){
      var result = false;
      console.log('role id',UserService.userData.board.id,' user list ', usersList);
      angular.forEach(usersList,function(value,key){
        if (String(value.key) === String(UserService.userData.board.id.trim())){
          console.log('we have a match',value.key,UserService.userData.board.id, String(value.key) === String(UserService.userData.board.id));
          result = true;
        }


      })
      return result;
    }

    $scope.prettifyJSON = function (JSONData) {
      return JSON.stringify(JSONData, null, 4)
    };
    //TODO: WHAT THE HECK HAPPEN TO AGENDA ITEM PENDNG AND DENIED?
    $scope.voteFor = function (item, dName) {
      console.log(item, dName);
      var indexDname = item.decisionsLabels.indexOf(dName);
      item.decisionsData[item.previousVote]--;
      item.decisionsData[indexDname]++;
      item.previousVote = indexDname;
    };
    $scope.initedCkEditor = false;
    console.log($routeParams);

    $scope.minuteNote = localStorage.getItem('minuteNote' + $routeParams.id)
    $scope.minuteNote = angular.isDefined($scope.minuteNote) ? JSON.parse($scope.minuteNote) : "";

    angular.element(document).ready(function () {
      console.log('Hi');
      //document.getElementById("displayHTML").innerHTML=$scope.minuteNote;
    });
    $scope.$on('$viewContentLoaded', function () {
      //document.getElementById("displayHTML").innerHTML = $scope.minuteNote;
    });

    $scope.initCkEditor = function (item) {
      document.getElementById("displayHTML").innerHTML = $scope.minuteNote;
    }


    $scope.saveNote = function (note) {
      //console.log(note);
      minuteService.updateNote(note).then(function(response){
        console.log(response);
      });
    }

    angular.forEach($scope.agendaItems.approved, function (value, key) {
      value.decisionsLabels = [];
      value.decisionsData = [];
      angular.forEach(value.decisions, function (innerValue, innerKey) {
        console.log("value decisions"+value.decisions);
        value.decisionsLabels.push(innerValue.dName);
        value.decisionsData.push(innerValue.dVotes.length);
      })

    });

    $interval(function () {
      if (($scope.meeting.state == "Meeting") && (UserService.userData.role == "boardMember")) {

        angular.forEach($scope.agendaItemModified,function(value,key){

          minuteService.getNote(value.note.id).then(function(response){
            value.note.text = $sce.trustAsHtml(response.text);;
            console.log(value.note);
            console.log($scope.agendaItemModified);
          })

        })
      }
    }, 1000);
    /*$scope.vote= function (option) {
      // prevent default
      option.voted=!option.voted;
      console.log('processing',option);
      if (option.voted){
        minuteService.unvote(option).then(function(response){
          if (response.status == "success"){
            option.voted = false;
            console.log('unvoted and this is the result',option);
          }
            option.voted = false;
        });
      }else{/
        minuteService.vote(option).then(function (response) {
          console.log('response status',response.status);
          if (response.status == "success"){
            response.voted = true;
            option = response.data;
            option.voted = true;
            console.log('voted and this is the result',option);
          }
          option.voted = true;
        });
      }
    }*/
    $scope.vote = function(option){
      minuteService.vote(option).then(function (response) {
        console.log('response status', response.status);
        if (response.status == "success") {
          option.users = response.data.users;
          option.voted = voted(option.users);
          console.log('voted and this is the result', option);
        }
      });
    }
    function removeUser(userList){
      angular.forEach(userList,function(value,key){
        if (value.key == UserService.userData.board.id){
          userList.splice(key,1);
        }

      })
      return userList
    }
    $scope.unvote = function(option){
      minuteService.unvote(option).then(function (response) {
        if (response.status == "success") {
          console.log("Removing ",removeUser(option.users));
          option.users = removeUser(option.users);
          option.voted = voted(option.users);
          console.log('unvoted and this is the result', option);
        }
        option.voted = false;
      });
    }
    $scope.addQuestion = function(item,title){
      item.decision.name = title;
      console.log(item);
      minuteService.createDecision(item).then(function(response){
        item.decision = response;
      });
    }
    $scope.addOption = function(item){
      var tempDecision = angular.copy(item.decision);
      tempDecision.options.push(tempDecision.newOption);
      tempDecision.newOption = undefined;
       minuteService.updateDecision(tempDecision).then(function(response){
         item.decision = response;
         angular.forEach(item.decision.options, function (value, key) {
           value.voted = voted(value.users);
         })
       });
     }

    $scope.endMeeting = function(){


      //TODO: Make this refresh the page for everyone somehow, this needs to be done in other places too
      var newMinute = minute.data[0];
      newMinute.status ="Closed";
      minuteRESTService.updateMinute(newMinute,function(response){
        $scope.meeting.state="Closed";
        alert("Closed the meeting");
      })
    }

  });
