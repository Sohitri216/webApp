'use strict';

/**
 * @memberof Modules.Account
 * @ngdoc factory
 * @name UserInfoFactory
 * @description
 *     It'll hold inter module comunication information.
 */
module.exports = [
    '$window',
    function($window) {
        var orderDetails = {},
            couponStatus;

        /**
         * @memberof UserInfoFactory
         * @method setData
         * @description 
         *     This function will store necessary information.
         * @param {object} obj Necessary Information regarding order. 
         */
        function setData(obj) {
            orderDetails = obj;
            $window.localStorage.setItem('TidiWebAppOrderDetails', JSON.stringify(orderDetails));
        }

        /**
         * @memberof TidiWebAppOrderDetails
         * @method getData
         * @description 
         *     This function will return necessary information.
         * @return {object} Returns Necessary Information regarding order. 
         */
        function getData() {
            // if (!Object.keys(orderDetails).length) {
            orderDetails = JSON.parse($window.localStorage.getItem('TidiWebAppOrderDetails')) || {};
            // }
            return orderDetails;
        }

        /**
         * @memberof TidiWebAppOrderDetails
         * @method resetData
         * @description 
         *     This function will reset orderDetails.
         */
        function resetData() {
            orderDetails = {};
            $window.localStorage.setItem('TidiWebAppOrderDetails', JSON.stringify(orderDetails));
        }

        function setCoupon(couponObj) {
            $window.localStorage.setItem('TidiWebAppCouponDetails', JSON.stringify(couponObj));
        }

        function getCoupon() {
            couponStatus = JSON.parse($window.localStorage.getItem('TidiWebAppCouponDetails')) || {};
            return couponStatus;
        }

        function resetCoupon() {
            couponStatus = {};
            $window.localStorage.setItem('TidiWebAppCouponDetails', JSON.stringify(couponStatus));

        }

        return {
            setData: setData,
            getData: getData,
            resetData: resetData,
            setCoupon: setCoupon,
            getCoupon: getCoupon,
            resetCoupon: resetCoupon
        };
    }
];