angular.module('hawaiiqpon.sidemenu.controller', [])
.controller('sideMenuCtrl', function($scope, $state, Settings, localStorageService) {

  $scope.settings = {
    gps: Settings.gps,
    listView: Settings.listView,
    radius: Settings.radius,
    location: Settings.location,
    favorites: Settings.favorites
  }

  $scope.$watch('settings', function(){
    Settings.gps = $scope.settings.gps;
    Settings.listView = $scope.settings.listView;
    Settings.radius = $scope.settings.radius;
    localStorageService.set('data', $scope.settings);
  }, true);
  
  $scope.showMap = function(){
    alert('Current location: ' + Settings.location.lat + ' , ' + Settings.location.long);
  }
  
  $scope.showFavorites = function(){

  }
});