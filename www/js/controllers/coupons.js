angular.module('hawaiiqpon.coupon.controller', [])
.controller('couponCtrl', function($scope, $state, Coupons, Settings, $timeout, $ionicLoading, $ionicHistory, GeolocationService) {
 
 
 //Controller Properties
  $scope.coupons = [];
  $scope.premiumCoupons = [];  
  $scope.myLoc = Settings.location;
  $scope.gps = Settings.gps;


  //Initialize Controller on View enter
  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearHistory();  
    $scope.updateCoupons();
  }); //end of view enter


  //Refresh Coupons
  $scope.refresh = function(){
    $scope.$broadcast('scroll.refreshComplete');
    $scope.updateCoupons();
  }
  

  //Update Coupons

  $scope.updateCoupons = function(category){  
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <p>Finding Deals...</p>'
    });
    
    $timeout(function(){
        var options = {
          timeout: 60000,
          maximumAge: 600000,
          enableHighAccuracy: true
        };  
        
        GeolocationService.getCurrentPosition(options).then(          
          function (position) {
              $scope.myLoc = {
                lat: position.coords.latitude,
                long: position.coords.longitude
              }
              

        
              Coupons.getCoupons($scope.myLoc).then(function(coupons){
                  var data = [];
                  var premiumData = [];
                  coupons.forEach(function(coupon){
                      if(coupon.premium){
                        premiumData.push(coupon);
                      }
                      if(!coupon.premium){
                        data.push(coupon);
                      }
                  });
                  $scope.coupons = data;
                  $scope.premiumCoupons = premiumData;
              });
              
              $ionicLoading.hide();
          });
     });
  }  
});

