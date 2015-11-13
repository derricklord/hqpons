'use strict';

angular.module('hawaiiqpon.coupon.service', [])
    .factory('Coupons', function($http, $q) {
        var host = 'http://hawaiiqpon.lordconsulting.net';
        var coupons = {coupons: []};
        
        this.getCoupons = function(){
                return $http.get(host+'/api/coupons/all');
        }
        
        this.getData = function(filter){
            var defer = $q.defer();
            
            $http.get(host+'/api/coupons/all')
            .success(function(data){
                return defer.resolve(data);

            })
            .error(function(error){
               return defer.reject(error);
            });
        }
        
        return this;
    });
