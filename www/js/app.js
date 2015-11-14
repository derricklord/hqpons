angular.module('hawaiiqpon', [
  'ionic',
  'ngCordova',
  'hawaiiqpon.common.directives',
  'hawaiiqpon.coupon.service',
  'hawaiiqpon.coupon.controller',
  'hawaiiqpon.sidemenu.controller',  
  'hawaiiqpon.geolocation',
  'hawaiiqpon.views'
])
.constant('_', 'window._')
.value('Settings', {
    gps: true,
    listView: true,
    radius: 25  
})
.run(function($ionicPlatform, $rootScope) {
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
    $rootScope._ = _;
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/side-menu.html",
    controller: "sideMenuCtrl"
  })

  .state('app.main', {
    url: "/main",
    views: {
      'menuContent': {
        templateUrl: "views/main.html"
      }
    }
  })
  
   .state('app.main.activities', {
    url: "/activities",
    views: {
      'app-activities': {
        templateUrl: "views/activities.html",
        controller: 'couponCtrl'
      }
    }
  }) 

  .state('app.main.dining', {
    url: "/dining",
    views: {
      'app-dining': {
        templateUrl: "views/dining.html",
        controller: 'couponCtrl'
      }
    }
  })


  
  .state('app.main.shopping', {
    url: "/shopping",
    views: {
      'app-shopping': {
        templateUrl: "views/shopping.html",
        controller: 'couponCtrl'
      }
    }
  })

  .state('app.main.services', {
    url: "/services",
    views: {
      'app-services': {
        templateUrl: "views/services.html",
        controller: 'couponCtrl'
      }
    }
  })

  .state('app.main.favorites', {
    url: "/favorites",
    views: {
      'app-favorites': {
        templateUrl: "views/favorites.html"
      }
    }
  })
  
  .state('app.main.details', {
    url: '/details/:couponId',
    views: {
      'app-offer': {
        templateUrl: 'views/details.html'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
})

;
