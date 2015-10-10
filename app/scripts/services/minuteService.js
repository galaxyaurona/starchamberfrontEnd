'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.minuteService
 * @description
 * # minuteService
 * Service in the starChamberUiApp.
 */
angular.module('starChamberUiApp')
  .factory('minuteService', function(minuteRESTService,$q,UserService,$http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var minuteServiceFactory={};
    minuteServiceFactory.getNotes = function(discussionItemId){
      var deferred = $q.defer();
      minuteRESTService.getNotes({id:discussionItemId}
        , function(response){
          return deferred.resolve(response.data);
        });
      return deferred.promise;
    };

    minuteServiceFactory.createNote=function(discussionItemKey){
      var deferred = $q.defer();
      minuteRESTService.createNote(
        {"discussionItem":
          {"key":discussionItemKey}
        }
      , function(response){
          return deferred.resolve(response.data);
        });
      return deferred.promise;
    };

    minuteServiceFactory.updateNote = function (note) {
      var deferred = $q.defer();
      minuteRESTService.updateNote(note
        , function (response) {
          return deferred.resolve(response.data);
        });
      return deferred.promise;
    };

    minuteServiceFactory.getNote = function (noteId) {
      var deferred = $q.defer();
      minuteRESTService.getNote({id: noteId}
        , function (response) {
          return deferred.resolve(response.data);
        });
      return deferred.promise;
    };

    minuteServiceFactory.createDecision = function (item) {
      var deferred = $q.defer();
      minuteRESTService.createDecision({discussionItem:{key:item.id},name:item.decision.name}
        , function (response) {
          console.log(response);
          return deferred.resolve(response.data);
        });
      return deferred.promise;
    };

    minuteServiceFactory.getDecision = function (id){
      var deferred = $q.defer();
      minuteRESTService.getDecision({id:id},function(response){
        console.log('decision',response);
        return deferred.resolve(response.data);
      })
      return deferred.promise;
    };
    minuteServiceFactory.updateDecision = function(decision){
      var deferred = $q.defer();
      minuteRESTService.updateDecision(decision, function (response) {
        console.log('update decisions', response);
        return deferred.resolve(response.data);
      })
      return deferred.promise;
    }
    minuteServiceFactory.vote = function(option){
      var sendData = angular.copy(option);
      sendData.users = [];
      sendData.users.push({key:UserService.userData.board.id});
      sendData.voted = undefined;
      var deferred = $q.defer();

      minuteRESTService.vote(sendData,function(response){
        console.log('vote',response);
        deferred.resolve(response);
      })
      return deferred.promise;
    }

    minuteServiceFactory.getMinute = function(meetingId){
      var sendData = {key:meetingId};
      console.log("meeting id",sendData);
      var deferred = $q.defer();
      var req = {
        method:'GET',
        url: 'http://www.ltuteamg.com:8000/api/minutes/meeting',
        data : sendData
      }
      $http.get('http://www.ltuteamg.com:8000/api/minutes/meeting?id='+meetingId).success(function(response){
        deferred.resolve(response);
      })
      return deferred.promise;
    }

    minuteServiceFactory.unvote = function (option) {


      var sendData = angular.copy(option);
      sendData.users = [];
      sendData.users.push({key:UserService.userData.board.id});
      sendData.voted = undefined;
      var deferred = $q.defer();
      var config = {
         method: "DELETE",
         url: "http://www.ltuteamg.com:8000/api/decisionsOptions/o",
         data: sendData,
         headers: {"Content-Type": "application/json;charset=utf-8"}
       };
      $http(config).success(function (response) {
        console.log('unvote', response);
        deferred.resolve(response);
      })
      return deferred.promise;
    }


    return minuteServiceFactory;
  });

