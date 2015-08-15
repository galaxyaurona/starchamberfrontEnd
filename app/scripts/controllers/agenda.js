'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:MeetingctrlCtrl
 * @description
 * # MeetingctrlCtrl
 * Controller of the starChamberUiApp
 */
  angular.module('starChamberUiApp')
	.controller('AgendaCtrl', function ($scope,$rootScope,agendaService,$routeParams) {
	
	//TODO: Implement back end connectivity
	$scope.agendaItems = agendaService.getAgendaItems($routeParams.meeting_id);
	$scope.showRemovedItems = false; //Whether or not the page is to show removed items, manager only.
	//TODO: As in service, change over to separate api calls so we dont keep un-needed data

	//TODO: ensure server side ID's are correctly implemented
	//TODO: Join with service format for back end connection
	$scope.newItem = function(newName,newDesc,timeReq)
	{
		var newId = 0;
		if(!$scope.agendaItems.pending.length == 0){
			newId = parseInt($scope.agendaItems.pending[$scope.agendaItems.pending.length - 1].id) + 1;
		}else if(!$scope.agendaItems.approved.length == 0){
			newId = parseInt($scope.agendaItems.approved[$scope.agendaItems.approved.length - 1].id) + 1;
		}
		$scope.agendaItems.pending.push({title:newName,description:newDesc,duration:parseInt(timeReq),id:newId,meetingId:$routeParams.meeting_id,userId:"Nghia changed shit so doesnt work atm"});
		//The server will be responsible for the creation of an approval item when this is sent to it?
	};
	//TODO: Change the format of the storage of items
	$scope.confirmItem = function(Item)
	{
		$scope.tempItem = {title:Item.title,description:Item.description,duration:Item.duration,id:Item.id,meetingId:Item.meetingId,userId:Item.userId,decisions:[{dName:"Add decisions!",dVotes:[]}]};
		$scope.agendaItems.approved.push($scope.tempItem);
		$scope.agendaItems.pending.splice($scope.agendaItems.pending.indexOf(Item),1);
		$scope.updateTime(); //update the percentage.
		$('.modal.in').modal('hide');
	};
	//As above
	$scope.denyItem = function(item)
	{
		$scope.agendaItems.pending.splice($scope.agendaItems.pending.indexOf(item),1);
		$scope.agendaItems.denied.push(item);
		$('#pendingItemModal').modal('hide');
	};
	//As above
	$scope.deleteItem = function(item)
	{
		$scope.agendaItems.approved.splice($scope.agendaItems.approved.indexOf(item),1);
		$scope.agendaItems.denied.push(item);
		$scope.updateTime();
	};

	//Local values for the time bar
	//TODO: Clean this up
	$scope.totalTime = 0;
	$scope.overTime = false;
	$scope.updateTime = function()
	{
		$scope.totalTime = 0;
		for(var i = 0;i < $scope.agendaItems.approved.length;i++)
		{
			$scope.totalTime += $scope.agendaItems.approved[i].duration;
		}
		$scope.totalTimePercent = ($scope.totalTime/$scope.meeting.duration)*100;
		if($scope.totalTime > $scope.meeting.duration)
		{
			$scope.overTime = true;
		}else{
			$scope.overTime = false;
		}
	};
	$scope.updateTime();
	$scope.getPercent = function()
	{
		return totalTimePercent;
	};
	$scope.addDecision = function(id,decision)
	{
		for(var i = 0;i < $scope.agendaItems.length;i++)
		{
		//no idea why but if I call $scope.agendaitems[i].id and compare it with id it throws errors.
		var temp = $scope.agendaItems[i].id;
			if(temp == id)
			{
				$scope.agendaItems[i].decisions.push({dName:decision,id:["temp cause this aint done"]});
				break;
			}
		}

	};
	//TODO: Check if this is even used anymore since it probably isnt, keep it incase we change back to modals later
	//Need to convert the other modals to use this same functionality instead of pure HTML
	$scope.showItemDetails = function(item)
	{
		$('#attachmentTitle').text(" ");
		$('#attachmentDesc').text(" ");
		$('#itemTitle').text(item.title);
		$('#itemDesc').text(item.description);
		$('#itemTime').text("Requested " + item.duration + " minutes");
		$('#userId').text( "submited by member: " + item.userId);
		if(item.type == 'concern'){
			$('#attachmentTitle').text(item.attachment.title);
			$('#attachmentDesc').text(item.attachment.description);
		}else if(item.type == 'report'){
			//report things
		}else{
			//Incase we decide anything needs to go here from the standard items
		}
		$('#pendingItemModal').modal('show');
	};

 	$("#close-pendingItemModal").click(function () {
 	 	  $('#pendingItemModal').modal('hide');
    });

	//I cant seem to target the individual elements of the modal to make them clear whenever it is brought up.
	$scope.showAddItemModal = function()
	{
		$('#addItemModal').modal('show');
	};
	$("#close-addItemModal").click(function () {
 	 	  $('#addItemModal').modal('hide');
    });
	 $scope.showRemoved = function(){
		 $scope.showRemovedItems = true;
	 };
	 $scope.hideRemoved = function(){
		 $scope.showRemovedItems = false;
	 }
  });

