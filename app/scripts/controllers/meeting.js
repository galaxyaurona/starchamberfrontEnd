'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:MeetingctrlCtrl
 * @description
 * # MeetingctrlCtrl
 * Controller of the starChamberUiApp
 */
 //Sub page state manager based of meeting state
 angular.module('starChamberUiApp')
 .config(function($stateProvider){
 	$stateProvider
 	.state('Polling',{
 		views:{
 			'sub2':{
 				templateUrl:'views/subviews/meetingPollOpen.html',
 				controller:'VoteCtrl'
 			},
 			'sub3':{
 				templateUrl:'views/subviews/meetingAgendaOpen.html',
 				controller:'AgendaCtrl',
 				resolve:{
 					agenda:function($route,agendaService){
 						return agendaService.getItems($route.current.params.id);
 					}
 				}
 			},
 			'sub1':{
 				templateUrl:'views/subviews/meetingInvitesOpen.html',
 				controller:'InviteCtrl',
 				resolve:{
 					roles:function($route,meetingService,UserService){
 						return meetingService.getBoardRoles(UserService.userData.board.board.id);
 					}
 				}
 			}
 		}
 	})
 	.state('Pending',{
 		views:{
 			'sub2':{
 				templateUrl:'views/subviews/meetingPollclosed.html',
 				controller:'VoteCtrl'
 			},
 			'sub3':{
 				templateUrl:'views/subviews/meetingAgendaOpen.html',
 				controller:'AgendaCtrl',
 				resolve:{
 					agenda:function($route,agendaService){
 						return agendaService.getItems($route.current.params.id);
 					}
 				}
 			},
 			'sub1':{
 				templateUrl:'views/subviews/meetingInvitesOpen.html',
 				controller:'InviteCtrl',
 				resolve:{
 					roles:function($route,meetingService,UserService){
 						return meetingService.getBoardRoles(UserService.userData.board.board.id);
 					}
 				}
 			}
 		}
 	})
 	.state('Scheduled',{
 		views:{

 			'sub2':{
 				templateUrl:'views/subviews/meetingAttendance.html',
 				controller:'VoteCtrl'
 			},
 			'sub3':{
 				templateUrl:'views/subviews/meetingAgendaClosed.html',
 				controller:'AgendaCtrl',
 				resolve:{
 					agenda:function($route,agendaService){
 						return agendaService.getItems($route.current.params.id);
 					}
 				}
 			}
 		}
 	})
 	.state('Lobby', {
 		views: {
 			'sub2': {
 				template: 'Im the lobbyist sub2',
 			},
 			'sub3': {
 				template: 'Im the lobbyist sub 3',
 			}
 		}
 	})
 	.state('Meeting',{
 		views:{
 			'sub4':{
 				templateUrl:'views/subviews/meetingMinutes.html',
 				controller:'MinuteTakingCtrl',
 				resolve:{
 					agendaItems : function(agendaService,meetingService,$state,$route){
 						return agendaService.getItems($route.current.params.id);
 					},
          minute : function(minuteService,meetingService,$state,$route){
            return minuteService.getMinute($route.current.params.id);
          }
 				}
 			}
 		}
 	})
    .state('Closed',{
 	 		views:{
 	 			'sub4':{
 	 				templateUrl:'views/subviews/meetingMinutes.html',
 	 				controller:'MinuteTakingCtrl',
 	 				resolve:{
 	 					agendaItems : function(agendaService,meetingService,$state,$route){
 	 						return agendaService.getItems($route.current.params.id);
 	 					},
 	          minute : function(minuteService,meetingService,$state,$route){
 	            return minuteService.getMinute($route.current.params.id);
 	          }
 	 				}
 	 			}
 	 		}
 	 	})
 });

