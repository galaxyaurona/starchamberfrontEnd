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


  .controller('InviteCtrl', function ($scope,$rootScope,roles,meetingService) {



	$scope.cleanRoles = function(list)
	{
		var del = 0;
    console.log("list",list);
    if (angular.isDefined(list)){
      list.forEach(function (role) {
        del = 0;
        role.roleList.forEach(function (roleList) {
          if (roleList.name == "normalUser")
            list.splice(list.indexOf(role), 1);
        })

        if (del == 1) {
          list.splice(list.indexOf(role), 1);
        }
      })
    }

		return list;
	}
	//Remove all users from the role list since the server gives me all of them not just members/managers - uses above
	//This list is now used for the add new member modal.
	$scope.boardRoles = $scope.cleanRoles(roles);
	console.log($scope.boardRoles);

	$scope.filterInvited = function(list)
	{
		//console.log("Filtering list: ");
		//console.log(list);
		var newList = [];
		list.forEach(function(item){
			$scope.invites.forEach(function(inv){
				if(item.roleList[0].id == inv.role.key){
					newList.push(item);
				}
			})
		})
		return newList;
	}

	//This is now a list of all invited members userData which is used to display information on the invited users screen
	//TODO: Implement this for the attendance screen.
	/*$scope.invitedNames = $scope.boardRoles.slice();
	$scope.invitedNames = $scope.filterInvited($scope.invitedNames);*/
      console.log("Roles");
      console.log($scope.boardRoles);
      $scope.invitedNames = $scope.filterInvited($scope.boardRoles.slice());





	$scope.showNewInvite = function()
	{
		$('#addInviteModal').modal('show');
	};

 	$("#close-inviteModal").click(function () {
 	 	  $('#addInviteModal').modal('hide');
    });

	$scope.addInvited = function(member)
	{
		//Create a new Invitation object
		var newInvite = {
			avaliabilities:[],
			id:undefined,
			meeting:$scope.meeting,
			response:"pending",
			role:{key:member.roleList[0].id}
		};
		$scope.invites.push(newInvite);
		meetingService.postInvite(newInvite).then(function(response){
			console.log("upper layer response: ",response);
      });
		$scope.invitedNames = $scope.filterInvited($scope.boardRoles.slice());
	};
	//TODO: Fix this - This will need to generate an invite for the member when they get added
	$scope.deleteInvited = function(member)
	{
		for(var i = 0; i < $scope.invites.length; ++i)
		{
			if($scope.invites[i].role.key == member.roleList[0].id)
			{
				//This should never not find what its looking for unless someone attempts to send an ID that is invalid
				meetingService.deleteInvite($scope.invites[i].id).then(function(response){
					console.log("upper layer response: ",response);
				});
				$scope.invites.splice(i,1);
				break;
			}
		}
		$scope.invitedNames = $scope.filterInvited($scope.invitedNames);
	}
});
