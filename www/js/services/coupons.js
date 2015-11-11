(function () {
    'use strict';
    
    angular.module('hawaiiqpon.coupon.service', [])
      .factory('Coupons', function($http) {
        var host = 'http://hawaiiqpon.lordconsulting.net';
        return {
          getCoupon: function(id) {
            return $http.get(host +'/api/coupons/'+id);
          },
          getCoupons: function(){
            return $http.get(host+'/api/coupons/all');
          }      
        };
      });
})();  