angular.module('hawaiiqpon.common.factories', [])
        .factory('CouponData', function () {
                var allCoupons = {
                   coupons: [],
                   premiums: [],
                   offer: {},
                   setOffer: setOffer,
                   getOffer: getOffer,
                   clearOffer: clearOffer,
                   setCoupons: setCoupons,
                   getCoupons: getCoupons
                };

                return allCoupons;
                
                function setOffer(offer){
                        //console.log('Factory Offer Setting..');
                        //console.log(offer);
                        allCoupons.offer = offer;
                }
                
                function getOffer(){
                        return allCoupons.offer;
                }
                
                function clearOffer(){
                        allCoupons.offer = {};
                }
                
                function setCoupons(coupons, premiums){
                     if(coupons){
                        coupons.forEach(function(coupon){
                                allCoupons.coupons.push(coupon);
                        });                             
                     }
                     
                     if(premiums){
                         premiums.forEach(function(coupon){
                                allCoupons.premiums.push(coupon);
                        });                            
                     }
                        
                }
                
                function getCoupons(){
                        return {
                                coupons: allCoupons.coupons,
                                premiums: allCoupons.premiums
                        }
                }
                
                
        })
        .factory('ConnectivityMonitor', function($rootScope, $ionicLoading, $cordovaNetwork){
        
        return {
        isOnline: function(){
        if(ionic.Platform.isWebView()){
                return $cordovaNetwork.isOnline();    
        } else {
                return navigator.onLine;
        }
        },
        isOffline: function(){
        if(ionic.Platform.isWebView()){
                return !$cordovaNetwork.isOnline();    
        } else {
                return !navigator.onLine;
        }
        },
        startWatching: function(){
                if(ionic.Platform.isWebView()){
        
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                console.log("went online");
                $ionicLoading.hide();
                });
        
                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                console.log("went offline");
                $ionicLoading.show({
                        template: 'Waiting for Internet Connection...'
                });
                });
        
                }
                else {
        
                window.addEventListener("online", function(e) {
                console.log("went online");
                $ionicLoading.hide();
                }, false);    
        
                window.addEventListener("offline", function(e) {
                console.log("went offline");
                }, false);  
                $ionicLoading.show({
                        template: 'Waiting for Internet Connection...'
                });
                }       
        }
        }
        })        
        ;