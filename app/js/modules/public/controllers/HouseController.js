'use strict';

function HouseController($scope, $rootScope, $state) {
    // console.log('In abstract house details controller', $scope);
    // console.log('from rootScope:', $rootScope);
    $rootScope.customerdetails = {};
    $rootScope.controlBackgroundImage = false;

    $scope.navigate = function(location) {
        switch (location) {
            case 'room':
                $state.go('home.house-details.room-details', {
                    'bedCount': $rootScope.customerdetails.bedCount,
                    'bathCount': $rootScope.customerdetails.bathCount,
                    'price': $rootScope.customerdetails.price
                });
                break;
            case 'date':
                $state.go('home.house-details.date-time-slot', {
                    'bedCount': $rootScope.customerdetails.bedCount,
                    'bathCount': $rootScope.customerdetails.bathCount,
                    'price': $rootScope.customerdetails.price
                });
                break;
            case 'address':
                $state.go('home.house-details.clean-location', {
                    'bedCount': $rootScope.customerdetails.bedCount,
                    'bathCount': $rootScope.customerdetails.bathCount,
                    'price': $rootScope.customerdetails.price,
                    'date': $rootScope.customerdetails.date,
                    'address': $rootScope.customerdetails.address
                });
                break;

        }

    };
}
HouseController.$inject = ['$scope', '$rootScope', '$state'];
module.exports = HouseController;
