'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:ConcernCtrl
 * @description
 * # TestctrlCtrl
 * Controller of the starChamberUiApp
 */
angular.module('starChamberUiApp')
  .controller('ConcernCtrl', function ($scope,$rootScope,$location,$filter,ConcernService,UserService,uiGridConstants,concerns) {
    var statuses = [];
    $scope.concern = {};
    $scope.concernTypes = ["LostItem","Complaint","Compliment",'Feedback','Other'];
    $scope.concerns = concerns;
    angular.forEach($scope.concerns, function (value, key) {
      if (statuses.map(function (element) {
          return element.value
        }).indexOf(value.status) == -1)
        statuses.push({value: value.status, label: value.status})

    })

    $scope.log= function (data) {
      console.log(data)
    };

    $scope.removeConcern = function(concern){

      ConcernService.deleteConcern(concern);
      var concernIndex = $scope.concerns.indexOf(concern);
      //$scope.concerns.splice(concernIndex,1);
      $scope.gridOptions.data = $scope.concerns;
    }

    var columnDefs = [
      {
        field:'title',
        cellTemplate:'<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.showConcernDetails(row.entity)">{{row.entity.title}}</a></div>'
      },
      {
        field:'raised',
        cellFilter:'date:"dd/MM/yyyy"',
        filterCellFiltered:true,
        width:'15%',
      },
      /*{
        field:'status',
        filter:{
          type: uiGridConstants.filter.SELECT,
          selectOptions: statuses
        },
        width:'15%'
      },
      {
        field:'Delete',
        width:100,
        enableFiltering:false,
        cellTemplate:'<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.removeConcern(row.entity)">Remove</a></div>'
      }*/
    ]

   /* window.onload = function(){
   	  $scope.concerns.forEach(function(concern){
   		  concern.raised = $rootScope.timeFromZoneConverter(new Date(concern.raised),moment());

   	  })
   	}*/



    $scope.gridOptions = {
      enableSorting:true,
      enableFiltering:true,
      columnDefs:columnDefs,
      data:$scope.concerns

    }

    $rootScope.boardName = "Concern";



    $scope.submitConcern = function (){


      if ($scope.concern.title && $scope.concern.description && $scope.concern.type) {
        var sendItem = {};
        if ($scope.concern.type =="Other"){
          sendItem._class ="Concern";
        }else{
          sendItem._class = $scope.concern.type;
        }

        $scope.tempConcern = angular.copy($scope.concern);
        $scope.tempConcern.type = undefined;
        sendItem.Concern= $scope.tempConcern;
        sendItem.Concern.date= $rootScope.dateToServer(new Date().valueOf());
        sendItem.Concern.role = {key:UserService.userData.board.id};
        sendItem.Concern.fileList = [];
        console.log(sendItem);

        ConcernService.postConcern(sendItem).then(function(){
          $scope.concern = {};
          $scope.concernMessage = "Concern successfully submitted";
          $scope.messageClass = "alert-success";
          ConcernService.getConcerns(UserService.userData).then(function(response){
            console.log('get concerns',response);
          });
        }, function(){
          $scope.messageClass = "alert-danger";
          $scope.concernMessage = "Error submitting concern, please try again";
        })
      }else{
        $scope.messageClass = "alert-danger";
        $scope.concernMessage = "Concern subject,description or type is empty, cannot submit this";
      }
    };



    $scope.showConcernDetails=function (concern){
      $scope.concernDetail = concern;
      $('#concern-modal').modal('show');
    };

    $('#show-modal').click(function(event) {

 		  $('#concern-modal').modal('show');
 	  });

 	  $("#close-modal").click(function () {
      console.log('hi');
 	 	  $('#concern-modal').modal('hide');
     });
  });
