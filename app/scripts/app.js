'use strict';
var CKEDITOR_BASEPATH='scripts/ckeditor/';
var backendRoute = "";
/**
 * @ngdoc overview
 * @name starChamberUiApp
 * @description
 * # starChamberUiApp
 *
 * Main module of the application.
 */
angular
  .module('starChamberUiApp', [
    'ngRoute',
    'SCNavBarDirective',
	  'ui.router',
      'chart.js',
      'textAngular',
      'ckeditor',
    'angular.panels',
    'ui.grid',
    'ui.grid.selection',
    'ngBootbox',
    'flow',
    'ui.uploader',
    'shagstrom.angular-split-pane',
    'ui.bootstrap.accordion',
	'ui.bootstrap',
	'xeditable'
  ])
  .config(function ($routeProvider,$locationProvider,$httpProvider) {
    //$httpProvider.defaults.headers.common['Access-Control-Allow-Origin']="*";

    $routeProvider
      .when('/test',{
        templateUrl:'views/test.html',
        controller:'TestCtrl'
      })
      .when('/login',{
        templateUrl:'views/login.html',
        controller:'LoginCtrl'
      })
      .when('/concern',{
        templateUrl:'views/concern.html',
        controller:'ConcernCtrl',
        resolve:{
          //TODO: implement these resolve
          concerns: function(UserService){

          }
        }
      })
      .when('/dashboard',{
        templateUrl:'views/dashboard.html',
        controller:'DashboardCtrl',
        resolve:{
          minutes: function(minuteService,UserService){

          },
          meetings:function(meetingService,UserService){

          },
          reports:function(reportService,UserService){

          }
        }
      })
      .when('/meeting', {
        templateUrl: 'views/meetingmanager.html',
        controller: 'MeetingCtrl',
        resolve: {
          meeting:function($route,meetingService) {
            console.log($route, meetingService)
            return meetingService.getMeeting($route.current.params.id);
          }
        }
      })
      .otherwise({
        redirectTo: '/login'
      });
    //$locationProvider.html5Mode(true);
  })

  .run(function($rootScope,$location,$route,UserService,$http){


    $rootScope.checkSecurityClearance = function(){
      if(UserService.isLogin()){ // user is login

        // and try to go back to login page prevent double login
        if ($location.path() == "/login"){
          if (UserService.userData.importantRole){
            $location.path('/dashboard');
          }else{
            $location.path('/concern');
          }
        }
        // illegal access to dashboard, redirect back to concern
        if (($location.path() != '/concern') && (!UserService.userData.importantRole))
          $location.path('/concern');

      }else{ // user not logged in, redirect to login
        if ($location.path()!='/test'){
          $location.path("/login");
        }

      }
    };


    // do security check when route change start
    $rootScope.$on('$routeChangeStart', function(){
      $rootScope.checkSecurityClearance();
    });
    $rootScope.prettifyJSON = function(rawJSON){
      return JSON.stringify(rawJSON, null, 2);
    }



  })
  .run(function(editableOptions) {
	editableOptions.theme = 'bs3';
});
