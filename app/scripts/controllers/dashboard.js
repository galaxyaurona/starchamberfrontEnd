'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the starChamberUiApp
 */
angular.module('starChamberUiApp')
  .controller('DashboardCtrl', function ($log,$scope,$rootScope,$location,$filter,UserService,meetingService,uiGridConstants,meetings,reports,minutes) {
 // status : scheduled- pending - polling
     // scheduled: modified or rescheduled or cancelled or modifiable
     // pending: polling
     if (UserService.userData.role == "manager"){
       $scope.manager = true;
     }else {
       $scope.manager = false;
     }
     $rootScope.boardName="Dashboard";

     var schedulingStatuses = [];
    $scope.meetings = angular.copy(meetingService.getMeetings(UserService.userData));
    console.log($scope.meetings);
    angular.forEach($scope.meetings, function (outterValue, key) {
      if (schedulingStatuses.map(function (element) {
          return element.value
        }).indexOf(outterValue.state) == -1)
        switch (outterValue.state){
          case 0:outterValue.state="Polling";break;
          case 1:outterValue.state="Pending";break;
          case 2:outterValue.state="Scheduled-Agenda open";break;
          case 3:outterValue.state="Scheduled-Agenda closed";break;
          default:outterValue.state="meeting";
        }
        schedulingStatuses.push({value: outterValue.state, label: outterValue.state})


    })
    var meetingColumnDefs = [
      {
        field: 'title',
        cellTemplate: '<div class="ui-grid-cell-contents"><a ng-href="/#/meeting?id={{row.entity.id}}">{{row.entity.title}}</a></div>'
      },
      {
        field: 'date',
        cellFilter: 'date:"dd/MM/yyyy"',
        filterCellFiltered: true,
        width: '15%',
      },
      {
        field: 'state',
        filter: {
          type: uiGridConstants.filter.SELECT,
          selectOptions: schedulingStatuses
        },
        width: '30%'
      },
      {
        field: 'conditions',
        width: '30%',
        enableFiltering: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><span ng-repeat="(key, value) in row.entity.conditions" ng-if="value"><strong>{{key}}</strong> </span></div>'
      }
    ]

    $scope.meetingGridOptions = {
      enableSorting: true,
      enableFiltering: true,
      enableHorizontalScrollbar:0,
      enableVerticalScrollbar:0,
      columnDefs: meetingColumnDefs,
      data: $scope.meetings

    }
    var minuteColumnDefs = [
      {
        field: 'title',
        cellTemplate: '<div class="ui-grid-cell-contents"><a ng-href="/#/minute/{{row.entity.id}}">{{row.entity.title}}</a></div>'
      },
      {
        field: 'date',
        cellFilter: 'date:"dd/MM/yyyy"',
        filterCellFiltered: true,
        width: '30%',
      },
      {
        field: 'export',
        width: '15%',
        enableFiltering: false,
        cellTemplate: '<div class="ui-grid-cell-contents"><a>Export</a></div>'
      }
    ]
    $scope.minutes= [{title:"Monthly meeting's minute",date:new Date('18 Feb 2015 17:30:00'),url:"/#/test/#"},{title:"Weekly meeting's minute",date:new Date('12 March 2015 03:30:00'),url:"/#/test/#"}];
    $scope.minuteGridOptions = {
         enableSorting: true,
         enableFiltering: true,
         columnDefs: minuteColumnDefs,
         data: $scope.minutes

       }
    var reportColumnDefs = [
         {
           field: 'title',
           cellTemplate: '<div class="ui-grid-cell-contents"><a ng-href="/#/minute/{{row.entity.id}}">{{row.entity.title}}</a></div>'
         },
         {
           field: 'date',
           cellFilter: 'date:"dd/MM/yyyy"',
           filterCellFiltered: true,
           width: '30%',
         },
         {
           field: 'export',
           width: '15%',
           enableFiltering: false,
           cellTemplate: '<div class="ui-grid-cell-contents"><a>Export</a></div>'
         }
       ]

     $scope.reports= [{title:"Finance report",date:new Date('24 June 2015 17:30:00'),url:"/#/test/#"},{title:"Security report",date:new Date('29 February 2015 03:30:00'),url:"/#/test/#"}];
    $scope.reportGridOptions = {
         enableSorting: true,
         enableFiltering: true,
         columnDefs: reportColumnDefs,
         data: $scope.reports

       }
;



   // jquery animation here

 	  $("#close-calendar").click(function () {
 	 	  $('#calendar-modal').modal('hide');
     });
    $("#show-calendar").click(function () {
      $('#calendar-modal').modal('show');
    });

  });
