'use strict';
angular.module('hawaiiqpon.coupon.service', [])
    .service('Coupons', function($http, $q, Settings) {
        var HOST = 'https://hawaiiqpon.lordconsulting.net/api/coupons/all';
        var IMG = 'https://hawaiiqpon.lordconsulting.net/uploads';
        var cpnData = [];
        
        return{
            getCoupons: getCoupons,
            getCoupon: getCoupon,
            refreshCoupons: refreshCoupons,
        }
        
        function cleanData(data, myLoc){
            var coupons = [];
            try{
                data = data.coupons;
                data.forEach(function(coupon){
                    coupon.locations.forEach(function(location){
                        var locDistance = calcDistance(myLoc.lat, myLoc.long, location.loc.lat, location.loc.long, 'N');
                        location.distance = locDistance;
                        
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
                            location.img = 'img/twlogo.png'
                        }
                        
                        location.launch = "window.open('" + location.vendor_url + "', '_system', 'location=yes'); return false;"
                        
                        if(coupon.category){
                            location.category = coupon.category;
                            location.icon = '/img/markers/' + coupon.category + '.png';
                        }else{
                            location.category = 'General';
                            location.icon = '/img/markers/General.png';
                        }                     
                        coupons.push(location);             
                    });
                });               
                        
            }catch(ex){    
            }
            return coupons;
        }
        
        function calcDistance(lat1, lon1, lat2, lon2, unit) {
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
        
        
        function getCoupons(location){
            var deferred = $q.defer();
            
            $http.get(HOST)
                .success(function(data){
                    var nearby = [];
                    var coupons = cleanData(data, location);
                    
                    cpnData = coupons;
                    cpnData.forEach(function(c){
                        if(c.distance <= Settings.radius){
                            nearby.push(c);
                        }                         
                    });
                    //console.log(nearby);
                    deferred.resolve(nearby);
                })
                .error(function(){
                    deferred.reject();
                });
             return deferred.promise;
        }
        
        function refreshCoupons(){
            if(cpnData.length > 0){
                return cpnData;
            }
        }
        
        function getCoupon(Id){
            for(var i=0; i<cpnData.length; i++){
                if(cpnData[i]._id == Id){
                    return cpnData[ i ];
                }
            }            
        }

    });