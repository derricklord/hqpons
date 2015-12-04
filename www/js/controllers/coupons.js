angular.module('hawaiiqpon.coupon.controller', [])
.controller('mainCtrl', function($scope, $state, $timeout, Coupons, GeolocationService, Settings, localStorageService, $ionicModal, $ionicSlideBoxDelegate, $ionicListDelegate, $ionicLoading){
  $scope.allCoupons = [];
  $scope.coupons = [];
  $scope.offer = {};


  $scope.settings = {
    radius: Settings.radius,
    location: Settings.location,
    favorites: Settings.favorites
  }

  $scope.$watch('settings', function(){
    Settings.radius = $scope.settings.radius;
    Settings.location = $scope.settings.location;
    Settings.favorites = $scope.settings.favorites;
    localStorageService.set('data', $scope.settings);
  }, true);


  $scope.options = {
    width: 2,
    height: 100,
    quite: 10,
    displayValue: true,
    font: "monospace",
    textAlign: "center",
    fontSize: 12,
    backgroundColor: "",
    lineColor: "#000"
  };

  $scope.addFavorite = addFavorite;
  $scope.refresh = refresh;

  $ionicLoading.show({
    template: 'Loading Data...'
  });

  
  //Setup Offers Modal Window
  $ionicModal.fromTemplateUrl('views/coupon-offer.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal; 
  });  
  
  $scope.launch = function(url){
        window.open(url, '_system', 'location=yes'); 
        return false;
  };
  
  //Open Offer Modal
  $scope.openOffer = function(coupon) {
    $scope.offer = coupon;
    $scope.modal.show();       
  };
  
  //Close Offer Modal
  $scope.closeOffer = function() {
    $scope.modal.hide();
  };       

   //Modal Events

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  
  //Refresh modal after show
  $scope.$on('modal.shown', function() {
    $scope.marker = {
      id: 0,
      coords: {
        latitude: $scope.offer.loc.lat,
        longitude: $scope.offer.loc.long
      },
      options: { draggable: false, icon: 'img/pin.png' }
    };
    $scope.map = { center: { latitude: $scope.offer.loc.lat , longitude: $scope.offer.loc.long }, zoom: 15 };
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
            });
  
            Settings.coupons = coupons;
            Settings.location = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            }
            
            $scope.allCoupons = coupons;
            $scope.coupons = cpns;
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
    function reload(){
      $scope.coupons = [];

      $scope.allCoupons.forEach(function(location){
        if(location.distance <= Settings.radius){
          $scope.coupons.push(location);
        }       
      });

      $scope.$broadcast('scroll.refreshComplete');
    }
  
    //Reload with Location
    function refresh(){
        GeolocationService.getCurrentPosition().then(
          function(position) {   
            $scope.coupons = [];  
            $scope.map = { center: { latitude: position.coords.latitude , longitude: position.coords.longitude }, zoom: 15 };
            $scope.marker = {
              id: 0,
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              options: { draggable: false, icon: 'img/pin.png' }
            };
           
      
            $scope.allCoupons.forEach(function(location){
              var distance = GeolocationService.calcDistance( position.coords.latitude,position.coords.longitude, location.loc.lat, location.loc.long, 'N');
              location.distance = distance;              
              if(location.distance <= Settings.radius){
                $scope.coupons.push(location);
              }       
            });    
            Settings.coupons = $scope.coupons;
            Settings.location = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            }           
            
            $scope.$broadcast('scroll.refreshComplete');       

        },function(error){
          $ionicLoading.show({
            template: 'Unable to retrieve Data: ' + error.message
          });
        });        
    }    
    
    //Add Favorite 
    function addFavorite(offer){
      if(offer){
        if(Settings.favorites.indexOf(offer) === -1){
          Settings.favorites.push(offer);  
           $ionicLoading.show({
            template: 'Favorite added...',
            duration: 500
          });          
        }else{
          $ionicLoading.show({
            template: 'Already in favorites...',
            duration: 500
          });         
        }
        $ionicListDelegate.closeOptionButtons();
        $scope.modal.hide();
      }
    }      
          
   load();
});

