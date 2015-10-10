'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the starChamberUiApp
 */
angular.module('starChamberUiApp')
  .controller('DashboardCtrl', function ($log,$scope,$rootScope,$location,$filter,UserService,meetingService,meetings,$window) {
	  console.log(UserService.userData);
 // status : scheduled- pending - polling
     // scheduled: modified or rescheduled or cancelled or modifiable
     // pending: polling
	 $scope.invites = meetings;
	 console.log($scope.invites);
     if (UserService.userData.role == "manager"){
       $scope.manager = true;
     }else {
       $scope.manager = false;
     }
     $rootScope.boardName="Dashboard";
     $scope.reverse = false;
     $scope.moreOptionsMeeting=false;
     $scope.moreOptionsMinute=false;
     $scope.moreOptionsReport=false;
      localStorage.setItem("sampleInvite",JSON.stringify(meetings[0]))
     $scope.queryInvite = {
       "response": undefined,
       "role": undefined,
       "meeting": {
         "name": undefined,
         "description":undefined,
         "state": undefined,
         "reschedule": undefined,
         "lastEditedDate": undefined,
         "lastEditedTime": undefined,
         "cancelled": undefined,
         "board": undefined,
         "id": undefined
       },
       "id": undefined
     }
    $scope.$watch("queryInvite",function(){
      console.log($scope.queryInvite);
    })

     $scope.queryMinute ={title:'',date:undefined};
     $scope.statuses = ['','Polling','Pending','Scheduled','Meeting'];


     $scope.toggleMoreOption = function(panel){
       if (panel == 'meeting')$scope.moreOptionsMeeting = !$scope.moreOptionsMeeting;
       if (panel == 'minute')$scope.moreOptionsMinute = !$scope.moreOptionsMinute;
       if (panel == 'report')$scope.moreOptionsReport = !$scope.moreOptionsReport;
     };
	 /*
     $scope.meetings = meetingService.getMeetings(UserService.userData);
     $log.debug($scope.meetings);
		*/
     $scope.minutes= [{title:"Monthly meeting",date:new Date('18 Feb 2015 17:30:00'),url:"/#/test/#"},{title:"Weekly meeting",date:new Date('12 March 2015 03:30:00'),url:"/#/test/#"}];

     $scope.reports= [{title:"Finance report",date:new Date('24 June 2015 17:30:00'),url:"/#/test/#"},{title:"Security report",date:new Date('29 February 2015 03:30:00'),url:"/#/test/#"}];

     var orderBy = $filter('orderBy');
     $scope.order = function(target,predicate,reverse){

       if ("meeting" == target) $scope.invites = orderBy($scope.invites, predicate, reverse);
       if ("report" == target) $scope.reports = orderBy($scope.reports, predicate, reverse);
       if ("minute" == target) $scope.minutes = orderBy($scope.minutes, predicate, reverse);

     };
     $scope.order('meeting','status',false);



   // jquery animation here

 	  $("#close-calendar").click(function () {
 	 	  $('#calendar-modal').modal('hide');
     });

	 $scope.createNewMeeting=function(){
	console.log("Pressed");
	console.log(UserService.userData);
		var newMeeting = {
        "name": "New Meeting",
        "description": "",
        "duration": 0,
        "state": "Polling",
        "quorum": 0,
        "time":undefined,
        "date": undefined,
        "cutoffTime": undefined,
        "cutoffDate": undefined,
        "location": "",
        "reschedule": false,
        "lastEditedDate": Math.round(new Date().valueOf()/60/1000),
        "lastEditedTime": Math.round(new Date().valueOf()/60/1000),
        "cancelled": false,
        "board": {
          "key": UserService.userData.board.board.id
        },
        "availabilities": undefined,
        "id": undefined
      }
		meetingService.postMeeting(newMeeting).then(function(data){
      console.log("data:"+data.data.id);
      var tempMeeting = data.data;
     var newInvite = {
     			id:undefined,
     			meeting:{id:data.data.id},
     			response:"pending",
     			role:{key:UserService.userData.board.id}
     		};
      console.log(UserService.userData.board.id," and ",newInvite);
      meetingService.postInvite(newInvite).then(function(response) {
        $location.url("/meeting?id="+tempMeeting.id);
      })


   })};
  });
