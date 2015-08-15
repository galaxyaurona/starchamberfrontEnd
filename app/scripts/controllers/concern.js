'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:ConcernCtrl
 * @description
 * # TestctrlCtrl
 * Controller of the starChamberUiApp
 */
angular.module('starChamberUiApp')
  .controller('ConcernCtrl', function ($scope,$rootScope,$location,$filter,ConcernService,UserService,uiGridConstants) {
    var statuses = [];
    $scope.concern = {};
    $scope.concerns = ConcernService.getConcern(UserService.userData);
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
        field:'subject',
        cellTemplate:'<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.showConcernDetails(row.entity)">{{row.entity.subject}}</a></div>'
      },
      {
        field:'date',
        cellFilter:'date:"dd/MM/yyyy"',
        filterCellFiltered:true,
        width:'15%',
      },
      {
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
      }
    ]





    $scope.gridOptions = {
      enableSorting:true,
      enableFiltering:true,
      columnDefs:columnDefs,
      data:$scope.concerns

    }

    $rootScope.boardName = "Concern";



    $scope.submitConcern = function (){
      if ($scope.concern.subject && $scope.concern.description) {
        if (ConcernService.postConcern(UserService.userData.id,$scope.concern)){
          $scope.concern = {};
          $scope.concernMessage = "Concern successfully submitted";
          $scope.messageClass = "alert-success";
          $scope.concerns = ConcernService.getConcern(UserService.userData);
        }else{
          $scope.concernMessage = "Error submitting concern, please try again";
        }
      }else{
        $scope.messageClass = "alert-danger";
        $scope.concernMessage = "Concern subject or description is empty, cannot submit this";
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
