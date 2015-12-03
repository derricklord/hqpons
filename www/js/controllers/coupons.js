angular.module('hawaiiqpon.coupon.controller', [])
.controller('mainCtrl', function($scope, $state, $timeout, Coupons, GeolocationService, Settings, uiGmapGoogleMapApi, $ionicModal, $ionicSlideBoxDelegate, $ionicListDelegate, $ionicLoading){
  $scope.allCoupons = [];
  $scope.coupons = [];
  $scope.premiumCoupons = []; 
  $scope.addFavorite = addFavorite;
  $scope.refresh = refresh;

  
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
      options: { draggable: false, icon: 'img/pin.png' }
    };   
    uiGmapGoogleMapApi.then(function(maps) {
      $scope.modal.show();
      $timeout( function() {
        $ionicSlideBoxDelegate.update();
      }); 
    });
  };
  
  
  $scope.closeOffer = function() {
    $scope.modal.hide();
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
  
  
  $ionicLoading.show({
    template: 'Loading Data...'
  });
  
  
  //Get Location and Retrieve Coupons
  function load(){
    GeolocationService.getCurrentPosition().then(
      function(position) {     
        $scope.map = { center: { latitude: position.coords.latitude , longitude: position.coords.longitude }, zoom: 15 };
        $scope.marker = {
          id: 0,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          options: { draggable: false, icon: 'img/pin.png' }
        };
        
        Coupons.getCoupons().then(function(coupons){
            var cpns = [];
            
            coupons.forEach(function(coupon){
                var distance = GeolocationService.calcDistance( position.coords.latitude,position.coords.longitude, coupon.loc.lat, coupon.loc.long, 'N');
                coupon.distance = distance;
                if(coupon.distance <= Settings.radius){
                  cpns.push(coupon);
                }
                
                /*
                if(coupon.distance <= Settings.radius && !coupon.premium){
                  cpns.push(coupon);
                }
                
                if(coupon.distance <= Settings.radius && coupon.premium){
                  premiums.push(coupon);
                }
                */
            });
  
            Settings.coupons = coupons;
            Settings.location = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            }
            
            $scope.allCoupons = coupons;
            $scope.coupons = cpns;
            //$scope.premiumCoupons = cpns; 
            //console.log($scope.allCoupons);
                  
        });
        $ionicLoading.hide();
    },function(error){
       console.log(error);
      $ionicLoading.show({
        template: 'Unable to retrieve Data: ' + error.message
      });
    });    
  }

   
    //Refresh coupons
    function refresh(){
      $ionicLoading.show({
        template: 'Finding Deals...'
      });
  
      $scope.coupons = [];

      $scope.allCoupons.forEach(function(location){
        if(location.distance <= Settings.radius){
          $scope.coupons.push(location);
        }       
      });

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    }
  
    //Add Favorite 
    function addFavorite(offer){
      if(offer){
        if(Settings.favorites.indexOf(offer) === -1){
          Settings.favorites.push(offer);  
           $ionicLoading.show({
            template: 'Favorite added...',
            duration: 1000
          });          
        }else{
          //console.log("Already present");
          $ionicLoading.show({
            template: 'Already in favorites...',
            duration: 1000
          });         
        }
        $ionicListDelegate.closeOptionButtons();
        $scope.modal.hide();
      }
    }   
          
   load();
});

