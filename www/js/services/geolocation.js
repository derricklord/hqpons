'use strict';
angular.module('hawaiiqpon.geolocation', [])

.service('GeolocationService', function($q, $log, $ionicPlatform, $http, $cordovaGeolocation) {
  var fallbackPositionObject = {
    latitude: '33.987873',
    longitude: '-118.470719',
    accuracy: 0
  };

    this.getCurrentPosition = function (options) {
        var defer = $q.defer();
        options = options || {
          timeout: 10000,
          maximumAge: 0,
          enableHighAccuracy: false
        };

        $ionicPlatform.ready(function () {
            $cordovaGeolocation
                .getCurrentPosition(options)
                .then(
                    function (position) {
                        //$log.debug('Got geolocation');
                        defer.resolve(position);
                    },
                    function (locationError) {

                        //$log.debug('Did not get geolocation');

                        defer.reject({
                            code: locationError.code,
                            message: locationError.message,
                            coords: fallbackPositionObject
                        });
                    }
                );
        });

        return defer.promise;
    };

    /**
     * Convert any address to a latitude/longitude object.
     * @param strAddress The address as a string, e.g. 'Willemstad, Curaçao'
     * @returns {*}
     */
    this.addressToPosition = function (strAddress) {
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + strAddress + '&sensor=false')
            .then(
                function (result) {
                    var location = result.data.results[0].geometry.location;

                    // Transforming the 'location.lat' and 'location.lng' object to 'location.latitude' to be
                    // compatible with other location responses like in getCurrentPosition
                    return {
                        latitude: location.lat,
                        longitude: location.lng
                    };
                },
                function (reason) {
                    return $q.reject(reason);
                }
            );
    };

    this.getDefaultPosition = function () {
        return fallbackPositionObject;
    };
    
   this.calcDistance =  function (lat1, lon1, lat2, lon2, unit) {
          var radlat1 = Math.PI * lat1/180;
          var radlat2 = Math.PI * lat2/180;
          var radlon1 = Math.PI * lon1/180;
          var radlon2 = Math.PI * lon2/180;
          var theta = lon1-lon2;
          var radtheta = Math.PI * theta/180;
          var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          dist = Math.acos(dist);
          dist = dist * 180/Math.PI;
          dist = dist * 60 * 1.1515;
          if (unit=="K") { dist = dist * 1.609344 };
          if (unit=="N") { dist = dist * 0.8684 };
          return Math.round(dist*100)/100;
  }     

    return this;
});