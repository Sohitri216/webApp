'use strict';

module.exports = [
    '$scope',
    '$state',
    '$rootScope',
    'OrderDetails',
    'OfferPrice',
    '$filter',
    'PublicService',
    'toastr',
    function($scope, $state, $rootScope, OrderDetails, OfferPrice, $filter, PublicService, toastr) {


        // for updating price in factory
        function calculatePrice() {
            $scope.orderDetails.price = $scope.orderDetails.price - ($scope.orderDetails.offPrice ? $scope.orderDetails.offPrice : 0);
            $scope.orderDetails.price = ($scope.orderDetails.price >= 0) ? $scope.orderDetails.price : 0;
            $scope.orderDetails.price = Number(parseFloat($scope.orderDetails.price).toFixed(2));
            OrderDetails.setData($scope.orderDetails);
        }

        //for updating the rental type
        function selectedRentalType() {
            delete $scope.orderDetails.additional_services; // jshint ignore:line
            var off;
            $scope.recurringType.forEach(function(each) {
                if (each.rentalId === $scope.orderDetails.rentalId) {
                    each.selected = true;
                    off = each.off;
                } else {
                    each.selected = false;
                }
            });
            console.log(off);
            switch ($scope.orderDetails.rentalId) {
                case 0:
                    $scope.orderDetails.price = $scope.orderDetails.daily_price; // jshint ignore:line
                    break;
                case 1:
                    $scope.orderDetails.price = $scope.orderDetails.weekly_price; // jshint ignore:line
                    break;
                case 2:
                    $scope.orderDetails.price = $scope.orderDetails.biweekly_price; // jshint ignore:line
                    break;
            }
            $scope.orderDetails.price = Number(parseFloat($scope.orderDetails.price).toFixed(2));
            console.log('selectedRentalType', $scope.orderDetails.price);
            calculatePrice();
            $rootScope.orderDetailsForHeader = OrderDetails.getData();
        }
        /**
         * [initialize function]
         */
        $scope.init = function() {

            $rootScope.heightWrap = true;
            $rootScope.controlBackgroundImage = false;
            $rootScope.abstractViewFullWidth = false;
            $rootScope.largeScreen = false;
            $rootScope.padScreen = false;
            $scope.dataLoaded = false;
            $scope.day = moment(); // jshint ignore:line
            $scope.offRates = OfferPrice;
            $scope.orderDetails = OrderDetails.getData();
            console.log('In Init:::', $scope.orderDetails);
            if ($scope.orderDetails.servicetype === 'deep') {
                delete $scope.orderDetails.rentalId;
            }
            $scope.dateSelected = false;
            console.log($rootScope.settings);
            $scope.recurringType = [{
                value: 'One-Time',
                rentalId: 0,
                selected: false,
                off: Number($rootScope.settings.daily_off) // jshint ignore:line
            }, {
                value: 'Weekly',
                rentalId: 1,
                selected: false,
                off: Number($rootScope.settings.weekly_off) // jshint ignore:line
            }, {
                value: 'Bi-Weekly',
                rentalId: 2,
                selected: false,
                off: Number($rootScope.settings.biweekly_off) // jshint ignore:line
            }];
            if ($scope.orderDetails.rentalId) {
                selectedRentalType();
            } else {
                $scope.recurringType[0].selected = true;
                $scope.orderDetails.rentalId = $scope.recurringType[0].rentalId;
            }
            if ($scope.orderDetails.startTime) {
                $scope.getSlot($scope.orderDetails.startTime);
            }
        };

        //on changing the rental type
        $scope.changeRentalType = function(value) {
            console.log('Rental ID:', value, $scope.orderDetails);
            $scope.orderDetails.rentalId = value.rentalId;
            OrderDetails.setData($scope.orderDetails);
            $rootScope.orderDetailsForHeader = OrderDetails.getData();
            selectedRentalType();
        };

        //For getting the slot list for a date 
        //day-date string
        //data-data for the date from calender
        $scope.getSlot = function(day, data) {
            console.log('if other days');
            $scope.dateSelected = true;
            $scope.dataLoaded = false;
            $scope.offDay = false;
            if (data) {
                data.off = Number(data.off);
                $scope.orderDetails.offPrice = data.off;
                if ($scope.orderDetails.servicetype === 'full') {
                    selectedRentalType();
                } else {
                    $scope.orderDetails.price = (($scope.orderDetails.deep_price - data.off) > 0) ? ($scope.orderDetails.deep_price - data.off) : 0; // jshint ignore:line
                    $scope.orderDetails.price = Number(parseFloat($scope.orderDetails.price).toFixed(2));
                }
            }
            if ($scope.orderDetails.startTime !== $filter('date')(day, 'yyyy-MM-dd')) {
                delete $scope.orderDetails.selectedSlot;
            }
            $scope.orderDetails.startTime = $filter('date')(day, 'yyyy-MM-dd');
            OrderDetails.setData($scope.orderDetails);
            $rootScope.orderDetailsForHeader = OrderDetails.getData();
            var today = false,
                currentTime;
            if (new Date(day).toDateString() === new Date().toDateString()) {
                today = true;
                currentTime = new Date().getHours();
            }
            $scope.timeSlot = [];
            PublicService.getFreeSlot({
                    bedroom: $scope.orderDetails.bedroom,
                    bathroom: $scope.orderDetails.bathroom,
                    startTime: $scope.orderDetails.startTime,
                    servicetype: $scope.orderDetails.servicetype
                })
                .then(function(response) {
                    var slotData = response.data;

                    Object.keys(slotData).forEach(function(each) {
                        if (slotData[each].status) {
                            var eachObj = {};
                            if (today && currentTime < Number(slotData[each].id)) {
                                if (Number(slotData[each].id) > 12) {
                                    eachObj.time = (slotData[each].id - 12) + ':00 pm';
                                } else {
                                    if (Number(slotData[each].id) === 12) {
                                        eachObj.time = slotData[each].id + ':00 pm';
                                    } else {
                                        eachObj.time = slotData[each].id + ':00 am';
                                    }
                                }
                                if ($scope.orderDetails.selectedSlot && eachObj.time === $scope.orderDetails.selectedSlot) {
                                    eachObj.selected = true;
                                } else {
                                    eachObj.selected = false;
                                }
                                eachObj.status = slotData[each].status;
                                $scope.timeSlot.push(eachObj);
                            } else {
                                if (!today) {
                                    // console.log('in else');
                                    if (Number(slotData[each].id) > 12) {
                                        eachObj.time = (slotData[each].id - 12) + ':00 pm';
                                    } else {
                                        if (Number(slotData[each].id) === 12) {
                                            eachObj.time = slotData[each].id + ':00 pm';
                                        } else {
                                            eachObj.time = slotData[each].id + ':00 am';
                                        }
                                    }
                                    if ($scope.orderDetails.selectedSlot && eachObj.time === $scope.orderDetails.selectedSlot) {
                                        eachObj.selected = true;
                                    } else {
                                        eachObj.selected = false;
                                    }
                                    eachObj.status = slotData[each].status;
                                    $scope.timeSlot.push(eachObj);
                                }
                            }
                        }
                    });

                }).finally(function() {
                    $scope.dataLoaded = true;
                });


        };

        //selects a slot
        //slot-the time slot
        $scope.selectSlot = function(slot) {
            console.log(slot);
            $scope.timeSlot.forEach(function(each) {
                if (each.time === slot.time) {
                    each.selected = true;
                    $scope.orderDetails.selectedSlot = each.time;
                    OrderDetails.setData($scope.orderDetails);
                } else {
                    each.selected = false;
                }
            });
        };

        //redirects to the location view
        $scope.submitdateInfo = function() {
            console.log('in submitdateInfo', $scope.orderDetails);
            if ($scope.orderDetails.selectedSlot) {
                $state.go('home.orderDetails.locationDetails');
            } else {
                toastr.error('Please select a slot', 'Error', {
                    iconClass: 'toast-error'
                });
            }
        };
    }
];