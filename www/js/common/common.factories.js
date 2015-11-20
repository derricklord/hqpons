angular.module('hawaiiqpon.common.factories', [])
        .factory('CouponData', function () {
                var allCoupons = {};
                allCoupons.coupons = [];
                allCoupons.premiums = [];
                allCoupons.offer = {};
                return allCoupons;
        });