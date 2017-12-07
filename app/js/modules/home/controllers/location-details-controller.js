'use strict';

module.exports = [
    '$scope',
    '$state',
    '$rootScope',
    'OrderDetails',
    'PublicService',
    'toastr',
    function($scope, $state, $rootScope, OrderDetails, PublicService, toastr) {


        //get the list of all locations
        function getAllLocations() {
            PublicService.fetchLocation().then(function(res) {
                console.log('Response location:', res);
                if (res.data) {
                    var locationInfo = res.data;
                    angular.forEach(locationInfo, function(val) {
                        $scope.addresses.push({
                            addr: val.location,
                            apt: val.apt_number // jshint ignore:line
                        });
                    });
                }
            }, function(err) {
                console.log('Err:', err);
            });
        }

        //get the list of additional services
        function getAdditionalServices() {

            PublicService.fetchAdditional().then(function(response) {
                $rootScope.additionalService = response.data;
                $rootScope.additionalService = $rootScope.additionalService.map(function(each) {
                    if ($scope.orderDetails.additional_services && $scope.orderDetails.additional_services.length) { // jshint ignore:line
                        $scope.orderDetails.additional_services.forEach(function(service) { // jshint ignore:line
                            if (each.id === service.id) {
                                each.selected = true;
                            }
                        });
                    } else {
                        each.selected = false;
                    }
                    // each.price = '$' + each.price;
                    return each;
                });
                console.log('$rootScope.additionalService', $rootScope.additionalService, $scope.orderDetails.price);
            }, function(err) {
                console.log('err', err);
            });
        }

        //set the access way
        //value- the access method
        function setAccessWay(value) {
            $scope.accessMethods.forEach(function(each) {
                if (each.value === value) {
                    each.selected = true;
                } else {
                    each.selected = false;
                }
            });
        }

        //update the factory data
        function updateFactoryData() {
            OrderDetails.setData($scope.orderDetails);
            $rootScope.orderDetailsForHeader = OrderDetails.getData();
        }


        //set the access way initially
        function setAccessWayInitially() {
            $scope.accessWay = $scope.accessMethods.find(function(each) {
                return each.value === $scope.orderDetails.accessWay;
            });
            if ($scope.accessWay) {
                setAccessWay($scope.orderDetails.accessWay);
            } else {
                $scope.isOtherAccess = true;
                setAccessWay('Other');
                $scope.details.otherAccessWay = $scope.orderDetails.accessWay;
            }
            // updateFactoryData();
        }

        // function setPrice() {
        //   if ($scope.orderDetails.additional_services.length) {  // jshint ignore:line
        //     $rootScope.additionalService.forEach(function(each) {
        //       $scope.orderDetails.additional_services(function(eachData) {  // jshint ignore:line
        //         if (each.id === eachData.id) {
        //           $scope.orderDetails.price += Number(each.price);
        //         }
        //       });
        //     });
        //   }
        // }

        function checkLocation() {
            console.log('in checkLocation');
            return $scope.addresses.find(function(each) {
                if (each.addr === $scope.orderDetails.address) {
                    return each;
                }
            });
        }


        $scope.init = function() {
            $rootScope.heightWrap = true;
            $rootScope.controlBackgroundImage = false;
            $rootScope.abstractViewFullWidth = false;
            $rootScope.largeScreen = false;
            $rootScope.padScreen = true;
            $scope.orderDetails = OrderDetails.getData();
            $scope.orderDetails.additional_services = ($scope.orderDetails.additional_services) ? $scope.orderDetails.additional_services : []; // jshint ignore:line
            $scope.accessMethods = [{
                value: 'Someone is home',
                selected: false
            }, {
                value: 'Doorman',
                selected: false
            }, {
                value: 'Other',
                selected: false
            }];
            $scope.details = { otherAccessWay: '' };
            if (!$scope.orderDetails.accessWay) {
                $scope.orderDetails.accessWay = $scope.accessMethods[0].value;
                $scope.isOtherAccess = false;
            }
            setAccessWayInitially();

            $scope.addresses = [];
            if (!$scope.orderDetails.price) {
                delete $scope.orderDetails.additional_services; // jshint ignore:line
            }
            if (!$scope.orderDetails.additional_services) { // jshint ignore:line
                $scope.orderDetails.additional_services = []; // jshint ignore:line
            }
            $rootScope.additionalService = [];
            getAllLocations();
            getAdditionalServices();

        };

        $scope.$watch('details.otherAccessWay', function(newVal) {
            if ($scope.isOtherAccess) {
                $scope.orderDetails.accessWay = newVal;
                updateFactoryData();
            }
        });

        //fires on selecting any location
        $scope.onSelect = function() {
            // $scope.orderDetails.aptNo = item.apt;
            // updateFactoryData();
        };

        //save the selected additional service
        //value-the selected additional service
        $scope.saveAdditionalService = function(value) {
            var data = '',
                selectedIndex = '';
            if ($scope.orderDetails.additional_services) { // jshint ignore:line
                data = $scope.orderDetails.additional_services.find(function(each, index) { // jshint ignore:line
                    if (each.id === value.id) {
                        selectedIndex = index;
                        return each;
                    }
                });
            }
            console.log('value', data, value);
            if (!data) {
                console.log('in if');
                $scope.orderDetails.price += Number(value.price);
                value.selected = true;
                $scope.orderDetails.additional_services.push({ // jshint ignore:line
                    id: value.id
                });
            } else {
                console.log('in else', selectedIndex);
                $scope.orderDetails.price -= Number(value.price);
                $scope.orderDetails.price = ($scope.orderDetails.price > 0) ? $scope.orderDetails.price : 0;
                value.selected = false;
                $scope.orderDetails.additional_services.splice(selectedIndex, 1); // jshint ignore:line

            }
            $scope.orderDetails.price = Number(parseFloat($scope.orderDetails.price).toFixed(2));

            updateFactoryData();
        };

        $scope.setAccessWay = function(each) {
            setAccessWay(each.value);
            if (each.value !== 'Other') {
                $scope.orderDetails.accessWay = each.value;
                $scope.isOtherAccess = false;
            } else {
                $scope.isOtherAccess = true;
                $scope.orderDetails.accessWay = $scope.otherAccessWay;
            }
            updateFactoryData();
        };

        //redirect to the next view
        $scope.submitRoomInfo = function() {
            console.log(checkLocation());
            if (checkLocation()) {
                updateFactoryData();
                $state.go('home.orderDetails.paymentDetails');
            } else {
                toastr.error('We are not available in your region', 'Error', {
                    iconClass: 'toast-error'
                });
            }
        };
    }
];