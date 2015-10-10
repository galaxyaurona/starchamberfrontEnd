'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.concernService
 * @description
 * # concernService
 * Service in the starChamberUiApp.
 */
angular.module('starChamberUiApp')
  .factory('ConcernService', function ($filter,concernRESTService,$q,UserService,$rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var concernFactory = {};
    // PROPER CONCERNS
    concernFactory.getConcerns= function(roleId){
      var deferred = $q.defer();

      concernRESTService.getConcerns({id: roleId}, function (response) {
        console.log(response);
        if (response.data == undefined){
          deferred.resolve([]);
        }else{
          deferred.resolve(response.data);
        }

      },function(){
        deferred.reject([]);
      })


      return deferred.promise;

    }

    concernFactory.getConcerns= function(concernId){
      var deferred = $q.defer();

      concernRESTService.getConcerns({id: concernId}, function (response) {
        console.log('concerns',response);
        var returnItem = [];
        if (response.data == undefined){
          deferred.resolve([]);
        }else{
          console.log('im here with data',response.data);

          angular.forEach(response.data,function(value ,key){
            if (value._class.indexOf("Concern")==-1){

              value = value["starchamber.concerns.model.Concern"];
              if (value == undefined){
                value = value["Concern"];
              }
            }

            value.raised = new Date(value.raised*60*1000);
            returnItem.push(value);
          });
          console.log('new responde data',returnItem)
          deferred.resolve(returnItem);
        }

      },function(){
        deferred.reject([]);
      })


      return deferred.promise;

    }




    concernFactory.postConcern = function(concern){
      var deferred = $q.defer();
      concernRESTService.postConcern(concern,function(response){
        console.log("response",response)
        if (response.status == "success"){
          deferred.resolve();
        }else{
          deferred.reject([]);
        }
      });

      return deferred.promise;

    };

    concernFactory.deleteConcern = function(concern){
      //TODO: implement a rest call to remove concern from the back end as well
      var concernIndex = concernFactory.concerns.indexOf(concern);
      concernFactory.concerns.splice(concernIndex,1);

    }

    return concernFactory;
  });
