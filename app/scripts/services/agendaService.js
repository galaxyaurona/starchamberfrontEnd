'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.agendaService
 * @description
 * # agendaService
 * Service in the starChamberUiApp.
 */

angular.module('starChamberUiApp')
  .factory('agendaService', function () {
    var agendaFactory = {};
		agendaFactory.discussionItems = [
			{
				type: "discussion",
				attachment: {},
				id: 1,
				meetingId: 123,
				userId: 1,
				title: "Missing Paper Run",
				description: "For the third week in a row the local paper run has not come around the residents houses, this is not the kind of image we want for our business and as such action must be taken within the week!",
				duration: 15,
				decisions: [
					{
					dName: "Hire New staff",
					dVotes: []
					}, {
					dName: "Roll out new bicycles",
					dVotes: []
					}
				],
				notes: "Empty"
			},{
				type: "concern",
				attachment: {
					title: "My pipes are really loud",
					description: "For the past week the pipes in my unit have been extremely loud and its becoming unbearable, please send someone over to fix this"
				},
				id: 2,
				meetingId: 123,
				userId: 2,
				title: "Residents complaining about pipes",
				description: "See attached concern for details...",
				duration: 20,
				decisions: [
					{
					dName: "Ignore it",
					dVotes: [1]
					}, {
					dName: "Fire the plumber",
					dVotes: []
					}
				],
				notes: "Empty"
			},{
				type: "concern",
				attachment: {
					title: "My pipes are really loud",
					description: "For the past week the pipes in my unit have been extremely loud and its becoming unbearable, please send someone over to fix this"
				},
				id:3,
				meetingId: 213,
				userId: 2,
				title: "Residents complaining about pipes",
				description: "See attached concern for details...",
				duration: 20,
				decisions: [
					{
					dName: "Ignore it",
					dVotes: [1]
					}, {
					dName: "Fire the plumber",
					dVotes: []
					}
				],
				notes: "Empty"
			},{
				type: "concern",
				attachment: {
					title: "My pipes are really bad mang",
					description: "For the past week the pipes in my unit have been extremely loud and its becoming unbearable, please send someone over to fix this"
				},
				id: 4,
				meetingId: 213,
				userId: 2,
				title: "Residents complaining about pipes",
				description: "See attached concern for details...",
				duration: 5,
				decisions: [
					{
					dName: "Ignore it",
					dVotes: [1]
					}, {
					dName: "Fire the plumber",
					dVotes: []
					}
				],
				notes: "Empty"
			}
		];
	//currently contains the ID of the discussion item rather than the item itself.
		agendaFactory.approvalItems = [{
			status: "Confirmed",
			id: 1,
			meetingId: 123,
			discussionItemId: 1
		}, {
			status: "Pending",
			approvalItemId: 2,
			meetingId: 123,
			discussionItemId: 2
		}, {
			status: "Confirmed",
			id: 3,
			meetingId: 213,
			discussionItemId: 3
		},{
			status: "Confirmed",
			id: 4,
			meetingId: 213,
			discussionItemId: 4
		}];
			//TODO: Give users the ability to edit submitted items - if creator id = your login token id then edit=true
			//TODO: Create back end connection methods for approval Items
			
	/* Get items for the given meeting - this should return approval Items as these contain the discussion items
		agendaFactory.getItems(meetingId)
		{
			$http.get('/api/agenda',{
				id:meetingId
			}).success(function(data){
			
			})
		}
	*/
	
	/* Post an agenda Item
	//ID is not passed as this should be assigned server side, update method should be separate?
		agendaFactory.postItem = function (meetingId,userId,title,description,duration,decisions,notes){
			return $http.post('/api/agenda',{
				meetingId:meetingId,
				userId:userId,
				title:title,
				description:description,
				duration:duration,
				decisions:decision,
				notes:notes
			}).success(function(data){
				return data;
			})
		}
	*/	
	agendaFactory.postApprovalItem = function(meeting,item){
		meeting.approvalItems.unshift({status:item.status,id:item.id,meetingId:item.meetingId,discussionItemId:item.discussionItemId});
	};
	agendaFactory.getAgendaItems = function(meeting){
		//TODO: REFACTOR THIS, THIS IS HORRIBLE ayyy
		//Swap out the multi array for just returning all and sort the array they inhabit.
		
		//This uses a for loop as its faster than an angular.forEach(), if its an eyesore that badly ill change it you wimp.
		/* var Items = [];
			for(var i = 0; i < agendaFactory.approvalItems.length;++i)
			{
				if(agendaFactory.approvalItems[i].meetingId == meeting)
					Items.push(agendaFactory.approvalItems[i])
			}
			//Initialy sort this - then if an item gets approved shift it to the front of the array so its ontop of the list.
		*/
		
		//TODO: Talk to michael and nghia about changing the back end to not return denied items unless it is explicitly requested by the client

		var Items = {approved:[],pending:[],denied:[]};
		for(var i = 0; i<agendaFactory.approvalItems.length;++i)
		{
			if(agendaFactory.approvalItems[i].meetingId == meeting)
			{
				if(agendaFactory.approvalItems[i].status == "Confirmed")
				Items.approved.push(agendaFactory.getDiscussionItem(agendaFactory.approvalItems[i].discussionItemId));
			else if(agendaFactory.approvalItems[i].status == "Pending")
				Items.pending.push(agendaFactory.getDiscussionItem(agendaFactory.approvalItems[i].discussionItemId));
			else
				Items.denied.push(agendaFactory.getDiscussionItem(agendaFactory.approvalItems[i].discussionItemId));
			}
		}
		return Items;

	};
	//This is for when an item is approved
	agendaFactory.postDiscussionItem = function(meeting,item){
		meeting.agendaItemsP.unshift({title:item.title,description:item.description,duration:item.duration,id:item.id,meetingId:item.meetingId,userId:item.userId});
	};
	//TODO: REFACTOR THIS, THIS IS HORRIBLE
	agendaFactory.getDiscussionItem = function(id){
		for(var i = 0; i<agendaFactory.discussionItems.length;++i){
			if(agendaFactory.discussionItems[i].id == id)
			{
				return agendaFactory.discussionItems[i];
			}
		}
	};
	agendaFactory.getMeetingItems = function(meeting)
	{
		var Items = [];
		for(var i = 0; i<agendaFactory.approvalItems.length;++i)
		{
			if(agendaFactory.approvalItems[i].meetingId == meeting)
			{
				Items.push(agendaFactory.getDiscussionItem(agendaFactory.approvalItems[i].discussionItemId));
			}
		}
		return Items;
	}
	return agendaFactory;
});
