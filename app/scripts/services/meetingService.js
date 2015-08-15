'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.meetingService
 * @description
 * # meetingService
 * Service in the starChamberUiApp.
 */
angular.module('starChamberUiApp')
  .factory('meetingService', function ($filter) {
    var meetingFactory = {};
	//States - What the date/time values mean are based off of this.
	//0 - polling, agenda open
	//1 - pending time(no time yet selected), agenda open
	//2 - scheduled, agenda open
	//3 - scheduled, agenda closed - This might not be needed
	//4 - meeting
	//5 - finished

	//Creation of agendaItems and pollItems will need their own services?
    meetingFactory.meetings = [
      {
        title: "test title",
        description: "Test Desc",
        id: 123,
        invite: [],
        attending: [],
        state: 2,
        date: new Date('18 May 2015 17:30:00'),
        duration: 30,
        chairmanId: 1,
        address: "Test Addr",
        locName: "Test locName",
        conditions: {rescheduled: true, modified: false, editable: true, cancelled: false},
        pollItems: []
      },

      {
        id: 213,
        title: "Weekly meeting",
        description: "This week we need to discuss the next months budget, we also have multiple concerns",
        invite: [
			{
			name: "chris",
			id: 240
			},
			{
			name: "dave",
			id: 1
			},
			{
			name: "dale",
			id: 2
			},
			{
			name: "steven",
			id: 444
			},
			{
			name: "nghia",
			id: 355
			},
			{
			name: "dan", 
			id: 346
			}
		],
        attending: [],
        state: 0,
        date: new Date('18 May 2015 17:30:00'),
        duration: 40,
        chairmanId: 3,
        address: "Test Addr",
        locName: "Test locName",
        conditions: {rescheduled: false, modified: false, editable: true, cancelled: false},
        pollItems: [
			{
			date: "3-9-2015",
			time: "12:00",
			votedId: [2],
			id: 0
			}, 
			{
			date: "2-9-2015",
			time: "12:00",
			votedId: [1],
			id: 1
			}
		]
      }
    ]

	//TODO: Finish meeting Get Call for meeting objects from userId
	
	/* Proper Meeting Get Call
	meetingFactory.getMeetings(userId){
		return $http.get('/api/meetings',{ //Post userId to back end
			id:userId
			}).success(function(data){
			
			})
	}*/
	
	meetingFactory.meetingFilter = function(meetings,userId){
		var foundMeetings = [];
		for(var i = 0;i < meetings.length;++i)
		{
			var found = false;
			if(meetings[i].invite.length > 0)
				for(var x=0;x<meetings[i].invite.length;++x)
				{
					if(meetings[i].invite[x].id == userId)
					found = true;
				}
				if(found)
					foundMeetings.unshift(meetings[i]);

				if(meetings[i].chairmanId == userId)
					foundMeetings.unshift(meetings[i]);
		}
		return foundMeetings;
	};

    meetingFactory.getMeetings=function(userdata)  {

		//filter plz
		return meetingFactory.meetingFilter(meetingFactory.meetings,userdata.id);
    };


	meetingFactory.getMeeting=function(meeting_Id)	{
		for(var i = 0; i < meetingFactory.meetings.length;++i)
		{
			if(meetingFactory.meetings[i].id == meeting_Id)
			return meetingFactory.meetings[i];
		}
		return false;
	};

	//copied from concernService for reference
    /*PROPER
    concernFactory.postConcern=function(id,subject,description){
      return $http.post('/api/concerns',{
        id:id,
        subject:subject,
        description:description
      }).success(function (data) {
        return data;
      });
    }*/
	
	//TODO: Create proper post methods, preferably split up to not pass an entire meeting each time.
    meetingFactory.postMeeting = function(chairId,meeting){
      meetingFactory.meetings.unshift({
        id: meeting.Id,
        title: meeting.title,
        description: meeting.description,
        chairId: meeting.chairId,
        invitedId: meeting.invitedId,
        attendingId: [],
        state: 0,
        date: meeting.date,
        address: meeting.address,
        locName: meeting.locName,
        duration: meeting.duration,
        conditions: meeting.conditions,
        pollItems: [],
        agendaItemsP: [],
        agendaItems: []
      });
      console.log(meetingFactory.meetings);
    };
    return meetingFactory;

  });



