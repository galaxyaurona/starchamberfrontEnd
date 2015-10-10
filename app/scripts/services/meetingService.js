'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.meetingService
 * @description
 * # meetingService
 * Service in the starChamberUiApp.
 */
 
 //TODO: Implement angular-bootstrap date pickers to the input boxes used in meetings
angular.module('starChamberUiApp')
  .factory('meetingService', function ($filter,$http,$q,meetingRESTService,UserService) {
    var meetingFactory = {};

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

	//This gets invitations that contain a meeting your invited to
    meetingFactory.getMeetings=function(roleId)  {
      var UserServiceCopy = angular.copy(UserService);
      if (roleId == UserService){
        console.log(UserServiceCopy.userData);
        roleId = UserService['userData'].board.id;
      }
		 var defered = $q.defer();
		$http.get('http://www.ltuteamg.com:8000/api/invite/role?id=' + roleId,{ //Post userId to back end

		}).success(function(data){
			defered.resolve(data.data);
		})
			return defered.promise;
    };

    meetingFactory.getInvitesMeeting=function(meetingId)  {
		 var defered = $q.defer();
	//console.log(id);
		$http.get('http://www.ltuteamg.com:8000/api/invite/meeting?id=' + meetingId,{ //Post userId to back end
		}).success(function(data){
			defered.resolve(data.data);
		})
			return defered.promise;
    };

	meetingFactory.getBoardRoles=function(boardID)  {
		 var defered = $q.defer();
		$http.get('http://www.ltuteamg.com:8000/api/users/board?id=' + boardID,{ //Post userId to back end
		}).success(function(data){
			defered.resolve(data.data);
		})
			return defered.promise;
    };

meetingFactory.getMeeting= function(id){
    var deferred = $q.defer();
	//console.log(id);
    meetingRESTService.getMeeting({id:id},function(data){
      console.log("data",data);
        if (data.data != undefined)
          deferred.resolve(data.data);
        else
          deferred.reject({error:'cannot get meeting'})
    },function(error){
        console.log(error);
        deferred.reject({error:'cannot get meeting'})
    });
    return deferred.promise;

 };

   meetingFactory.updateMeeting = function(meeting){
      var deferred = $q.defer();
		console.log(meeting);
      meetingRESTService.updateMeeting(meeting,(function(response){
        //console.log(response);
        deferred.resolve(response);
      }))
	console.log(deferred.promise);
      return deferred.promise;
    }



	//TODO: Create proper post methods, preferably split up to not pass an entire meeting each time.
    meetingFactory.postMeeting = function(meeting){
      var deferred = $q.defer();
      meeting.id = undefined;
      meetingRESTService.postMeeting(meeting,function(response){
        //console.log('response',response);
        deferred.resolve(response);
      });
      console.log(meetingFactory.meetings);
      return deferred.promise;
    };
	
	meetingFactory.postInvite = function(invite){
		console.log(invite);
		var deferred = $q.defer();
		$http.post('http://www.ltuteamg.com:8000/api/invite/i',{ //Post userId to back end
			avaliabilities:invite.avaliabilities,
			id:invite.id,
			response:invite.response,
			role:invite.role,
			meeting:invite.meeting
		}).success(function(data){
			deferred.resolve(data.data);
		})
		 return deferred.promise;
	}
	meetingFactory.deleteInvite = function(inviteId){
		console.log(inviteId);
		var deferred = $q.defer();
		$http.delete('http://www.ltuteamg.com:8000/api/invite/i?id=' + inviteId,{ //Post userId to back end
		}).success(function(data){
			deferred.resolve(data.data);
		})
		 return deferred.promise;
	}
    return meetingFactory;

  });



