'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.agendaService
 * @description
 * # agendaService
 * Service in the starChamberUiApp.
 */

angular.module('starChamberUiApp')
  .factory('agendaService', function ($q,$http,minuteRESTService) {
    var agendaFactory = {};
			//TODO: Give users the ability to edit submitted items - if creator id = your login token id then edit=true

	 //TODO: figure out why this freaks out
		agendaFactory.getItems = function(meetingId)
		{
			 var defered = $q.defer();
			$http.get('http://www.ltuteamg.com:8000/api/discus/meeting?id=' + meetingId,{
			}).success(function(data){
				defered.resolve(data.data);
			})
			return defered.promise;
		}

	//TODO: This probably doesnt need the deferred stuff.
		agendaFactory.postAgendaItem = function (agendaItem){
			 var deferred = $q.defer();
			$http.post('http://www.ltuteamg.com:8000/api/discus/d',agendaItem
		).success(function(data){
			deferred.resolve(data.data);
		})

      return deferred.promise;
		}

	 agendaFactory.updateAgendaItem = function(agendaItem){
      var deferred = $q.defer();
	  //agendaItem.roleId = agendaItem.role.key;
		console.log(agendaItem);
      $http.put('http://www.ltuteamg.com:8000/api/discus/d',agendaItem).success(function(data){
			deferred.resolve(data.data);
		})

      return deferred.promise;
    }
	return agendaFactory;
});
