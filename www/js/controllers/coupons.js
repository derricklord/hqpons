angular.module('hawaiiqpon.coupon.controller', [])
.controller('couponCtrl', function($scope, $state, Coupons, CouponData, Settings, $timeout, $ionicLoading, $ionicHistory, $cordovaGeolocation, GeolocationService) {
 
 //Controller Properties
  $scope.coupons = [];
  $scope.premiumCoupons = [];  
  
  $scope.myLoc = Settings.location;
  $scope.gps = Settings.gps;
  $scope.listings = [];
  $scope.mypos = {};
     
  var posOptions = {timeout: 10000, enableHighAccuracy: false};


  //Initialize Controller on View enter
  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearHistory();
    $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            var lat  = position.coords.latitude
            var long = position.coords.longitude
            $scope.mypos = {
              lat,
              long
            }
            //console.log($scope.mypos);
            init();
          }, function(err) {
            // error
          });

    //$scope.updateCoupons();
  }); //end of view enter


  function init(){
        Coupons.getCoupons().then(function(coupons){
          
          var listings = [];
          var premiumListings = [];
          
          coupons.forEach(function(coupon){
                  coupon.locations.forEach(function(location){
                      var locDistance = calcDistance($scope.mypos.lat, $scope.mypos.long, location.loc.lat, location.loc.long, 'N');
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
                          location.img = coupon.img;
                      }else{
                          location.hasImage = false;
                          location.img = 'img/twlogo.png'
                      }
                      
                      if(coupon.category){
                          location.category = coupon.category;
                      }else{
                          location.category = 'General';
                      }                          
                      
                      //location.launch = "window.open('" + location.vendor_url + "', '_system', 'location=yes'); return false;"
                      
                      if(location.premium){
                        premiumListings.push(location);
                      }
                      
                      if(!location.premium){
                        listings.push(location);
                      }
                  });
          });
          
          $scope.coupons = listings;
          Settings.coupons = listings;
          $scope.premiumCoupons = premiumListings;
          Settings.premiumCoupons = premiumListings;
        });        
    }

  

  //Refresh Coupons
  $scope.refresh = init;
  
  
  //Set offer
  
 $scope.openOffer = function(offer){
   var data = CouponData;
   data.offer = offer;
   $state.go('details');
 }
  /*
  $scope.refresh = function(){
    $scope.$broadcast('scroll.refreshComplete');
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <p>Finding Deals...</p>'
    });

    //$scope.updateCoupons();
    init();
  }*/
  

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

  //Update Coupons
  /*
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
  }*/  
})
.controller('detailsCtrl', function($scope, $stateParams, Coupons, CouponData, Settings) {
    var Id = $stateParams.id;
    var data = CouponData;
    console.log(data.offer);
    $scope.offer = data.offer;
    
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
    };   

    
    
    $scope.addFavorite = function(offer){
      if(offer){
        Settings.favorites.push(offer);
      }
    }
})

.controller('favoritesCtrl', function($scope, $stateParams, Coupons, Settings, localStorageService) {
   $scope.favorites = Settings.favorites;
   
   $scope.settings = {
    gps: Settings.gps,
    listView: Settings.listView,
    radius: Settings.radius,
    location: Settings.location,
    favorites: Settings.favorites,
    coupons: Settings.coupons,
    premiums: Settings.premiums,
    offer: Settings.offer
  }

  $scope.$watch('settings', function(){
    Settings.gps = $scope.settings.gps;
    Settings.listView = $scope.settings.listView;
    Settings.radius = $scope.settings.radius;
    Settings.favorites = $scope.settings.favorites;
    Settings.coupons = $scope.settings.coupons;
    Settings.premiums = $scope.settings.premiums;
    Settings.offer = $scope.settings.offer;
    localStorageService.set('data', $scope.settings);
  }, true);
});

