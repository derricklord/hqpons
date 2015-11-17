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
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <p>Finding Deals...</p>'
    });
    var data = [];
    var premiumData = [];
    var tempCoupons = Coupons.refreshCoupons();
    tempCoupons.forEach(function(coupon){
        if(coupon.premium){
          premiumData.push(coupon);
        }
        if(!coupon.premium){
          data.push(coupon);
        }
    });
    $scope.coupons = data;
    $scope.premiumCoupons = premiumData;  
    $ionicLoading.hide();
    console.log($scope.coupons);
    
    //$scope.updateCoupons();
  }
  

  //Update Coupons
  $scope.updateCoupons = function(){  
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
})
.controller('detailsCtrl', function($scope, $stateParams, Coupons) {
    var Id = $stateParams.id;
    $scope.offer = Coupons.getCoupon(Id);
    $scope.windowOptions = {
        visible: true
    };
    $scope.map = { center: { latitude: $scope.offer.loc.lat , longitude: $scope.offer.loc.long }, zoom: 15 };
    
    $scope.marker = {
      id: 0,
      coords: {
        latitude: $scope.offer.loc.lat,
        longitude: $scope.offer.loc.long
      },
      options: { draggable: false, icon: 'img/marker.png' }
      /*
      events: {
        dragend: function (marker, eventName, args) {
          $log.log('marker dragend');
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          $log.log(lat);
          $log.log(lon);

          $scope.marker.options = {
            draggable: true,
            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
            labelAnchor: "100 0",
            labelClass: "marker-labels"
          };
        }
      }
      */
    };   
    
});


