angular.module('hawaiiqpon.coupon.controller', [])
.controller('couponCtrl', function($scope, Coupons, $cordovaGeolocation, $timeout, $ionicLoading, $ionicSideMenuDelegate, $ionicHistory, $state,  GeolocationService) {
  //Controller Properties
  var map;
  var host = 'http://hawaiiqpon.lordconsulting.net/uploads';
  
  $scope.coupons = [];
  $scope.premiumCoupons = [];  
  $scope.settings = {
    gps: true,
    listView: true,
    radius: 25
  }


  
  // Dont drag the menu open when we're panning the map
  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearHistory();
    $ionicSideMenuDelegate.canDragContent(false);
    //Show Loading Message
    $ionicLoading.show({
      template: 'Finding Deals...'
    });

    $timeout(function(){
      var options = {
        timeout: 10000,
        maximumAge: 600000,
        enableHighAccuracy: false
      };
      
      GeolocationService.getCurrentPosition(options).then(
            function (position) {
             //console.log(position.coords.latitude);
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
  

  $scope.updateCoupons = function(){      
      Coupons.getCoupons().then(function(coupons){ 
              
              var data = _(coupons.data.coupons).where({active:true});
              console.log(data);

              coupons.data.coupons.forEach(function(coupon){
                coupon.locations.forEach(function(location){
                      var locDistance = GeolocationService.calcDistance($scope.myLoc.lat, $scope.myLoc.long, location.loc.lat, location.loc.long, 'N');
                      location.distance = locDistance;
                      
                      location.desc = coupon.desc;
                      location.desc2 = coupon.desc2;
                      location.expiration = coupon.expiration;
                      location.owner = coupon.owner;
                      location.premium = coupon.premium;
                      location.title = coupon.title;
                      location.vendor = coupon.vendor;
                      location.vendor_url = coupon.vendor_url;
                      location.vendor_phone = coupon.vendor_phone;
                      location.promo_code = coupon.promo_code;
                      
                      if(coupon.img){
                          location.hasImage = true;
                          location.img =  coupon.img;
                      }else{
                          location.hasImage = false;
                          location.img = 'img/twlogo.png'
                      }
                      
                      location.launch = "window.open('" + location.vendor_url + "', '_system', 'location=yes'); return false;"
                      
                      
                      
                      if(coupon.category){
                        location.category = coupon.category;
                        location.icon = '/img/markers/' + coupon.category + '.png';
                      }else{
                        location.category = 'General';
                        location.icon = '/img/markers/General.png';
                      }                     
                      

                        if(location.distance <= 25 && !location.premium){
                          $scope.coupons.push(location);
                        }
                        
                        if(location.distance <= 25 && location.premium){
                          $scope.premiumCoupons.push(location);
                        }                        


                     
                });
              });
                            
              $ionicLoading.hide();
      });   
  }
  
  
  /*
  $scope.init = function(){
    $cordovaGeolocation
      .getCurrentPosition({timeout: 6000, enableHighAccuracy: true})
      .then(function (position) {
          
          var lat  = position.coords.latitude
          var long = position.coords.longitude
          //$scope.map = { center: { latitude: lat, longitude: long}, zoom: 8 }; 
          $scope.myLoc = {
            lat:lat,
            long: long
          }
  
      }, function(err) {
          // error
      })
      .then(function(){

          $scope.updateCoupons();
      }, function(err){
            // error
      });
  }
  */

  /*
  function calcDistance(lat1, lon1, lat2, lon2, unit) {
          var radlat1 = Math.PI * lat1/180;
          var radlat2 = Math.PI * lat2/180;
          var radlon1 = Math.PI * lon1/180;
          var radlon2 = Math.PI * lon2/180;
          var theta = lon1-lon2;
          var radtheta = Math.PI * theta/180;
          var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          dist = Math.acos(dist);
          dist = dist * 180/Math.PI;
          dist = dist * 60 * 1.1515;
          if (unit=="K") { dist = dist * 1.609344 };
          if (unit=="N") { dist = dist * 0.8684 };
          return Math.round(dist*100)/100;
  } 
  */
 
 
  //$scope.init(); 
   
});
