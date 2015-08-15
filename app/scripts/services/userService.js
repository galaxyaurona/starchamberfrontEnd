'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.user
 * @description
 * # user
 * Service in the starChamberUiApp.
 */
angular.module('starChamberUiApp')
  .factory('UserService', function ($rootScope,$http,$q,AuthToken) {
    // AngularJS wi{ll instantiate a singleton by calling "new" on this function
    var userFactory = {}; // empty userFactory object
    userFactory.userData = {};

    userFactory.login = function(loginInfo){
       //TODO: calling proper API backend to login
     var mockToken = undefined;
      if ((loginInfo.username == 'manager') && (loginInfo.password == 'manager')){
        mockToken = {id:1,name:"Dwayne Der Stein",role:"manager",avatar:"http://www.mr-butler.com/wp-content/uploads/2015/04/The-Rock-wwe-champion-hd-wallpapers.jpg"}; // completely mock token for demonstration purpose
      }else if ((loginInfo.username == 'user') && (loginInfo.password == 'user')) {
        mockToken = {id:2,name:"Lucy Angel ",role:"user",avatar:"http://41.media.tumblr.com/d7a4552d99639890d00b5e85d9a18673/tumblr_mldfty8fh41qcnibxo1_540.png"}; // completely mock token for demonstration purpose
      }else if ((loginInfo.username == 'member') && (loginInfo.password == 'member')){
        mockToken = {id:3,name:"Julis von Reidrich",role:"member",avatar:"https://bigknickersrock.files.wordpress.com/2012/05/secretary-image1.jpg"}; // completely mock token for demonstration purpose
      }
      AuthToken.setToken(mockToken);
      return angular.isDefined(mockToken);
    };

    //----------- REAL LOGIN METHOD HERE WITH BACK END----------------
    /*userFactory.login = function(loginInfo){
	 console.log(loginInfo)
	 var req = {
        method:'POST',
        url:'http://www.ltuteamg.com:8000/api/users/auth',
        headers:{
          'Content-type': 'application/json'
        },
        data: loginInfo
      }
      return $http(req).then(function (response){
		console.log(response);
        AuthToken.setToken(response.token) // must agree with back end that json token from key token
        return response; // the actual object that login return
      })
    }*/

    userFactory.isLogin = function (){  // function to determined if they are logged in

      if (AuthToken.getToken()) {
        //console.log("Is login");
        //TODO: calling proper API backend to get userData
        userFactory.userData =  JSON.parse(AuthToken.getToken());
        if (userFactory.userData.role == 'user'){
          userFactory.userData.importantRole = false;
        }else{
          userFactory.userData.importantRole = true;
        }
        return true
      }else {
        userFactory.userData = {};
        return false
      }
    };

    userFactory.logout = function () {
      AuthToken.setToken();
      userFactory.userData = {};
    };

    return userFactory;
  })

  .factory('AuthToken',function($window) {
    var authTokenFactory = {};

    authTokenFactory.getToken = function (){
      return $window.localStorage.getItem('token');
    };

    authTokenFactory.setToken = function (token){
     if (token)
      $window.localStorage.setItem('token',JSON.stringify(token)); // set token if token is not undefined or null
     else
      $window.localStorage.removeItem('token'); // remove token when logout
    };
    return authTokenFactory;
  });
