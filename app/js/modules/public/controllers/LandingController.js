'use strict';

function LandingController($scope, $state, $rootScope, API, PublicService, $window) {
    var vm = this;
    $rootScope.heightWrap = true;
    $rootScope.controlBackgroundImage = false;
    vm.init = function() {
        // if ($window.localStorage.bookDetails) {
        //     delete $window.localStorage.bookDetails;
        // }
        // if ($window.localStorage.selectedDate) {
        //     delete $window.localStorage.selectedDate;
        // }
        // if ($window.localStorage.selectedSlot) {
        //     delete $window.localStorage.selectedSlot;
        // }
        // if ($window.localStorage.setPrice) {
        //     delete $window.localStorage.setPrice;
        // }
        // if ($window.localStorage.priceWithAddOn) {
        //     delete $window.localStorage.priceWithAddOn;
        // }
        // if ($window.localStorage.setPrice) {
        //     delete $window.localStorage.setPrice;
        // }
        // if($window.localStorage.rentalType){
        //     delete $window.localStorage.rentalType
        // }
        $window.localStorage.clear();

        PublicService.getBasicServiceConfig()
            .then(function(res) {
                console.log('Response:', res);
                if (res.data) {
                    $scope.basicConfig = res.data;
                    $window.localStorage.basicConfig = JSON.stringify(res.data);
                } else {
                    console.log('No data');
                }
            }, function(err) {
                console.log('Err:', err);
            });
        vm.bookingInfo = {};
        $rootScope.customerdetails = {};
        vm.filterTypeBedroom = [
            '1 Bedroom',
            '2 Bedroom',
            '3 Bedroom',
            '4 Bedroom',
            '5+ Bedroom'
        ];
        vm.filterTypeBathroom = [
            '1 Bathroom',
            '2 Bathroom',
            '3 Bathroom',
            '4 Bathroom',
            '5+ Bathroom'
        ];

        vm.filterListBathroom = vm.filterTypeBathroom[0];
        vm.filterListBedroom = vm.filterTypeBedroom[0];
        vm.bookingInfo.bedroom = vm.filterListBedroom;
        vm.bookingInfo.bathroom = vm.filterListBathroom;
    };

    vm.changeRoom = function() {
        console.log('in change:', vm.bookingInfo, vm.filterListBedroom);
        vm.bookingInfo.bedroom = vm.filterListBedroom;
        vm.bookingInfo.bathroom = vm.filterListBathroom;

    };

    vm.bookingProperty = function() {
        vm.bookingInfo.bedroom = vm.bookingInfo.bedroom.split(' ')[0];
        vm.bookingInfo.bathroom = vm.bookingInfo.bathroom.split(' ')[0];
        $rootScope.customerdetails.bedCount = vm.bookingInfo.bedroom;
        $rootScope.customerdetails.bathCount = vm.bookingInfo.bathroom;
        console.log('In booking info:', $rootScope.customerdetails);
        angular.forEach($scope.basicConfig, function(val) {
            if (val.bathroom_count == vm.bookingInfo.bathroom && val.bedroom_count == vm.bookingInfo.bedroom) { // jshint ignore:line
                if (val.id && val.daily_price) { // jshint ignore:line
                    $scope.serviceId = val.id;
                    $scope.price = val.daily_price; // jshint ignore:line
                    $window.localStorage.bookDetails = JSON.stringify({ service_id: val.id }); // jshint ignore:line
                }

            }
        });
        $rootScope.customerdetails.price = $scope.price;
        console.log($scope.serviceId, $scope.price);
        $state.go('home.house-details.room-details', { 'bedCount': vm.bookingInfo.bedroom, 'bathCount': vm.bookingInfo.bathroom, 'price': $scope.price });
    };
}
LandingController.$inject = ['$scope', '$state', '$rootScope', 'API', 'PublicService', '$window'];
module.exports = LandingController;
