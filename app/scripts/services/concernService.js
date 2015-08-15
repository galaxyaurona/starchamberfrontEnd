'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.concernService
 * @description
 * # concernService
 * Service in the starChamberUiApp.
 */
angular.module('starChamberUiApp')
  .factory('ConcernService', function ($filter) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var concernFactory = {};
    concernFactory.concerns = [{
      id: 1, subject: "Earthquake alarm",
      date: new Date(2015, 4, 29),
      description: "Earthquake alarm goes off on its own.Really irritating",
      status: "discussed",
      userId: 3,
      fileList:[]
    },
      {
        id: 2, subject: "Loud noise from apartment 23",
        date: new Date(2015, 7, 23),
        description: "Tenant playing bagpipe all night with his girlfriend.It's annoying that it is so loud.But good for them",
        status: "planned",
        userId: 3,
        fileList:[]
      },
      {
        id: 3, subject: "New tenant pet's snake",
        date: new Date(2014, 3, 5),
        description: "Not sure if it's an anaconda, but it definitely wants my bun",
        status: "pending",
        userId: 2
      },
      {
        id: 4, subject: "Auction for unit 5",
        date: new Date(),
        description: "Will the auctioneer park their car on our parking spot",
        status: "pending",
        userId: 1,
        fileList:[]
      },
      {
        id: 5, subject: "Dangling high voltage cable",
        date: new Date(),
        description: "General/Civil engineers did a bad job wiring the high voltage cable to the pole,now they dangling near my water tank.",
        status: "planned",
        userId: 3,
        fileList:[]
      },
      {
        id: 6, subject: "Rat found near the sewer line",
        date: new Date(),
        description: "I can't even",
        status: "discussed",
        userId: 2,
        fileList:[]
      }];

    /* PROPER CONCERNS
    concernFactory.getConcern(id,role){
      return $http.get('/api/concerns',{ // post username and password to back end
             id:id,
             role:role
           }).success(function (data){
             AuthToken.setToken(data.token) // must agree with back end that json token from key token
             return data; // the actual object that login return
           })
    }*/


    concernFactory.getConcern=function(userdata)  {
      if (userdata.role != 'user'){
        return concernFactory.concerns;
      }else{
        return $filter('filter')(concernFactory.concerns,{userId:userdata.id});
      }

    };
    /*PROPER
    concernFactory.postConcern=function(id,subject,description){
      return $http.post('/api/concerns',{
        id:id,
        subject:subject,
        description:description
      }).success(function (data) {
        return data;
      });
    }*/
    concernFactory.postConcern = function(id,concern){
      concernFactory.concerns.unshift({subject:concern.subject,date:new Date(),description:concern.description,status:'pending',userId:id});
      return true;
      console.log(concernFactory.concerns);
    };

    concernFactory.deleteConcern = function(concern){
      //TODO: implement a rest call to remove concern from the back end as well
      var concernIndex = concernFactory.concerns.indexOf(concern);
      concernFactory.concerns.splice(concernIndex,1);
      //console.log(concernIndex);
    }

    return concernFactory;
  });