angular.module('starChamberUiApp')
.controller('MeetingCtrl', function ($scope,$rootScope,$location,$state,$routeParams,meetingService,UserService,invites,meeting
	,agendaService,pollService,minuteRESTService,$interval,moment) {
	$scope.state = $state;
	if (!angular.isDefined(meeting) ){
		console.log('not defined');
		$scope.meeting = {
			"name": "",
			"description": "",
			"duration": 0,
			"state": "Polling",
			"quorum": 0,
			"time":undefined,
			"date": undefined,
			"cutoffTime": new Date(),
			"cutoffDate": new Date(),
			"location": "",
			"reschedule": true,
			"lastEditedDate": new Date(),
			"lastEditedTime": undefined,
			"cancelled": false,
			"board": {
				"key": UserService.userData.board.id
			},
			"availabilities": [
			],
			"id": undefined
		}
	}else{
		$scope.meeting = meeting;
		console.log($scope.meeting);
		$scope.invites = invites;
		console.log('this is the invites',$scope.invites);
	}
	$scope.lobbyState = function(){
		$scope.meeting.state = "Lobby";
		$state.transitionTo("Lobby");
	}
	$interval(function(){
		if (($scope.meeting.state == "Lobby") && (UserService.userData.role == "boardMember")){
			meetingService.getMeeting($scope.meeting.id).then(function(response){
				if (response.state == "Meeting"){
					$scope.meeting = response;
					$state.transitionTo("Meeting");
				}

			});
		}
	},30000);


	function pad(number, length){
		var str = "" + number
		while (str.length < length) {
			str = '0'+str
		}
		return str
	}

	$scope.timezone = new Date().getTimezoneOffset();
		$scope.timezone = (($scope.timezone<0? '+':'-')+ // Note the reversed sign!
			pad(parseInt(Math.abs($scope.timezone/60)), 2)+
			pad(Math.abs($scope.timezone%60), 2));
		$scope.timezone = "GTM" + $scope.timezone;
		$scope.refToMeeting = {};
		$scope.refToMeeting.meeting = meeting;

		console.log('meeting213',$scope.meeting);
	//Convert all of the times back from GMT to the relevant timezone
	//TODO: Change this to get whatever the user selected in the ID
	$rootScope.boardName="Meeting manager";

	//Set the meetings state
	$state.transitionTo($scope.meeting.state);
	console.log('current state',$state,$scope.meeting.state);
	$scope.formattedAvailabilities;
	console.log("State set to " + $scope.meeting.state);

	$scope.createFormattedAvailabilities = function(){
		$scope.formattedAvailabilities = angular.copy($scope.meeting.availabilities);
		$scope.formattedAvailabilities.forEach(function(availability){
			availability.tempDate = angular.copy(availability.date);
			availability.tempTimeStart = angular.copy(availability.timeStart);
			availability.tempTimeEnd = angular.copy(availability.timeEnd);

			availability.date = $rootScope.dateFromZoneConverter(availability.date,availability.timeStart);
			availability.timeStart = $rootScope.timeFromZoneConverter(availability.tempDate,availability.timeStart);
			availability.timeEnd = $rootScope.timeFromZoneConverter(availability.tempDate,availability.timeEnd);
		})
	}

	$scope.createFormattedAvailabilities();
	//If user is a manager or not.
	if (UserService.userData.role == "manager"){
		$scope.manager = true;
	}else {
		$scope.manager = false;
	}

	$scope.postMeeting = function(){
    //console.log(JSON.stringify($scope.meeting));
    meetingService.postMeeting($scope.meeting).then(function(data){console.log('up up',data)})
}
	//Helper function
	$scope.contains = function(a, obj) {
		for (var i = 0; i < a.length; i++) {
			if (a[i] === obj) {
				return true;
			}
		}
		return false;
	};
	//TODO: Find a way to stop this from triggering just because the page is loaded
	$scope.$watch("meeting",function(){
		console.log($scope.meeting);
		meetingService.updateMeeting($scope.meeting).then(function(response){
			console.log(response);
			console.log("Meeting updated");
			$scope.meeting = response.data;
			/*This checks if the manager has already voted on the most recent time in order to
			have them auto vote on any time that they create, while its not ideal we cant exactly do it anywhere else*/
			if($scope.manager)
				$scope.managerCreatedVote();
		});
	},true);

	$scope.managerCreatedVote = function(){
		console.log($scope.meeting.availabilities);
		if($scope.meeting.availabilities.length > 0)
			angular.forEach($scope.invites,function(value,key){
		//Find the invite for the current user ie - manager
		if(value.role.key == UserService.userData.board.id)
		{
			var exists = false;
					//loop through each of the availabilities and if he hasnt voted on the most recent one, do it.
					angular.forEach($scope.invites[$scope.invites.indexOf(value)].avaliabilities,function(value2,key2){
						if(value2.date == $scope.meeting.availabilities[0].date &&
							value2.timeEnd == $scope.meeting.availabilities[0].timeEnd &&
							value2.timeStart == $scope.meeting.availabilities[0].timeStart)
						{
							exists = true;
						}
					});
					if(!exists)
					{
						pollService.vote($scope.meeting.availabilities[0],$scope.invites);
					}
				}
			});
	}

	//Test
	$scope.startMeeting = function(){
		console.log('board: ',UserService.userData.board.board);
		$scope.meeting.key = $scope.meeting.id;
		$scope.tempBoard = UserService.userData.board.board;
		$scope.tempBoard.key = $scope.tempBoard.id;
		minuteRESTService.createMinute({meeting:$scope.meeting,board:$scope.tempBoard}, function(response){
			if (response.status =="success"){
				$scope.meeting.state = "Meeting";
				$state.transitionTo("Meeting");
			}
		});
	}
	$scope.cancelMeeting = function(){
		$scope.meeting.cancelled=true;
	}
	$scope.setStyle = function(style)
	{
		document.getElementById('tester').setAttribute('href',style);
	}

	//Validation functions for meeting detail entry
	$scope.validateName = function(data)
	{
		if(data.length > 40){
			return "Name limited to 40 characters!";
		}
	}
	$scope.validateDesc = function(data){
		if(data.length > 200){
			return "Description limited to 200 characters!";
		}
	}
	$scope.validateLoc = function(data){
		if(data.length > 45){
			return "Location limited to 45 characters!";
		}
	}
});
