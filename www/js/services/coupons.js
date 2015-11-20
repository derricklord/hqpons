'use strict';
angular.module('hawaiiqpon.coupon.service', [])
    .service('Coupons', function($http, $q, Settings) {
        var HOST = 'https://hawaiiqpon.lordconsulting.net/api/coupons/all';
        var IMG = 'https://hawaiiqpon.lordconsulting.net/uploads';
        var cpnData = [];
        
        return{
            getCoupons: getCoupons,
            getCoupon: getCoupon,
            refreshCoupons: refreshCoupons
        }
        
        function getCoupons(){
          var url;
          var deferred = $q.defer();
          

          url = 'https://hawaiiqpon.lordconsulting.net/api/coupons/all';
          
          $http.get(url)
            .success(function(data){
              var coupons = data.coupons;
              deferred.resolve(coupons);
              cpnData = coupons;
            })
            .error(function(data, status){
              console.log(data);
              deferred.reject();
            });
            
            return deferred.promise;
        }


        function getCoupon(Id){
            for(var i=0; i<cpnData.length; i++){
                if(cpnData[i]._id == Id){
                    return cpnData[ i ];
                }
            }            
        }

        function refreshCoupons(){
            if(cpnData.length > 0){
                return cpnData;
            }
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
    }) 
    ;