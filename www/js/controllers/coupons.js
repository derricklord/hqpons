angular.module('hawaiiqpon.coupon.controller', [])
.controller('mainCtrl', function($scope, $state, $timeout, Coupons, GeolocationService, Settings,  $ionicModal,  $ionicListDelegate, $ionicLoading){
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
    $scope.modal.show();
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
        Coupons.getCoupons().then(function(coupons){
            var cpns = [];
            var premiums = [];
            coupons.forEach(function(coupon){
                var distance = GeolocationService.calcDistance( position.coords.latitude,position.coords.longitude, coupon.loc.lat, coupon.loc.long, 'N');
                coupon.distance = distance;
                
                if(coupon.distance <= Settings.radius && !coupon.premium){
                  cpns.push(coupon);
                }
                
                if(coupon.distance <= Settings.radius && coupon.premium){
                  premiums.push(coupon);
                }
            });
  
            Settings.coupons = coupons;
            Settings.location = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            }
            
            $scope.allCoupons = coupons;
            $scope.coupons = cpns;
            $scope.premiumCoupons = premiums;       
        });
        $ionicLoading.hide();
    });    
  }

   
    //Refresh coupons
    function refresh(){
      $ionicLoading.show({
        template: 'Finding Deals...'
      });
  
      $scope.coupons = [];
      $scope.premiumCoupons = [];


      $scope.allCoupons.forEach(function(location){
        if(location.premium && location.distance <= Settings.radius){
          $scope.premiumCoupons.push(location);
        }
        
        if(!location.premium && location.distance <= Settings.radius){
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
          $ionicListDelegate.closeOptionButtons();       
        }else{
          console.log("Already present");
          $ionicListDelegate.closeOptionButtons();
        }
      }
    }   
          
   load();
});

