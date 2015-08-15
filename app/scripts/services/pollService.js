'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.pollService
 * @description
 * # pollService
 * Service in the starChamberUiApp.
 */

angular.module('starChamberUiApp')
  .factory('pollService', function () {
    var pollFactory = {};
	pollFactory.polls =
	pollFactory.postPoll = function(meeting,poll){
		meeting.pollItems.unshift({date:poll.date,time:poll.time,id:poll.id,votedId:poll.votedId});
	};

	return pollFactory;
});
