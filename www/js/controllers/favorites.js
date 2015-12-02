angular.module('hawaiiqpon.favorites.controller', [])
.controller('favoritesCtrl', function($scope, $stateParams, Coupons, Settings, localStorageService, $ionicModal, $ionicListDelegate) {
   $scope.favorites = Settings.favorites;
   
   $scope.removeFavorite = function(index){
     $scope.favorites.splice(index, 1);
     $ionicListDelegate.closeOptionButtons();
     $scope.modal.hide();
   }
   
   $scope.settings = {
    radius: Settings.radius,
    location: Settings.location,
    favorites: Settings.favorites,
    coupons: Settings.coupons,
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
  $ionicModal.fromTemplateUrl('views/coupon-offer-favorite.html', {
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