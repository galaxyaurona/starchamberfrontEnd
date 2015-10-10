'use strict';

/**
 * @ngdoc function
 * @name starChamberUiApp.controller:MeetingctrlCtrl
 * @description
 * # MeetingctrlCtrl
 * Controller of the starChamberUiApp
 */
 angular.module('starChamberUiApp')
  .controller('VoteCtrl', function ($scope,$rootScope,pollService,$routeParams,UserService,$filter,inviteRESTService,moment) {
	 
	 //Date object used by the date/time pickers for initial value purposes
	$scope.pollTimePicker = new Date(0);
	
	//Date/time objects used by the date/time pickers for the cutoff modal
	$scope.cutoffTimePicker = new Date(0);
	
  $scope.pollData={label:[],data:[],id:[],voted:[]};
  //Because of how the dohnut works it needs a straight array of numbers for the count of each part, this means that the number of people
  //who voted on a slot needs to be stored insead of just calling .length
	//The whole setup of bringing in data is real slow due to the loops, this could be cleaned up by using a hash table
	$scope.calculateDohnut= function(){
	$scope.pollData={label:[],data:[],id:[],voted:[]};
	$scope.containsTime = [];
	//TODO: Ensure that the labels update whenever something is deleted/pushed
    //TODO: REFACTOR THIS OMG
	for(var i = 0;i < $scope.meeting.availabilities.length;++i)
	{
	 $scope.pollData.label.push(moment($scope.dateFromZoneConverter($scope.meeting.availabilities[i].date,$scope.meeting.availabilities[i].timeStart)).format('DD/MM/YYYY') + " : " + 
		moment($scope.timeFromZoneConverter($scope.meeting.availabilities[i].date,$scope.meeting.availabilities[i].timeStart)).format("ddd, hh:mm a") + " to " 
		+ moment($scope.timeFromZoneConverter($scope.meeting.availabilities[i].date,$scope.meeting.availabilities[i].timeEnd)).format("ddd, hh:mm a"));
	 $scope.pollData.data.push(0);
	 $scope.pollData.id.push($scope.meeting.availabilities[i].id);
	 $scope.pollData.voted.push({votes:[]});
	}
	$scope.invites.forEach(function(inv)
	 {
		 inv.avaliabilities.forEach(function(av)
		 {
			 $scope.pollData.id.forEach(function(storedId)
			 {
				 if(storedId == av.id){
					 $scope.pollData.voted[$scope.pollData.id.indexOf(storedId)].votes.push(inv.role.key);
					 $scope.pollData.data[$scope.pollData.id.indexOf(storedId)]++;
				 }
			 })
		 })
	 })
  }

 $scope.calculateDohnut();
 $scope.alertText;
 $scope.alertShow = false;


  $scope.addMeetingTime = function(newDate,newTime)
	{
		//TODO: Ensure the user cannot add duplicate entries
	if($scope.meeting.availabilities.length < 12){
			var tempNewTime = moment(newTime);
			var tempEndTime = moment(newTime);
			console.log(tempEndTime);
			tempEndTime.add($scope.meeting.duration,'m');
			console.log(tempEndTime);
			$scope.temp = {
				date:$rootScope.dateToServer(newDate,tempNewTime),
				timeStart:$rootScope.timeToServer(newDate,tempNewTime),
				timeEnd:$rootScope.timeToServer(newDate,tempEndTime),
				id:undefined
				}
				console.log("heres temp");
				console.log($scope.temp);
				//TODO: get rid of poll service and just uncomment this line since availabilities are part of the meeting
				//meeting.availabilities.unshift(poll);
				pollService.postPoll($scope.meeting,$scope.temp);
				$scope.createFormattedAvailabilities();
				$('#timeModal').modal('hide');
		}else{
			//TODO: Change this to an alert
			$scope.alertText = "Maximum time poll limit reached!";
			$scope.alertShow = true;
		}
	};
	//TODO:There needs to be a timout function or such on this as sending multiple delete request very quickly causes crazy errors ie - infinite update loop
	$scope.deleteMeetingTime = function(id)
	{
		for(var i = 0;i < $scope.meeting.availabilities.length;++i)
		{
			if($scope.meeting.availabilities[i].id == id)
			{
				$scope.meeting.availabilities.splice(i,1);
			}
		}
		$scope.createFormattedAvailabilities();
	};

	$scope.vote = function(time){
		pollService.vote(time,$scope.invites);
		$scope.calculateDohnut();
	};

	//TODO: This probably isnt needed as a seperate function as all this does is create an array of what times a user has voted on.
     $scope.containsTimeCalculation = function(time){
       var isIn =0;
       $scope.invites.forEach(function (inv) {
         if (inv.role.key == UserService.userData.board.id) {
           var i = 0;
           while (i < inv.avaliabilities.length) {
             if (inv.avaliabilities[i].id == time.id) {
               isIn = 1;
               break;
             }
             i++;
           }
           if (isIn == 0) {
             $scope.containsTime[time.id]=false;
           } else {
             $scope.containsTime[time.id] = true;
           }
         }
       })
     }

     angular.forEach($scope.meeting.availabilities,function(value,key){
       $scope.containsTimeCalculation(value);
     });

	 //Cut off Date stuff
	 $scope.setCutOff = function(date,time){
		var realDate = angular.copy(date);
		 realDate.setHours(time.getHours());
		 realDate.setMinutes(time.getMinutes());
		 var momentDate = moment(realDate);
		if (momentDate >= moment()) {
			//Because the server still takes a time and date as seperate objects
			$scope.meeting.cutoffDate = $rootScope.dateToServer(date,time);
			$scope.meeting.cutoffTime =$rootScope.timeToServer(date,time);
			console.log($scope.meeting);
		   $scope.setCutOffError="";
		   $('#reModal').modal('hide');

		 }else{
		   $scope.setCutOffError = "Cut off date cannot be in the past"
		 }
		 
		 
	 }

	 //Set the meeting
	 $scope.setMeeting = function(date,time){
		 console.log(date);
		$scope.meeting.date = date;
		$scope.meeting.time = time;
		$scope.meeting.state="Scheduled";
	 }
	 
	 $scope.reschedule = function(date,time){
		$scope.setMeeting(date,time);
		$scope.meeting.state = "Polling";
		//Now we need to delete all existing poll times somehow
		//TODO: that
	 }
	
	//Modals
	 $scope.showPollModal = function()
	{
		$('#timeModal').modal('show');
	};
	
	$("#close-Poll").click(function () {
 	 	  $('#timeModal').modal('hide');
    });
	
	$scope.showCutoffModal = function()
	{
		$('#reModal').modal('show');
	};
	
	$("#close-Cutoff").click(function () {
 	 	  $('#reModal').modal('hide');
    });
	
  });
