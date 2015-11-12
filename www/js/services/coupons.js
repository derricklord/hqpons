(function () {
    'use strict';
    
    angular.module('hawaiiqpon.coupon.service', [])
      .factory('Coupons', function($http) {
        var host = 'http://hawaiiqpon.lordconsulting.net';
        var coupons = {coupons: []};
        var coupon = {coupon:{}};
        
        this.getCoupons = function(){
             return $http.get(host+'/api/coupons/all');
        }
        
        return this;
        
        /*
        return {
          getCoupon: function(id) {
            return $http.get(host +'/api/coupons/'+id);
          },
          getCoupons: function(){
            return $http.get(host+'/api/coupons/all');
          }
         
        };
        */
      })
      
      ;
})();  