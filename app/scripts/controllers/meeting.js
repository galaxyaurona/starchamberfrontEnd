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
		$stateProvider//TODO: New meeting state
		.state('Polling',{
			views:{
				'sub2':{
					templateUrl:'views/subviews/meetingPollOpen.html',
					controller:'VoteCtrl'
				},
				'sub3':{
					templateUrl:'views/subviews/meetingAgendaOpen.html',
					controller:'AgendaCtrl'
				},
				'sub1':{
					templateUrl:'views/subviews/meetingInvitesOpen.html',
					controller:'InviteCtrl'
				}
			}
		})
		.state('Pending',{
		views:{
			'sub2':{
					templateUrl:'views/subviews/meetingPollClosed.html',
					controller:'VoteCtrl'
				},
				'sub3':{
					templateUrl:'views/subviews/meetingAgendaOpen.html',
					controller:'AgendaCtrl'
				},
				'sub1':{
					templateUrl:'views/subviews/meetingInvitesOpen.html',
					controller:'InviteCtrl'
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
					controller:'AgendaCtrl'
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
              console.log(agendaService,meetingService,$state,$route);
              return agendaService.getAgendaItems($route.current.params.id);
            }
          }
				}
			}
		})
	});

angular.module('starChamberUiApp')
  .controller('MeetingCtrl', function ($scope,$rootScope,$location,$state,$routeParams,meetingService,UserService,meeting) {
	$scope.meeting =meeting; //TODO: Check if nghia wants to do away with routeparams completely?
	$rootScope.boardName="Meeting manager";
	//TODO: Implement state from meeting object instead of routeParams
	if($routeParams.state == null)
		$location.search("state","Polling");
	else
		$state.transitionTo($routeParams.state);
	console.log($scope.meeting.title);

	//If user is a manager or not.
	if (UserService.userData.role == "manager"){
       $scope.manager = true;
     }else {
       $scope.manager = false;
     }

	$scope.addMember = function(member)
	{
	//TODO: Remove debug alerts and replace them with visual feedback to the user
		if(!contains($scope.invited,member))
		{
			$scope.invited.push({name:member});
			$scope.invName = ' ';
			window.alert("User added with name:" + member);
		}else{
			window.alert("User already invited!");
		}
	};
	//TODO: Consider changes for back end connection format
	$scope.setDetails = function(newTitle,newDescription)
	{
		$scope.title = newTitle;
		$scope.description = newDescription;
		$rootScope.title = newTitle;
		$rootScope.description = newDescription;
		$('#descModal').modal('hide');
	};
	//TODO: Consider changes for back end format
	$scope.setLocation = function(locName,locAddr)
	{
		//TODO: Give the user google maps implementation?
		$scope.locationName = locName;
		$rootScope.locationName = locName;
		$scope.locationAddr = locAddr;
		$rootScope.locationAddr = locAddr;
		$('#locationModal').modal('hide');
	};

	//Helper function
	$scope.contains = function(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
	};
  });
