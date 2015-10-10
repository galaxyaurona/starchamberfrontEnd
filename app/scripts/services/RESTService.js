'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.RESTService
 * @description
 * # RESTService
 * Service in the starChamberUiApp.
 */

var backendRoute = 'http://www.ltuteamg.com:8000/api/';
//GET or DELETE: /url/path/to/endpoint?<variable>=<value>
//POST or PUT: /url/path/to/endpoint, data in body

angular.module('starChamberUiApp')
  .factory('concernRESTService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
    // TODO: Implement REST for concern
    var itemRESTRoute = "concerns"
    return $resource(backendRoute+itemRESTRoute,{},{
      getConcerns: {
        method:'GET',
        url:backendRoute+itemRESTRoute+'/role?'
      },
      getConcern: {
        method:'GET',
        url:backendRoute+itemRESTRoute+'/c?'
      },
      postConcern : {
        method:'POST',
        url:backendRoute+itemRESTRoute+'/c?'
      }

    });
  })
  .factory('userRESTService',function($resource){
    var itemRESTRoute = "users";
    return $resource(backendRoute+itemRESTRoute,{}, {
      login : {
        method:'POST',
        url:backendRoute+itemRESTRoute+'/auth'
      }
    })
  })
  .factory('meetingRESTService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
    // TODO: Implement REST for meeting
    var itemRESTRoute = "meetings";
    return $resource(backendRoute+itemRESTRoute,{},{
      getMeeting: {
        method:'GET',
        url:backendRoute+itemRESTRoute+"/m?"
      },
      postMeeting:{
        method:'POST',
        url:backendRoute+itemRESTRoute+"/m"
      },
      updateMeeting:{
        method:'PUT',
        url:backendRoute+itemRESTRoute+"/m"
      }     ,
      getMeetingsMinute: {
           method:'GET',
           url:backendRoute+itemRESTRoute+"/minute?"
      },
    });
  })
  .factory('minuteRESTService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
    // TODO: Implement REST for minute
    var itemRESTRoute = "notes";
    return $resource(backendRoute+itemRESTRoute,{},{
      getNotes:{
        method:'GET',
        url:backendRoute+itemRESTRoute+"/discus"
      },
      createNote:{
        method:'POST',
        url:backendRoute+itemRESTRoute+"/n"
      },
      updateNote: {
        method: 'PUT',
        url: backendRoute + itemRESTRoute + '/n'
      },
      getNote: {
        method: 'GET',
        url: backendRoute + itemRESTRoute + '/n'
      },
      createMinute:{
        method:'POST',
        url:backendRoute+'minutes/m'
      },
      getMinute:{
        method:'GET',
        url:backendRoute+'minute/meeting'
      },
      updateMinute:{
        method:'PUT',
        url:backendRoute+'minutes/m'
      },
      createDecision:{
        method:'POST',
        url:backendRoute+'decisions/d'
      },
      updateDecision: {
        method: 'PUT',
        url: backendRoute + 'decisions/d'
      },
      getDecision : {
        method: 'GET',
        url: backendRoute + 'decisions/d?'
      },
      getVote:{
        method: 'GET',
        url: backendRoute + 'decisions/d?'
      },
      vote:{
        method: 'PUT',
        url: backendRoute + 'decisionsOptions/o'
      },
      unvote:{
        method:'DELETE',
        url: backendRoute + 'decisionsOptions/o'
      }


    });
  })
  .factory('reportRESTService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
    // TODO: Implement REST for report
    return $resource(backendRoute+itemRESTRoute,{},{


    });
  })
  .factory('inviteRESTService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
    // TODO: Implement REST for voting
    var itemRESTRoute = "invite";
    return $resource(backendRoute+itemRESTRoute,{},{
      updateInvite:{
        method:'PUT',
        url:backendRoute+itemRESTRoute+"/i"
      }

    });
  })
  .factory('notificationRESTService', function ($resource) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
      // TODO: Implement REST for notification
      return $resource(backendRoute+itemRESTRoute,{},{


      });
    })
  .factory('templateRESTService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
    // TODO: Implement REST for notification
    return $resource(backendRoute, {}, {
      createTemplate:{
        method:'POST',
        url : backendRoute + "templates/t"
      },
      updateTemplate:{
        method:'PUT',
        url : backendRoute + "templates/t"
      }
    });
  });
