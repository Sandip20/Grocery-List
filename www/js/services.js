angular.module('starter')
 
.service('AuthService', function($q, $http, API_ENDPOINT) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;
  var userDetails;
  var groceries=[];
  groceries.groceryItems=[];


  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };
 
  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/authenticate', user).then(function(result) {
        if (result.data.success) {
          storeUserCredentials(result.data.token);
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };


var grocery = function(user){

  return $q(function(resolve,reject){
    $http.post(API_ENDPOINT.url+'/showgroceries',user).then(function(result){
 console.log(result);
 if(result.data.success) {
 // groceries.groceryItems=result.data.grocerydata;
  resolve(result.data.grocerydata);

 }
 else{
  reject(result.data.grrocerydata);
 }    

    });

  });
};
var addGroceryItem=function(item){

console.log(item);

  return $q(function(resolve,reject){
    $http.post(API_ENDPOINT.url+'/addgrocery',item).then(function(result){
 console.log(result);   
if(result.data.success){
  resolve(result.data.result);
}
else{
  reject(result.data.errmsg);
}
   });

  });
};

var removeItem=function(item){

return $q(function(resolve,reject){
$http.post(API_ENDPOINT.url+'/removeItem',item)

.then(function(result){
  if (result.data.success) {
    resolve(result.data);
  }
  else{
    reject(result.data);
  }


})  

});

};


 
  var logout = function() {
    destroyUserCredentials();
  };
 
 var getUserDetails = function(){
return $q(function(resolve,reject){

   $http.get(API_ENDPOINT.url+'/userDetails').then(function(result){
    console.log(result);
    if(result.data.success){
      resolve(result.data.result);
    }

  })
});
 

 };
var updateProfile=function(user){
  return $q(function(resolve,reject){
    $http.post(API_ENDPOINT.url+'/updateUser',user)
    .then(function(result){
      if(result.data){
        resolve(result.data);
      }
      else{
        reject(result.data);
      }

    });
  });

}


  loadUserCredentials();
 
  return {
      login: login,
    register: register,
    logout: logout,
    updateProfile:updateProfile,
   // groceries:groceries,
   getUserDetails: getUserDetails,
   grocery :grocery,
   addGroceryItem:addGroceryItem,
   removeItem:removeItem,
    isAuthenticated: function() {return isAuthenticated;},
     
  };
})
 
.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});