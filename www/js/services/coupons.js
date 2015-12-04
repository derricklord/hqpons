'use strict';
angular.module('hawaiiqpon.coupon.service', [])
    .service('Coupons', function($http, $q, Settings, localStorageService, apiURL) {
        var cpnData = { currentCoupons: [] };
              
        this.getModel = function () {
            return cpnData.currentCoupons;
        };
        
        this.getCoupons = function(){
          var deferred = $q.defer();

          $http.get(apiURL)
            .success(function(data){
              var coupons = cleanData(data);
              deferred.resolve(coupons);
              cpnData.currentCoupons = coupons;
              Settings.coupons = coupons;
            })
            .error(function(data, status){
              console.log(data);
              deferred.reject();
            });
            
            return deferred.promise;
        }


        this.refreshCoupons = function(){
            if(cpnData.currentCoupons.length > 0){
                return cpnData.currentCoupons;
            }
        }
 
        
        function cleanData(data){
                var coupons = data.coupons;
                var flatData = [];
                
                coupons.forEach(function(coupon){
                    coupon.locations.forEach(function(location){
                        location.distance = 0;
                        location.desc = coupon.desc;
                        location.desc2 = coupon.desc2;
                        location.expiration = coupon.expiration;
                        location.owner = coupon.owner;
                        location.premium = coupon.premium;
                        location.title = coupon.title;
                        location.vendor = coupon.vendor;
                        location.vendor_url = coupon.vendor_url;
                        location.vendor_phone = coupon.vendor_phone;
                        location.promo_code = coupon.promo_code;
                        
                        if(coupon.img){
                            location.hasImage = true;
                            location.img = coupon.img;
                        }else{
                            location.hasImage = false;
                            location.img = 'logo.png';
                        }
                        
                        if(coupon.category){
                            location.category = coupon.category;
                        }else{
                            location.category = 'General';
                        }
                                            
                        flatData.push(location);
                    });       
                });  
                return flatData;
        }             
        
        return this;       
    });