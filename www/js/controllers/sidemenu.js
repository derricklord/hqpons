angular.module('hawaiiqpon.sidemenu.controller', [])
.controller('sideMenuCtrl', function($scope, $state, Settings, localStorageService) {

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
  
});