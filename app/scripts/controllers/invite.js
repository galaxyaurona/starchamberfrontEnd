'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:MeetingctrlCtrl
 * @description
 * # MeetingctrlCtrl
 * Controller of the starChamberUiApp
 */
 //The array here is in place of having the normal Service because I cant be fucked right now
  angular.module('starChamberUiApp')

  .controller('InviteCtrl', function ($scope,$rootScope) {
      $scope.memberDatabase = [{name:"Chris",id:1,role:"Member"},{name:"Steve",id:2,role:"Member"},{name:"Nghia",id:3,role:"Manager"},{name:"Micheal",id:4,role:"Member"},{name:"Stanis",id:5,role:"Manager"}];
	$scope.showNewInvite = function()
	{
		$('#addInviteModal').modal('show');
	};

 	$("#close-inviteModal").click(function () {
 	 	  $('#addInviteModal').modal('hide');
    });

	$scope.addInvited = function(member)
	{
		//Validate the ID exists here
		$scope.meeting.invite.push(member);

	};
	$scope.deleteInvited = function(member)
	{
		//an angular.forEach is 94% slower than a native for loop, hence not using it.
		for(var i = 0; i < $scope.meeting.invite.length; ++i)
		{
			if($scope.meeting.invite[i].id == member.id)
			{
				//This should never not find what its looking for unless someone attempts to send an ID that is invalid
				//There is no validation for this currently.
				$scope.meeting.invite.splice(i,1);
				break;
			}
		}
	}
});
