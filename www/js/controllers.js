angular.module('starter')
.factory('UserProfile',function(){
  return{
    setUserDetails:function(){

    },
    getUserDetails:function(){

    }
  }
})
 
.controller('LoginCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    email: '',
    password: ''
  };
 
  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('inside');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})
 
 
.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    fname: '',
    lname: '',
    email: '',
    password: ''
  };
 
  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
        $scope.user = {
    fname: '',
    lname: '',
    email: '',
    password: ''
  };
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    }

    );
  };


})
 
.controller('InsideCtrl', function($scope,  $filter,AuthService, API_ENDPOINT, $http, $state,$ionicSideMenuDelegate,$ionicModal,$ionicPopup) {
/*  AuthService.grocery(function(){
  
  });*/


      
      AuthService.getUserDetails().then(function(result){
console.log('inside user');
//console.log(result);
$scope.user.fname=result.fname;
$scope.user.lname=result.lname;
$scope.user.email=result.email;
$scope.user._id=result._id;



AuthService.grocery($scope.user).then(function(data){
$scope.groceryItems=data;
  });
  
});



 
 $ionicModal.fromTemplateUrl('templates/profile.html',{
scope:$scope
}).then(function(profile){
  $scope.profile=profile;

});



  $scope.getUserInfo=function(){
 
AuthService.getUserDetails().then(function(result){
console.log('got user Details');
console.log($scope.user._id); 
//console.log(result);
$scope.user.fname=result.fname;
$scope.user.lname=result.lname;
$scope.user.email=result.email;
$scope.user._id=result._id;
});
$scope.profile.show();

 }
$scope.updateProfile=function(){

AuthService.updateProfile($scope.user).then(function(result){


  if(result.success){
    var alertPopup=$ionicPopup.alert({
  title:'Record Updated Successfully !',

});
$scope.profile.hide();
}
else{
      var alertPopup=$ionicPopup.alert({
  title:'Can not Update !',
template:result.msg
});
     

}


})

}
  $scope.newPoduct={};
 

$ionicModal.fromTemplateUrl('templates/modal.html',{
scope:$scope
}).then(function(modal){
  $scope.modal=modal;

});
$scope.createProduct = function(){
   $scope.newPoduct._id=$scope.user._id;
  if($scope.newPoduct.item){
  $scope.newPoduct.item= $filter('uppercase')($scope.newPoduct.item);
console.log('creating product id');
  console.log($scope.user._id); 
AuthService.addGroceryItem($scope.newPoduct).then(function(result){
console.log(result);
$scope.groceryItems=result;
$scope.modal.hide();
$scope.newPoduct.item='';

console.log('closed');
},function(errMsg){

   var alertPopup = $ionicPopup.alert({
        title: 'Record already exist !',
        template: 'plz enter unique'
      });
$scope.newPoduct.item='';
})

}
else{

   var alertPopup = $ionicPopup.alert({
        title: 'Can not be empty!',
        template: 'plz enter valid input'
      });
}

};

/*AuthService.grocery($scope.user).then(function(data){
$scope.groceryItems=data;
  });*/

  $scope.close=function(){
$scope.modal.hide();
$scope.profile.hide();
$scope.newPoduct.item='';
  };

  $scope.remove=function(item){

console.log(item);
var removeEntry={};
removeEntry.itemName=item.itemName;
removeEntry._id=$scope.user._id;
AuthService.removeItem(removeEntry).then(function(data){
$scope.groceryItems=data.result;
var alertPopup = $ionicPopup.alert({
        title: 'Success',
        template: data.msg
      });

},function(errMsg){
   var alertPopup = $ionicPopup.alert({
        title: 'problem!',
        template: errMsg
      });
})

  };

  



  $scope.destroySession = function() {
    AuthService.logout();
  };


 
  $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
    });
  };
 
  $scope.logout = function() {
    AuthService.logout();
    console.log($state.go('outside.login'));
  };


/*var value=true;*/
   $scope.toggleLeft = function() {
/*    if(value== true){
       $ionicSideMenuDelegate.toggleLeft(value);
      value=false;
    }else{
       $ionicSideMenuDelegate.toggleLeft(value);
       value=true;
    }
*/
 
   $ionicSideMenuDelegate.toggleLeft();


  };

})

 
.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});