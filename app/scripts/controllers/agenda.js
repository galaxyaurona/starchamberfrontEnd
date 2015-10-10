'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:MeetingctrlCtrl
 * @description
 * # MeetingctrlCtrl
 * Controller of the starChamberUiApp
 */
  angular.module('starChamberUiApp')
	.controller('AgendaCtrl', function ($scope,$rootScope,agendaService,$routeParams,UserService,agenda,ConcernService) {

	//TODO: Implement back end connectivity
	$scope.agendaItems = agenda;
	console.log("Agenda");
	console.log($scope.agendaItems);
	//console.log($scope.agendaItems);
	$scope.showRemovedItems = false; //Whether or not the page is to show removed items, manager only.
	//TODO: As in service, change over to separate api calls so we dont keep un-needed data

	//--------------------------------QUERIES-----------------------------------------------------
	$scope.queryAgendaOpen = function(item)
	{
		if(item.approvalStatus == "Pending" || item.approvalStatus == "Approved")
			return true;
		if($scope.showRemovedItems && item.approvalStatus == "Rejected")
			return true;
		return false;
	}
	//TODO: Ensure that the server sets any still pending items to Rejected once the agenda is closed
	$scope.queryAgendaClosed = function(item)
	{
		if(item.approvalStatus == "Approved")
			return true;
		if($scope.showRemovedItems && item.approvalStatus == "Rejected")
			return true;
		return false;
	}
	//--------------------------------/QUERIES------------------------------------------------------
	
	//TODO: ensure server side ID's are correctly implemented
	//TODO: Join with service format for back end connection
	//-------------------------------ITEM CONTROL-------------------------------------------------
	
	//TODO: Clear modal contents when submitted
	
	$scope.showAddItemModal = function()
	{
		$('#addItemModal').modal('show');
	};
	
	$("#close-addItemModal").click(function () {
	
 	 	  $('#addItemModal').modal('hide');
    });
	
	$scope.addFail = false;
	$scope.failMessage = "Please enter ALL text fields!";
	

	$('#submit-Item').click(function(){
			if($('#newTitle').val() && $('#newDescription').val() && $('#newDuration').val()){
				if(!isNaN($('#newDuration').val())){
				$scope.newItem($('#newTitle').val(),$('#newDescription').val(),$('#newDuration').val());
				$scope.addFail = false;
				$('#newTitle').val('');
				$('#newDescription').val('');
				$('#newDuration').val('');
				$('#addItemModal').modal('hide');
				}else{
					$scope.failMessage = "Please enter only numberics for duration!";
					$scope.addFail = true;
					$scope.$apply();
				}
			}else{
				$scope.failMessage = "Please enter ALL text fields!";
				$scope.addFail = true;
				$scope.$apply();
			}
	});

	//This is used with the selection during the creation of a new discussion item
	$scope.selectedAttachmentType = "null";
	$scope.selectedAttachment;

	$scope.newItem = function(newName,newDesc,timeReq)
	{
		//TODO: Set the order to be only assigned once an item gets approved, and base this from the total approved ones
		//TODO: Refactor this to always create the basic item
		if($scope.selectedAttachmentType == "null"){
		var newerItem = 
		{
		_class:"DiscussionItem",
			title:newName,
			description:newDesc,
			duration:parseInt(timeReq),
			approvalStatus:"Pending",
			decision:undefined,
			date:undefined,
			order:$scope.agendaItems.length,
			id:undefined,//Server
			time:undefined,
			role:{key:UserService.userData.board.id},
			meeting:$scope.meeting
		};
	}else if($scope.selectedAttachmentType == "concern")
		{
			var newerItem = 
			{
				_class:"Concern_Discussion",
				concernId:$scope.selectedAttachment.id,
				"DiscussionItem":{
					title:newName,
					description:newDesc,
					duration:parseInt(timeReq),
					approvalStatus:"Pending",
					decision:undefined,
					date:undefined,
					order:$scope.agendaItems.length,
					id:undefined,//Server
					time:undefined,
					role:{key:UserService.userData.board.id},
					meeting:$scope.meeting
				}
			}
		}

		console.log(newerItem);
		console.log("Agenda Item Created");
		agendaService.postAgendaItem(newerItem).then(function(response){
			$scope.agendaItems.push(newerItem);
			console.log("upper layer response: ",response);
      });
		$scope.$apply(); //Because for some reason it just doesnt update without this anymore...
	};
	$scope.confirmItem = function(Item)
	{
		Item.approvalStatus = "Approved";
		$scope.updateTime(); //update the percentage.
		$('.modal.in').modal('hide');
		console.log("Agenda Item updated");
		agendaService.updateAgendaItem(Item).then(function(response){
			console.log("upper layer response: ",response);
      });
	};

	$scope.denyItem = function(Item)
	{
		Item.approvalStatus = "Rejected";
		$('#pendingItemModal').modal('hide');
		console.log("Agenda Item updated");
		agendaService.updateAgendaItem(Item).then(function(response){
			console.log("upper layer response: ",response);
      });
		
	};
	
		$("#close-pendingItemModal").click(function () {
 	 	  $('#pendingItemModal').modal('hide');
    });

	
	
	//---------------------------------/ITEM CONTROL--------------------------------------------
	
	
	//Local values for the time bar
	//TODO: Clean this up
	//---------------------------------TIME AND DISPLAY CONTROL----------------------------------------------
	$scope.approvedItems = 0;
	$scope.pendingItems = 0;
	$scope.rejectedItems = 0;
	$scope.totalTime = 0;
	$scope.overTime = false;
	$scope.updateTime = function()
	{
		$scope.totalTime = 0;
		for(var i = 0;i < $scope.agendaItems.length;i++)
		{
			if($scope.agendaItems[i].approvalStatus == "Approved"){
				$scope.totalTime += $scope.agendaItems[i].duration;
				$scope.approvedItems++;
			}else if($scope.agendaItems[i].approvalStatus == "Pending")
				$scope.pendingItems++;
			else
				$scope.rejectedItems++;
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

 	$("#close-pendingItemModal").click(function () {
 	 	  $('#pendingItemModal').modal('hide');
    });


 	//-------------------------------Attachment selection-------------------------------
 	$scope.selectedList;
 	//This watches for a change and then, if the values have not been pulled from the server, gets them.
 	//This could be easily changed to call a get everytime this changes value so that the display is live but in the interest
 	//of not DDOS'ing the test server when this is tested this will remain for now.
 	$scope.$watch("selectedList",function(){
 		console.log("selected list changed to: " + $scope.selectedList);
 		if($scope.selectedList == "concern" && $scope.concernList == undefined)
 		{
 			ConcernService.getConcerns(UserService.userData.board.id).then(function(response){
 	 			$scope.concernList = response;
 			});
 		}else if($scope.selectedList == "report"){

 		}else if($scope.selectedList == "discussionItem"){

 		}
 	});
 	//By default concerns are selected
 	$scope.selectedList = "concern";
 	 
 	$scope.addConcernToItem = function(item){
 		$scope.selectedAttachment = item;
 		$scope.selectedAttachmentType = "concern";
 		$scope.selectedList = "done";
 	}

 	$scope.removeSelection = function(){
 		$scope.selectAttachment = "";
 		$scope.selectedAttachmentType = "null";
 		$scope.selectedList = "concern";
 	}

 	//-------------------------------/Attachment Selection----------------------------
	//I cant seem to target the individual elements of the modal to make them clear whenever it is brought up.
	$scope.showAddItemModal = function()
	{
		$('#addItemModal').modal('show');
	};
	$("#close-addItemModal").click(function () {
 	 	  $('#addItemModal').modal('hide');
    });
	$('#submit-item').click(function(){
		$scope.newItem($('#newTitle'),$('#newDescription'),$('#newDuration'),$('#newAttachment'));
		$('#addItemModal').modal('hide');
	});

	 $scope.showRemoved = function(){
		 $scope.showRemovedItems = true;
	 };
	 $scope.hideRemoved = function(){
		 $scope.showRemovedItems = false;
	 }
  });

