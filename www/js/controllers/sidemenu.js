angular.module('hawaiiqpon.sidemenu.controller', [])
.controller('sideMenuCtrl', function($scope, $state, Settings) {

  $scope.settings = {
    gps: Settings.gps,
    listView: Settings.listView,
    radius: Settings.radius,
    location: Settings.location
  }

  $scope.$watch('settings', function(){
    Settings.gps = $scope.settings.gps;
    Settings.listView = $scope.settings.listView;
    Settings.radius = $scope.settings.radius;
  }, true);
  
  $scope.showMap = function(){
    alert('Current location: ' + Settings.location.lat + ' , ' + Settings.location.long);
  }
  
  $scope.showFavorites = function(){

  }
});