angular.module('hawaiiqpon', [
  'ionic',
  'ngCordova',
  'hawaiiqpon.common.directives',
  'hawaiiqpon.coupon.service',
  'hawaiiqpon.coupon.controller',
  'hawaiiqpon.views'
])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/side-menu.html"
  })

  .state('app.view1', {
    url: "/view1",
    views: {
      'menuContent': {
        templateUrl: "views/view-1.html",
        controller: 'couponCtrl'
      }
    }
  })

  .state('app.view2', {
    url: "/view2",
    views: {
      'menuContent': {
        templateUrl: "views/view-2.html"
      }
    }
  })

  .state('app.view3', {
    url: "/view3",
    views: {
      'menuContent': {
        templateUrl: "views/view-3.html"
      }
    }
  })

  .state('app.view4', {
    url: "/view4",
    views: {
      'menuContent': {
        templateUrl: "views/view-4.html"
      }
    }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/view1');
})

;
