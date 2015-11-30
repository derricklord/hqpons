'use strict';
angular.module('hawaiiqpon.coupon.service', [])
    .service('Coupons', function($http, $q, Settings, GeolocationService, localStorageService, apiURL) {
       // var HOST = 'https://hawaiiqpon.lordconsulting.net/api/coupons/all';
        var IMG = 'https://hawaiiqpon.lordconsulting.net/uploads';
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


        this.getCoupon = function(Id){
           
        }

        this.refreshCoupons = function(){
            if(cpnData.currentCoupons.length > 0){
                return cpnData.currentCoupons;
            }
        }
        
        this.cleanData = function(data){
            var coupons = data;
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
        
        this.calcDistance = function(lat1, lon1, lat2, lon2, unit) {
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
        
         var cleanData = function(data){
                    var coupons = data.coupons;
                    //console.log(data.coupons);
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
                            //console.log(location);
                        });       
                    }); 
                    //console.log(flatData);  
                    return flatData;
                    
         }
        
        
        return this;       
    });