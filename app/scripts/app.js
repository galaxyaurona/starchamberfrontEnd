'use strict';
var CKEDITOR_BASEPATH='scripts/ckeditor/';
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
    'ngResource',
    'colorpicker.module',
	'ui.bootstrap',
	'xeditable',
	'angularMoment'

  ])
  .config(function ($routeProvider,$locationProvider,$httpProvider) {
    //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    $httpProvider.defaults.headers.common["X-UserInfo"] = "Cherry Wong";
    $httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };
    $routeProvider
      .when('/template/create',{
        templateUrl: 'views/createTemplate.html',
        controller: 'CreateTemplateCtrl',
        resolve:{
          template:function(templateRESTService,UserService,$q){
            var deferred = $q.defer();
            templateRESTService.createTemplate({board:{key:UserService.userData.board.board.id}},function(response){
              deferred.resolve(response);
            })
            return deferred.promise;
          }
        }
      })
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
          concerns: function(UserService,ConcernService){


            return ConcernService.getConcerns(UserService.userData.board.id)
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
              return meetingService.getMeetings(UserService);
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
				return meetingService.getMeeting($route.current.params.id);
				  },
				  //Invites are included in the meeting directly as they get used in multiple sub views.
				invites:function($route,meetingService){
				return meetingService.getInvitesMeeting($route.current.params.id);
				}
			}
      })
      .when('/wip',{
        templateUrl: 'views/templates.html'
      })
      .when('/information' ,{
        templateUrl: 'views/information.html',
        controller:'InfoCtrl'

      })
      .otherwise({
        redirectTo: '/login'
      });
    //$locationProvider.html5Mode(true);
  })

  .run(function($rootScope,$location,$route,UserService,$http){

    $rootScope.console = console;
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
    $rootScope.$on('$routeChangeStart', function(event,next,current){
      /*if (angular.isDefined(current) && current.$$route.originalPath =='/dashboard'){
        event.preventDefault();
      }*/

      $rootScope.checkSecurityClearance();
    });
    $rootScope.prettifyJSON = function(rawJSON){
      return JSON.stringify(rawJSON, null, 2);
    }

    $rootScope.dateConverter = function(date,reverse){
      //console.log(dateInLong);
      //console.log(dateInLong+' becomes '+new Date(dateInLong));
      if (reverse) { // this date is who
        var convertedDate = date/60/1000;
      }else{
        var convertedDate =new Date(date*60*1000);

      }
      return convertedDate;
    }
      $rootScope.timeConverter = function(date,millisecondFromMidnight,reverse){
        var timeZoneOffSetInMinute = new Date().getTimezoneOffset();
        //console.log(millisecondFromMidnight+' becomes '+Math.floor(timeInt) + (timeInt%1)*60);
        // convert floating point to minute
        if (reverse){

        }else{
          var dateConverted = new Date((millisecondFromMidnight + date - timeZoneOffSetInMinute) * 60 * 1000);

          var minute = dateConverted.getMinutes();
          minute = minute > 9 ? "" + minute : "0" + minute;

          return dateConverted.getHours() + ":" + minute;
        }



      }

    //--------------------------------TIME ZONE CONVERSION------------------------------------------------------------
    	 //When converting a time and date that are seperate ensure to call Time converter before Date converter
		//TODO: Clean this all up a tad

    	 //For converting time objects to unix time
    	 $rootScope.timeToServer = function(date,time){
			 //For some reason if the value is innitialized as the date it becomes the correct timeZone
			 //but innitialized as time and it incorrectly assumes it is daylight savings (most likely due to the innitial time value being in said zone)
			 var tempDate = moment(date);
			 var temp = moment(time);
			 tempDate.add(temp.hours(),'h');
			 tempDate.add(temp.minutes(),'m');
			 var newTime = (tempDate.valueOf()/1000/60)%1440;
			 console.log(newTime);
			 console.log(moment(newTime));
			 //TODO: Test this shit
			 return newTime;
    	 }
    	 //For converting date objects to unix time, since date objects get a time, add relevant time to it incase of day transfer
    	$rootScope.dateToServer = function(date,time){
			var tempDate = moment(date);
			var tempTime = moment(time);
			tempDate.add(tempTime.hours(),'h');
			tempDate.add(tempTime.minutes(),'m');
			//This sets the time of the date to 0 while leaving the date to the changed value if it goes back or forward a day
			var test = (tempDate.valueOf()/1000/60) - ((tempDate.valueOf()/1000/60)%1440);
			return test;
    	}
    	//For converting times from GMT - currently hard coded to melbourne time from GMT
    	//For converting times from GMT - currently hard coded to melbourne time from GMT
    	  $rootScope.timeFromZoneConverter = function(date,time){
			var tester = moment((date*60000) + (time*60000));
			return  tester;
    	 }
    	 //For converting date objects from GMT, since date objects get a time, add relevant time to it incase of day transfer
    	$rootScope.dateFromZoneConverter = function(date,time){
			var tempDate = moment((date*60000) + (time*60000)); //so we add the unix time together BEFORE it converts back to the current timezone.
    		return tempDate;
    	}


  })
  .run(function(editableOptions,amMoment) {
	editableOptions.theme = 'bs3';
	amMoment.changeLocale('de');
});
