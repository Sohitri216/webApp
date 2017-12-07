'use strict';

function RoomController($scope, $rootScope, $state, $window, $stateParams) {
    $rootScope.heightWrap = true;
    $rootScope.controlBackgroundImage = false;
    console.log('stateParams', $stateParams, $rootScope.customerdetails);
    $rootScope.customerdetails.bedCount = $stateParams.bedCount;
    $rootScope.customerdetails.bathCount = $stateParams.bathCount;
    $rootScope.customerdetails.price = $stateParams.price;
    $scope.init = function() {
        // var vm = this;
        $scope.basicServiceConfig = JSON.parse($window.localStorage.basicConfig);
        console.log('basic config:', $scope.basicServiceConfig);
        $scope.bedrooms = [{
            value: '1',
            selected: false
        }, {
            value: '2',
            selected: false
        }, {
            value: '3',
            selected: false
        }, {
            value: '4',
            selected: false
        }, {
            value: '5+',
            selected: false
        }];

        $scope.bathrooms = [{
            value: '1',
            selected: false
        }, {
            value: '2',
            selected: false
        }, {
            value: '3',
            selected: false
        }, {
            value: '4',
            selected: false
        }, {
            value: '5+',
            selected: false
        }];

        $scope.roomCount = {
            bedCount: $rootScope.customerdetails.bedCount,
            bathCount: $rootScope.customerdetails.bathCount
        };
        angular.forEach($scope.bedrooms, function(val) {
            if ($rootScope.customerdetails.bedCount === val.value) {
                val.selected = true;
            } else {
                val.selected = false;
            }
        });

        angular.forEach($scope.bathrooms, function(val) {
            if ($rootScope.customerdetails.bathCount === val.value) {
                val.selected = true;
            } else {
                val.selected = false;
            }
        });

    };

    function calculatePrice() {
        console.log('cal price:');
        angular.forEach($scope.basicServiceConfig, function(val) {
            if (val.bathroom_count == $scope.roomCount.bathCount && val.bedroom_count == $scope.roomCount.bedCount) { // jshint ignore:line
                console.log('Price here!!!', val.daily_price); // jshint ignore:line
                console.log('Id final:', val.id);
                $window.localStorage.bookDetails = JSON.stringify({ service_id: val.id }); // jshint ignore:line
                $rootScope.customerdetails.price = val.daily_price; // jshint ignore:line
            }
        });
    }

    $scope.bedCount = function(room) {
        $scope.roomCount.bedCount = room;
        console.log('count from bed:', $scope.roomCount);
        angular.forEach($scope.bedrooms, function(val) {
            if (room === val.value) {
                val.selected = true;
                $scope.roomCount.bedCount = room;
                calculatePrice();
                $rootScope.customerdetails.bedCount = room;
            } else {
                val.selected = false;
            }
        });
    };

    $scope.bathCount = function(room) {
        $scope.roomCount.bathCount = room;
        console.log('count from bath:', $scope.roomCount);
        angular.forEach($scope.bathrooms, function(val) {
            if (room === val.value) {
                val.selected = true;
                $scope.roomCount.bathCount = room;
                calculatePrice();
                $rootScope.customerdetails.bathCount = room;
            } else {
                val.selected = false;
            }
        });
    };

    $scope.submitRoomInfo = function() {
        console.log('room info:', $scope.roomCount);
        $state.go('home.house-details.date-time-slot', {
            'bedCount': $rootScope.customerdetails.bedCount,
            'bathCount': $rootScope.customerdetails.bathCount,
            'price': $rootScope.customerdetails.price
        });
    };

}

RoomController.$inject = ['$scope', '$rootScope', '$state', '$window', '$stateParams'];
module.exports = RoomController;
