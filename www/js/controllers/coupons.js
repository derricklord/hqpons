angular.module('hawaiiqpon.coupon.controller', [])
.controller('couponCtrl', function($scope, $state, Coupons, CouponData, Settings, $ionicModal, $timeout, $ionicListDelegate, $ionicLoading, $ionicHistory, $cordovaGeolocation) {
 
 //Controller Properties
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $scope.allCoupons = [];
  $scope.coupons = [];
  $scope.premiumCoupons = [];  
  
  $scope.myLoc = Settings.location;
  $scope.gps = Settings.gps;
  $scope.listings = [];
  $scope.mypos = {};
  $scope.couponpos = {};
  
    //Show Loading Message
  $ionicLoading.show({
    template: 'Finding Deals...'
  });
  
    //Setup Offers Modal Window
  $ionicModal.fromTemplateUrl('views/coupon-offer.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal; 
  });  
     
  


  //Initialize Controller on View enter
  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearHistory();
    if(!Settings.location){
      $scope.refresh();
    }else{
      setLocation();
    }

  }); //end of view enter


  function setLocation(){
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            var lat  = position.coords.latitude
            var long = position.coords.longitude
       
            Settings.location = {
              lat: lat,
              long: long
            }  
            
            $scope.mypos = {
              lat: lat,
              long: long
            }
            
            $scope.couponpos = {
              lat: lat,
              long: long
            }
            
            $scope.windowOptions = {
                visible: true
            };
            
            $scope.map = { center: { latitude: $scope.couponpos.lat , longitude: $scope.couponpos.long }, zoom: 15 };
            
          
            $scope.marker = {
              id: 0,
              coords: {
                latitude: $scope.couponpos.lat,
                longitude: $scope.couponpos.long
              },
              options: { draggable: false, icon: 'img/marker.png' }
            };            

            init();
            
          }, function(err) {
            // error
            console.log(err);
          });
  }

  function init(){
        
          Coupons.getCoupons().then(function(coupons){
            
            var listings = [];
            var premiumListings = [];
            var all = [];
            
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
                            location.img = 'logo.png';
                        }
                        
                        if(coupon.category){
                            location.category = coupon.category;
                        }else{
                            location.category = 'General';
                        }                          
                        
                        //location.launch = "window.open('" + location.vendor_url + "', '_system', 'location=yes'); return false;"
                        
                        if(location.premium && location.distance <= Settings.radius){
                          premiumListings.push(location);
                        }
                        
                        if(!location.premium && location.distance <= Settings.radius){
                          listings.push(location);
                        }
                        
                        all.push(location);
                    });
            });
            
            $scope.coupons = listings;
            $scope.premiumCoupons = premiumListings;
            $scope.allCoupons = all;
            Settings.coupons = all;
          });  
          $ionicLoading.hide();
    }

  //Refresh coupons
  $scope.refresh = function(){
    //init();
    $scope.coupons = [];
    $scope.premiumCoupons = [];
    
    if($scope.allCoupons){
      $scope.allCoupons.forEach(function(location){
        if(location.premium && location.distance <= Settings.radius){
          $scope.premiumCoupons.push(location);
        }
        
        if(!location.premium && location.distance <= Settings.radius){
          $scope.coupons.push(location);
        }         
      });
    }else{
      init();
    }
    
    $scope.$broadcast('scroll.refreshComplete');
  }
  
/*
  $scope.refresh = function(){
    $scope.$broadcast('scroll.refreshComplete');
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <p>Finding Deals...</p>'
    });
    init();
  }
 */ 
  $scope.addFavorite = function(offer){
    if(offer){
      if(Settings.favorites.indexOf(offer) === -1){
        Settings.favorites.push(offer);
        $ionicListDelegate.closeOptionButtons();       
      }else{
        console.log("Already present");
        $ionicListDelegate.closeOptionButtons();
      }
    }
  }

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

   $scope.openOffer = function(coupon) {
      $scope.offer = coupon;
      $scope.map = { center: { latitude: coupon.loc.lat , longitude: coupon.loc.long }, zoom: 15 };
    
 
      $scope.marker = {
        id: 0,
        coords: {
          latitude: coupon.loc.lat,
          longitude: coupon.loc.long
        },
        options: { draggable: false, icon: 'img/marker.png' }
      };       

      $scope.modal.show();
    };
    
    
    $scope.closeOffer = function() {
      $scope.modal.hide();
    };
    
    $scope.launch = function(url){
        window.open(url, '_system', 'location=yes'); 
        return false;
    };
    
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

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
.controller('detailsCtrl', function($scope, $stateParams, $state, Coupons, CouponData, Settings) {
    var Id = $stateParams.id;
    $scope.offer = CouponData.getOffer();
    console.log($scope.offer);
    
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


    $scope.closeOffer = function(){
      CouponData.clearOffer();
      $state.go('app.main');
    }

})

.controller('favoritesCtrl', function($scope, $stateParams, Coupons, Settings, localStorageService, $ionicModal, $ionicListDelegate) {
   $scope.favorites = Settings.favorites;
   
   $scope.removeFavorite = function(index){
     $scope.favorites.splice(index, 1);
     $ionicListDelegate.closeOptionButtons();
   }
   
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
  
  //Setup Offers Modal Window
  $ionicModal.fromTemplateUrl('views/coupon-offer.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal; 
  }); 
  
  $scope.openOffer = function(coupon) {
      $scope.offer = coupon;
      $scope.map = { center: { latitude: coupon.loc.lat , longitude: coupon.loc.long }, zoom: 15 };
    
 
      $scope.marker = {
        id: 0,
        coords: {
          latitude: coupon.loc.lat,
          longitude: coupon.loc.long
        },
        options: { draggable: false, icon: 'img/marker.png' }
      };       
      
      $scope.modal.show();
    };
    
    
    $scope.closeOffer = function() {
      $scope.modal.hide();
    };
});

