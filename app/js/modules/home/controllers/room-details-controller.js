'use strict';

module.exports = [
    '$scope',
    '$state',
    '$rootScope',
    'OrderDetails',
    'PublicService',
    '$sce',
    'toastr',
    function($scope, $state, $rootScope, OrderDetails, PublicService, $sce, toastr) {

        function selectedBedroom() {
            $scope.bedRoomOptions.forEach(function(each) {
                if (each.value === $scope.orderDetails.bedroom) {
                    each.selected = true;
                } else {
                    each.selected = false;
                }
            });
        }

        function selectedBathroom() {
            $scope.bathRoomOptions.forEach(function(each) {
                if (each.value === $scope.orderDetails.bathroom) {
                    each.selected = true;
                } else {
                    each.selected = false;
                }
            });
        }

        function selectCleaningType() {
            $scope.cleanTypes.forEach(function(each) {
                if (each.value === $scope.orderDetails.servicetype) {
                    each.selected = true;
                } else {
                    each.selected = false;
                }
            });
        }

        function getPrice() {
            if ($scope.orderDetails.bedroom && $scope.orderDetails.bathroom) {
                PublicService.getPrice({
                        bedroom: $scope.orderDetails.bedroom,
                        bathroom: $scope.orderDetails.bathroom,
                        servicetype: $scope.orderDetails.servicetype
                    })
                    .then(function(response) {
                        if (response.success) {
                            var data = response.data[0];
                            console.log('in response', data);
                            data.price = data.daily_price || data.deep_price; // jshint ignore:line
                            data.bathroom = $scope.orderDetails.bathroom;
                            data.bedroom = $scope.orderDetails.bedroom;
                            data.servicetype = $scope.orderDetails.servicetype;
                            OrderDetails.setData(data);
                            $rootScope.orderDetailsForHeader = OrderDetails.getData();
                        }
                    });
            } else {
                toastr.error('Please select bedroom and bathroom', 'Error', {
                    iconClass: 'toast-error'
                });
            }
        }

        $scope.init = function() {
            $rootScope.heightWrap = true;
            $rootScope.controlBackgroundImage = false;
            $rootScope.abstractViewFullWidth = false;
            $rootScope.largeScreen = true;
            $rootScope.padScreen = false;
            $scope.orderDetails = OrderDetails.getData();
            $scope.showModal = false;
            $scope.cleaningInformation = $sce.trustAsHtml($rootScope.settings.help_content); // jshint ignore:line
            $scope.bathRoomOptions = [{
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
            $scope.bedRoomOptions = [{
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
            $scope.cleanTypes = [{
                value: 'full',
                name: 'Standard',
                selected: true
            }, {
                value: 'deep',
                name: 'Deep',
                selected: false
            }];
            if (!$scope.orderDetails.servicetype) {
                $scope.orderDetails.servicetype = 'full';
            }
            OrderDetails.setData($scope.orderDetails);
            selectCleaningType();
            selectedBedroom();
            selectedBathroom();

        };

        $scope.setBedRoomCount = function(value) {
            $scope.orderDetails.bedroom = value;
            OrderDetails.setData($scope.orderDetails);
            // $rootScope.orderDetailsForHeader = OrderDetails.getData();
            selectedBedroom();
            getPrice();
        };

        $scope.setBathRoomCount = function(value) {
            $scope.orderDetails.bathroom = value;
            OrderDetails.setData($scope.orderDetails);
            // $rootScope.orderDetailsForHeader = OrderDetails.getData();
            selectedBathroom();
            getPrice();
        };

        $scope.setCleaningType = function(value) {
            $scope.orderDetails.servicetype = value;
            // OrderDetails.setData($scope.orderDetails);
            // $rootScope.orderDetailsForHeader = OrderDetails.getData();
            selectCleaningType();
            getPrice();
        };

        $scope.submitCleaningInfo = function() {
            console.log('in submitCleaningInfo', $scope.orderDetails);
            if ($scope.orderDetails.bathroom && $scope.orderDetails.bedroom) {
                $state.go('home.orderDetails.timeSlotDetails');
            } else {
                toastr.error('Please select bedroom and bathroom', 'Error', {
                    iconClass: 'toast-error'
                });
            }
        };


        $scope.openModal = function() {
            console.log('in openModal');
            $scope.showModal = true;
        };

        $scope.closeModal = function() {
            $scope.showModal = false;
        };
    }
];