'use strict';

function DateTimeController($scope, $rootScope, $state, OfferPrice, $window, $stateParams, toastr, PublicService) {
    console.log('In date time controller', OfferPrice);

    var vm = this;
    $rootScope.dateSelected = 'false';
    $rootScope.heightWrap = false;
    // vm.isValid = true;
    $rootScope.customerdetails.bedCount = $stateParams.bedCount;
    $rootScope.customerdetails.bathCount = $stateParams.bathCount;
    $rootScope.customerdetails.price = $stateParams.price;
    $rootScope.controlBackgroundImage = false;
    $scope.day = moment(); // jshint ignore:line
    console.log('day:', $scope.day.toDate());
    $scope.offerRate = OfferPrice;
    $scope.timeSelected = false;

    angular.forEach($scope.offerRate, function(val) {
        console.log('testtttttttttttttt', val);
        // val.day_price = '$ ' + val.day_price + ' off'; // jshint ignore:line
    });
    console.log('offer Rate:', $scope.offerRate);
    $window.localStorage.rentalType = 'One-Time';
    if (!$window.localStorage.setPrice) {
        $window.localStorage.setPrice = $rootScope.customerdetails.price;
    } else {
        console.log('Price already present');
    }
    if ($window.localStorage.priceWithAddOn) {
        // delete $window.localStorage.priceWithAddOn;
    }
    if ($window.localStorage.selectedSlot) {
        console.log('Slot pre selected');
        vm.isValid = true;
    } else {
        console.log('Check for slot availability');
        vm.isValid = false;
    }
    $scope.recurringVal = [{
        value: 'One-Time',
        rentalId: 0,
        selected: true
    }, {
        value: 'Weekly',
        rentalId: 1,
        selected: false
    }, {
        value: 'Bi-Weekly',
        rentalId: 2,
        selected: false
    }];
    $scope.offRates = $scope.offerRate;

    $scope.storedObj = JSON.parse($window.localStorage.bookDetails);
    if (!$scope.storedObj.rental_id) { // jshint ignore:line
        console.log('in if');
        $scope.storedObj.rental_id = 0; //jshint ignore:line
        $window.localStorage.bookDetails = JSON.stringify($scope.storedObj);
    } else {
        console.log('in else');
        angular.forEach($scope.recurringVal, function(val) {
            if (val.rentalId == $scope.storedObj.rental_id) { //jshint ignore:line
                val.selected = true;
            } else {
                val.selected = false;
            }

        });
    }


    $scope.submitdateInfo = function() {
        if (vm.isValid) {
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            angular.forEach($rootScope.timeSlot, function(val) {
                if (val.selected) {
                    $scope.timeSelected = true;
                }
            });
            if ($scope.timeSelected) {
                var serviceTime = $scope.storedObj.service_start_time; // jshint ignore:line
                serviceTime = serviceTime.split(' ')[0];
                var myDate = new Date(serviceTime);
                console.log('Date:', myDate);
                var monthDate = myDate.toString().split(' ')[1] + ' ' + myDate.toString().split(' ')[2];
                var day = days[myDate.getDay()];
                console.log(day, monthDate);
                var finalDate = day + ',' + monthDate;
                $rootScope.customerdetails.date = finalDate;
                $state.go('home.house-details.clean-location', {
                    'bedCount': $rootScope.customerdetails.bedCount,
                    'bathCount': $rootScope.customerdetails.bathCount,
                    'price': $rootScope.customerdetails.price,
                    'date': $rootScope.customerdetails.date
                });
            } else {
                console.log('Please select time');
                toastr.error('please select time', 'Error', {
                    iconClass: 'toast-error'
                });
            }
        } else {
            toastr.error('Please select an proper slot', 'Error', {
                iconClass: 'toast-error'
            });
        }
    };

    $scope.selectSlot = function(data) {
        // if ($scope.storedObj.service_start_time) {
        //     $window.localStorage.dateChangeFlagNotFirstTime = true;
        // }
        console.log('in selectSlot========', data);
        if (data.status) {
            var value = data.time;
            var checkSloTime, finalcheckSloTime;
            if (value.toString().split(' ')[1] === 'pm') {
                checkSloTime = value.toString().split(' ')[0];
                checkSloTime = (Number(checkSloTime.split(':')[0]) + 12);
                console.log('formatted time:', checkSloTime);
            } else {
                console.log('In else', value);
                checkSloTime = value.toString().split(':')[0];
            }
            finalcheckSloTime = checkSloTime.toString();
            $scope.storedObj = JSON.parse($window.localStorage.bookDetails);
            console.log($scope.storedObj);
            if ($scope.storedObj.service_start_time) { // jshint ignore:line
                var slotCreds = {
                    bedroom: $rootScope.customerdetails.bedCount,
                    bathroom: $rootScope.customerdetails.bathCount,
                    startTime: $scope.storedObj.service_start_time.split(' ')[0], // jshint ignore:line
                    slot_id: finalcheckSloTime // jshint ignore:line
                };
                console.log(slotCreds);
                PublicService.checkSlot(slotCreds).then(function(res) {
                    if (res) {
                        console.log('slot check response:', res);
                        vm.isValid = true;
                        toastr.success('Slot available', 'Success', {
                            iconClass: 'toast-success'
                        });
                        console.log('selection click:', value);
                        $window.localStorage.selectedSlot = value;
                        var reqTime;
                        console.log('Selected Slot:', value, value.toString().split(' ')[1]);
                        if (value.toString().split(' ')[1] === 'pm') {
                            reqTime = value.toString().split(' ')[0];
                            reqTime = (Number(reqTime.split(':')[0]) + 12) + ':00:00';
                            console.log('formatted time:', reqTime);
                        } else {
                            reqTime = value.toString().split(' ')[0] + ':00';
                        }
                        $scope.storedObj = JSON.parse($window.localStorage.bookDetails);
                        console.log('formatted time:', reqTime, $scope.storedObj);
                        var startTime = $scope.storedObj.service_start_time; // jshint ignore:line
                        console.log(startTime);
                        if (/\s/.test(startTime)) {
                            // It has any kind of whitespace
                            startTime = startTime.split(' ')[0];
                            startTime = startTime + ' ' + reqTime;
                            console.log('if:', startTime);
                        } else {
                            startTime = startTime + ' ' + reqTime;
                            console.log('else:', startTime);
                        }
                        console.log(startTime);
                        $scope.storedObj.service_start_time = startTime; // jshint ignore:line
                        // console.log('lc obj:', $scope.storedObj);
                        $window.localStorage.bookDetails = JSON.stringify($scope.storedObj);
                        angular.forEach($rootScope.timeSlot, function(val) {
                            if (val.time === value) {
                                val.selected = true;
                            } else {
                                val.selected = false;
                            }
                        });
                    }
                }, function(err) { // jshint ignore:line
                    console.log('Slot check error');
                    vm.isValid = false;
                    if ($window.localStorage.selectedSlot) {
                        delete $window.localStorage.selectedSlot;
                    }
                });
                console.log('Slot creds:', slotCreds);
            } else {
                console.log('No date data in local');
            }
        }
    };

    $scope.recWay = function(recVal) {
        angular.forEach($scope.recurringVal, function(val) {
            if (recVal.value === val.value) {
                val.selected = true;
                $scope.storedObj = JSON.parse($window.localStorage.bookDetails);
                $scope.storedObj.rental_id = val.rentalId; //jshint ignore:line
                $window.localStorage.rentalType = val.value;
                // console.log('obj', storedObj);
                $window.localStorage.bookDetails = JSON.stringify($scope.storedObj);
            } else {
                val.selected = false;
            }
        });
    };
}
DateTimeController.$inject = ['$scope', '$rootScope', '$state', 'OfferPrice', '$window', '$stateParams', 'toastr', 'PublicService'];
module.exports = DateTimeController;
