angular.module('hawaiiqpon.details.controller', [])
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

});
