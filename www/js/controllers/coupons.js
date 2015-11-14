angular.module('hawaiiqpon.coupon.controller', [])
.controller('couponCtrl', function($scope, Coupons, Settings, $timeout, $ionicLoading, $ionicHistory, GeolocationService) {
 
 
 //Controller Properties
  $scope.coupons = [];
  $scope.premiumCoupons = [];  


  //Initialize Controller on View enter
  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearHistory();

    //Show Loading Message 
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
          
                $scope.updateCoupons();                   
                $ionicLoading.hide();
            },
            function() {
                $ionicLoading.hide();
            }
      );
    });
  });  
  
  
  
  //Update Coupons
  $scope.updateCoupons = function(category){  
    Coupons.getCoupons($scope.myLoc).then(function(coupons){
        coupons.forEach(function(coupon){
            if(coupon.premium){
              $scope.premiumCoupons.push(coupon);
            }
            if(!coupon.premium){
              $scope.coupons.push(coupon);
            }
        });
    });     
  } 
  
  //Refresh Coupons
  $scope.refresh = function(){
    $scope.coupons = [];
    $scope.premiumCoupons = [];  
    $scope.$broadcast('scroll.refreshComplete');
    $scope.updateCoupons();
  }
  
});
