'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:MeetingctrlCtrl
 * @description
 * # MeetingctrlCtrl
 * Controller of the starChamberUiApp
 */
 angular.module('starChamberUiApp')
  .controller('VoteCtrl', function ($scope,$rootScope,pollService,$routeParams) {

  $scope.addMeetingTime = function(newDate,newTime)
	{
		//Validate data
		//generate unique ID
		if($scope.meeting.pollItems.length < 7){
			var tempDate = dateFormat(newDate);
			var tempTime = timeFormat(newTime);
			pollService.postPoll($scope.meeting,{date:tempDate,time:tempTime,id:"temp",votedId:[]});
		}else{
			window.alert("Maximum limit reached because I havent put pages in yet!");
		}
	};
	$scope.deleteMeetingTime = function(id)
	{
		for(var i = 0;i < $scope.meeting.pollItems.length;++i)
		{
			if($scope.meeting.pollItems[i].id == id)
			{
				$scope.meeting.pollItems.splice(i,1);
			}
		}
	};
	//Format date for display
	function dateFormat(date){
		var tempDay = date.getDate();
		var tempMonth = date.getMonth() +1;
		var tempYear = date.getFullYear();
		var newDate = tempDay + "/" + tempMonth + "/" + tempYear;
		return newDate;
  }
     //format time for display
	function timeFormat(time)
	{
		var tempMinutes = time.getMinutes();
		var tempHours = time.getHours();
		var temp = tempHours + ":" + tempMinutes;
		return temp;
  }
     //When the user votes on a timeslot
	$scope.vote = function(id){
		for(var i = 0;i < $scope.meeting.pollItems.length; i++)
		{
			if($scope.meeting.pollItems[i].id == id) //if the poll list is empty vote will never be used
			{
				if($rootScope.userdata.id in $scope.meeting.pollItems[i].votedId)
				{
					$scope.meeting.pollItems[i].votedId.splice($scope.meeting.pollItems[i].votedId.indexOf($rootScope.userdata.id),1);
					window.alert("User" + $rootScope.userdata.name + " was removed from time " + id);
				}else{
					$scope.meeting.pollItems[i].votedId.push($rootScope.userdata.id);
					window.alert("User" + $rootScope.userdata.name + " was added to time " + id);
				}
				/*for(var x=0;x<$scope.meeting.pollItems[i].votedId.length; x++)
				{
					console.log("poll item " + x + "Voted on by " + $scope.meeting.pollItems[i].votedId[x]);
				} */
				break;
			}
		}
	};
	$scope.unAttend = function()
	{
		notAttending.push($scope.name);
	};
  });
