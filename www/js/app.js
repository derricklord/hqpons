angular.module('hawaiiqpon', [
  'ionic',
  'ngCordova',
  'hawaiiqpon.common.directives',
  'hawaiiqpon.coupon.service',
  'hawaiiqpon.coupon.controller',
  'hawaiiqpon.geolocation',
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
      'tab-chats': {
        templateUrl: 'templates/details.html',
        controller: 'couponCtrl'
      }
    }
  })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
})

;
