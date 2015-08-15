'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.RESTService
 * @description
 * # RESTService
 * Service in the starChamberUiApp.
 */

var backendRoute = 'http://localhost:9000';


angular.module('starChamberUiApp')
  .factory('concernRESTService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
    // TODO: Implement REST for concern
    return $resource(backendRoute+itemRESTRoute,{},{


    });
  })
  .factory('minuteRESTService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
    // TODO: Implement REST for minute
    return $resource(backendRoute+itemRESTRoute,{},{


    });
  })
  .factory('reportRESTService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
    // TODO: Implement REST for report
    return $resource(backendRoute+itemRESTRoute,{},{


    });
  })
  .factory('votingRESTService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
    // TODO: Implement REST for voting
    return $resource(backendRoute+itemRESTRoute,{},{


    });
  })
  .factory('notificationRESTService', function ($resource) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      // $RESOURCE:https://docs.angularjs.org/api/ngResource/service/$resource
      // TODO: Implement REST for notification
      return $resource(backendRoute+itemRESTRoute,{},{


      });
    });
