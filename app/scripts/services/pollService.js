'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.pollService
 * @description
 * # pollService
 * Service in the starChamberUiApp.
 */

angular.module('starChamberUiApp')
  .factory('pollService', function (UserService,inviteRESTService) {
    var pollFactory = {};
	pollFactory.postPoll = function(meeting,poll){
    console.log("poll object",poll);
		meeting.availabilities.unshift(poll);
	};
	pollFactory.vote = function(time,invites){
		var isIn = 0;
		invites.forEach(function(inv){
			if(inv.role.key == UserService.userData.board.id)
			{
				var i = 0;
				while(i < inv.avaliabilities.length){
					if(inv.avaliabilities[i].id == time.id){
						isIn = 1;
						break;
					}
						i++;
				}

				if(isIn == 0){
					var newInv = angular.copy(time);
					//Setting the vote details to be back to their date object to store in the vote
					//TODO: Change this so that it just runs through the non formatted array instead of holding on to its previous value since they share the same ID.
					if(newInv.tempDate != undefined){
						newInv.date = angular.copy(time.tempDate);
						newInv.timeStart = angular.copy(time.tempTimeStart);
						newInv.timeEnd = angular.copy(time.tempTimeEnd);
						newInv.tempTimeEnd = undefined;
						newInv.tempTimeStart = undefined;
						newInv.tempDate = undefined;
					}
					inv.avaliabilities.push(newInv);
				}
				else{
					inv.avaliabilities.splice(i,1);
				}
        console.log("inv",inv);
        inviteRESTService.updateInvite(inv,function(response){
          console.log('here is the response after update invite',response);
        });
			}
		})
	}
	return pollFactory;
});
