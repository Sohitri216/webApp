'use strict';

module.exports = [
    '$scope',
    '$state',
    '$rootScope',
    'OrderDetails',
    'PublicService',
    function($scope, $state, $rootScope, OrderDetails, PublicService) {


        $scope.init = function() {
            $rootScope.heightWrap = true;
            $rootScope.controlBackgroundImage = false;
            $rootScope.largeScreen = false;
            $rootScope.padScreen = false;
            $rootScope.abstractViewFullWidth = true;
            $scope.roomOptions = ['1', '2', '3', '4', '5+'];
            $scope.bedRoomCount = $scope.roomOptions[0];
            $scope.bathRoomCount = $scope.roomOptions[0];
            OrderDetails.resetData();
            OrderDetails.resetCoupon();
        };

        //redirects to the next view and update the factory
        $scope.submitData = function() {
            console.log('in submitData', $scope.bedRoomCount, $scope.bathRoomCount);
            // OrderDetails.setData({
            //   bedroom: $scope.bedRoomCount,
            //   bathroom: $scope.bathRoomCount
            // });
            PublicService.getPrice({
                    bedroom: $scope.bedRoomCount,
                    bathroom: $scope.bathRoomCount,
                    servicetype: 'Full'
                })
                .then(function(response) {
                    if (response.success) {
                        var data = response.data[0];
                        console.log('in response', data);
                        data.bedroom = $scope.bedRoomCount;
                        data.bathroom = $scope.bathRoomCount;
                        data.price = data.daily_price; // jshint ignore:line
                        OrderDetails.setData(data);
                        $state.go('home.orderDetails.roomDetails');
                    }
                });
        };
    }
];