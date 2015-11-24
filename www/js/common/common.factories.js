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
                
                
        });