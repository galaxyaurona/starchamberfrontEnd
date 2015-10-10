'use strict';

/**
 * @ngdoc service
 * @name starChamberUiApp.user
 * @description
 * # user
 * Service in the starChamberUiApp.
 */

/*
+------------+
| username   |
+------------+
| ascott9    |
| astonet    |
| bwardh     |
| ccookk     |
| crobertsf  |
| cthomas14  |
| dwheelers  |
| eblackd    |
| egrantp    |
| ehicksi    |
| jboyd6     |
| jbrownl    |
| jcooper13  |
| jdiaz17    |
| jedwards18 |
| jgreen1d   |
| jpayne10   |
| kphillipsr |
| kyoung5    |
| lstewartm  |
| mwoodso    |
| nsimsa     |
| plynchj    |
| preyes1b   |
| rbryantb   |
| rray4      |
| rscott11   |
| rwood19    |
| tphillipsz |
| wolsonv    |
+------------
// manager jpayne10
 */
angular.module('starChamberUiApp')
  .factory('UserService', function ($rootScope,$http,$q,AuthToken,userRESTService) {
    // AngularJS wi{ll instantiate a singleton by calling "new" on this function
    var userFactory = {}; // empty userFactory object
    userFactory.userData = {};
    userFactory.originalToken = {};

    //----------- REAL LOGIN METHOD HERE WITH BACK END----------------
    userFactory.login = function(loginInfo){
      var deferred = $q.defer();

      if ((loginInfo.username == 'manager') && (loginInfo.password == 'manager')){
        deferred.resolve({id:1,name:"Dwayne Der Stein",role:"manager",avatar:"http://www.mr-butler.com/wp-content/uploads/2015/04/The-Rock-wwe-champion-hd-wallpapers.jpg"}); // completely mock token for demonstration purpose
      }else if ((loginInfo.username == 'user') && (loginInfo.password == 'user')) {
        deferred.resolve({id:2,name:"Lucy Angel ",role:"user",avatar:"http://41.media.tumblr.com/d7a4552d99639890d00b5e85d9a18673/tumblr_mldfty8fh41qcnibxo1_540.png"}); // completely mock token for demonstration purpose
      }else if ((loginInfo.username == 'member') && (loginInfo.password == 'member')){
        deferred.resolve({id:3,name:"Julis von Reidrich",role:"member",avatar:"https://bigknickersrock.files.wordpress.com/2012/05/secretary-image1.jpg"}); // completely mock token for demonstration purpose
      }else {
        userRESTService.login(loginInfo,
          function (response) {
            console.log(response);
            if (response.status == "success") {
              //AuthToken.setToken(response.data);
              deferred.resolve(response.data);
            } else {
              deferred.reject({message: "error occurred"});
            }

          });
      }


      return deferred.promise;
    }

    userFactory.selectBoard = function(token,board){


      AuthToken.setToken(token);
      userFactory.originalToken =  token;
      userFactory.userData = token.user.userData;
             userFactory.userData.name= userFactory.userData.title+'. '+userFactory.userData.givenNames
             +' '+userFactory.userData.familyName;
      userFactory.userData.roleList = userFactory.originalToken;
      userFactory.userData.id = userFactory.originalToken.user.id;
      userFactory.userData.role = board.name;
      userFactory.userData.board = board;
      if (userFactory.userData.avatar == undefined) {
        if (userFactory.userData.role =="manager"){
          userFactory.userData.avatar =  "http://www.theassociation.net/pics/jerryseinfeld/seinfeld1.jpg";
        }else if (userFactory.userData.role =="boardMember"){
          userFactory.userData.avatar = "https://iwh-indicatorwarehou.netdna-ssl.com/wp-content/uploads/2014/02/GeorgeCostanza1.jpg";
        }else{
          userFactory.userData.avatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXLyQnAANwYmmlTCDZ_BnGFTUHUJ1_ia62dnfX5NAvPY0dmIq5"
        }
      }
      //userFactory.userData.avatar = userFactory.userData.avatar == undefined ? "http://41.media.tumblr.com/d7a4552d99639890d00b5e85d9a18673/tumblr_mldfty8fh41qcnibxo1_540.png" : userFactory.userData.avatar;
      if (userFactory.userData.role == 'normalUser'){
        userFactory.userData.importantRole = false;
      }else{
        userFactory.userData.importantRole = true;
      }
      localStorage.setItem('currentBoard',JSON.stringify(board));


    }
    userFactory.isLogin = function (){  // function to determined if they are logged in

      if (AuthToken.getToken()) {
        //console.log("Is login");

        //TODO: calling proper API backend to get userData
        userFactory.originalToken =  JSON.parse(AuthToken.getToken());
        userFactory.selectBoard(userFactory.originalToken,JSON.parse(localStorage.getItem('currentBoard')));


        return true
      }else {
        userFactory.userData = {};
        return false
      }
    };

    userFactory.logout = function () {
      AuthToken.setToken();
      userFactory.userData = {};
      localStorage.removeItem('currentBoard');
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
