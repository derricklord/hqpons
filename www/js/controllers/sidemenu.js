angular.module('hawaiiqpon.sidemenu.controller', [])
.controller('sideMenuCtrl', function($scope, Settings) {

  $scope.settings = {
    gps: true,
    listView: true,
    radius: 25
  }

  $scope.$watch('settings', function(){
    Settings.gps = $scope.settings.gps;
    Settings.listView = $scope.settings.listView;
    Settings.radius = $scope.settings.radius;
  }, true);
  
  $scope.showMap = function(){
    alert("Showing Map");
  }
});