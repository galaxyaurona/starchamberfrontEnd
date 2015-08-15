'use strict';

/**
 * @ngdoc directive
 * @name starChamberUiApp.directive:StarChamberNavBar
 * @description
 * # StarChamberNavBar
 */
angular.module('SCNavBarDirective',['starChamberUiApp'])
  .directive('scNavbar', function ($location,UserService,$window) {
    return {
      templateUrl: 'views/partials/navbar.html',
      restrict: 'E',
      //controller:'SCNavBarController as ctrl',
      replace:true,
      link: function(scope,elem,attr){
        scope.UserService = UserService;
        scope.notifications = [
              {link:"#/concern",content:"You have a new concern to be viewed",visited:false},
              {link:"#/meeting/213",content:"You are invited to attend a meeting.",visited:false}
        ];

        scope.visitedAll= function(){
          scope.newNotification = false;
          angular.forEach(scope.notifications, function(value, key) {
            value.visited= true;
          })
        }
        // detect new notification
        scope.$watch('notifications', function(){
            scope.newNotificationCount =0;
            angular.forEach(scope.notifications, function(value,key) {
              scope.newNotification = scope.newNotification || (!value.visited);
              if (!value.visited){
                scope.newNotificationCount++;
              }
            })
        })

        scope.logout = function(){
          UserService.logout();
          $location.path('/login');
        };

        scope.loadMore = function(){
          console.log('Calling to API load more',UserService);
        };
      }
    };

  });
