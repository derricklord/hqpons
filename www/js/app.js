angular.module('hawaiiqpon', [
  'ionic',
  'ngCordova',
  'uiGmapgoogle-maps',
  'LocalStorageModule',
  'hawaiiqpon.common.directives',
  'hawaiiqpon.common.filters',
  'hawaiiqpon.coupon.service',
  'hawaiiqpon.coupon.controller',
  'hawaiiqpon.details.controller',
  'hawaiiqpon.favorites.controller',
  'hawaiiqpon.sidemenu.controller',  
  'hawaiiqpon.geolocation'
])
.constant('_', 'window._')
.constant('apiURL', 'https://hawaiiqpon.lordconsulting.net/api/coupons/all')
.value('Settings', {
    radius: 25 ,
    location: {lat:'21.3136151', long: '-157.84803639999998'},
    favorites: [],
    coupons: [],
    offer:{}
})
.run(function($ionicPlatform, $rootScope, $cordovaSplashscreen ,Settings, localStorageService, $timeout, $ionicLoading) {
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
    
    var data = localStorageService.get('data');
    if(data){
      Settings.radius = data.radius;
      Settings.location = data.location;
      Settings.favorites =  data.favorites;
      Settings.coupons = data.coupons;
      Settings.offer = data.offer;
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
    abstract: true,
    views: {
      'menuContent': {
        templateUrl: "views/main.html",
        controller: 'mainCtrl'
      }
    }
  })


   .state('app.main.activities', {
    url: "/activities",
    views: {
      'app-activities': {
        templateUrl: "views/activities.html"
      }
    }
  }) 
  
  .state('app.main.all', {
    url: "/all",
    views: {
      'app-all': {
        templateUrl: "views/all.html"
      }
    }
  }) 

  .state('app.main.dining', {
    url: "/dining",
    views: {
      'app-dining': {
        templateUrl: "views/dining.html"
      }
    }
  })

  .state('app.main.shopping', {
    url: "/shopping",
    views: {
      'app-shopping': {
        templateUrl: "views/shopping.html"
      }
    }
  })

  .state('app.main.services', {
    url: "/services",
    views: {
      'app-services': {
        templateUrl: "views/services.html"
      }
    }
  })  
  
  .state('favorites', {
    url: "/favorites",
    templateUrl: "views/favorites.html",
    controller: "favoritesCtrl"
  })
  
  .state('splash', {
    url: "/splash",
    templateUrl: "views/splash.html",
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main/all');
   //$urlRouterProvider.otherwise('/splash');

})
;

