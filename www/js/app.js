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
    gps: false,
    listView: true,
    radius: 25 ,
    filter: '',
    location: {lat:'21.3136151', long: '-157.84803639999998'}
})
.run(function($ionicPlatform, $rootScope, Settings, GeolocationService, $timeout, $ionicLoading) {
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
    /*
    var options = {
      timeout: 60000,
      maximumAge: 600000,
      enableHighAccuracy: true
    };

    
    GeolocationService.getCurrentPosition(options).then(
            function (position) {
              Settings.location = {
                  lat: position.coords.latitude,
                  long: position.coords.longitude
                  };
              Settings.gps = true;    

            },
            function() {
                console.log('Failed to load position');
                Settings.gps = false;
            }
      ); 
      */        
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
  
  .state('favorites', {
    url: "/favorites",
    templateUrl: "views/favorites.html",
  })
  
  .state('splash', {
    url: "/splash",
    templateUrl: "views/splash.html",
  }) 
  
  .state('app.main', {
    url: "/main",
    views: {
      'menuContent': {
        templateUrl: "views/main.html"
      }
    }
  })

  .state('app.main.all', {
    url: "/all",
    views: {
      'app-all': {
        templateUrl: "views/all.html",
        controller: 'couponCtrl'
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
  //$urlRouterProvider.otherwise('/app/main/all');
   $urlRouterProvider.otherwise('/splash');

})

;
