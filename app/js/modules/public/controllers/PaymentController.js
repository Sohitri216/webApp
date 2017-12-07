'use strict';

function PaymentController($scope, $rootScope, $stateParams, PublicService, $window, toastr, $state) {
    console.log('In payment controller');
    var vm = this;
    vm.hasError = false;
    vm.showSpinner = false;
    $rootScope.heightWrap = false;
    $rootScope.controlBackgroundImage = false;
    /**Setting rootscope variables**/
    $rootScope.customerdetails.bedCount = $stateParams.bedCount;
    $rootScope.customerdetails.bathCount = $stateParams.bathCount;
    $rootScope.customerdetails.price = $stateParams.price;
    $rootScope.customerdetails.date = $stateParams.date;
    $rootScope.customerdetails.address = $stateParams.address;
    /**Setting rootscope variables**/
    console.log('match:', $rootScope.customerdetails.price, typeof($rootScope.customerdetails.price));
    $scope.finalPrice = Number($rootScope.customerdetails.price).toFixed(2);
    $window.localStorage.priceWithAddOn = $scope.finalPrice;
    // $scope.expPattern = /^(0[1-9]|1[012])\/\d{2}$/;
    $scope.expPattern = /[\d]{2}\/[\d]{4}/;
    $scope.fullName = /^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/igm;
    if ($window.localStorage.rentalType) {
        $scope.rentalType = $window.localStorage.rentalType;
    }
    if ($window.localStorage.selectedDate) {
        $scope.serviceDate = $window.localStorage.selectedDate;
        $scope.serviceDate = new Date($scope.serviceDate);
        $scope.serviceYear = $scope.serviceDate.getFullYear();
        console.log('service date:', $scope.serviceDate);
    }
    if ($window.localStorage.selectedSlot) {
        $scope.serviceTime = $window.localStorage.selectedSlot;
    }
    if ($window.localStorage.bookDetails) {
        $scope.additionals = JSON.parse($window.localStorage.bookDetails); // jshint ignore:line
        $scope.additionals = $scope.additionals.additional_services; // jshint ignore:line
        console.log('from local:', $scope.additionals);
    }

    if ($window.localStorage.dateChangeFlagNotFirstTime) {
        delete $window.localStorage.dateChangeFlagNotFirstTime;
    }

    $scope.paymentInfo = {};
    $scope.userRegistration = {};
    $scope.userBooking = {};
    $scope.userPayment = {};
    $scope.paymentInfo.contactMethod = [];
    $scope.init = function() {
        $scope.addServName = '';
        $scope.contactType = [{
            value: 'Text',
            selected: false
        }, {
            value: 'Call',
            selected: false
        }, {
            value: 'Email',
            selected: true
        }];
        var contactSelected = $scope.contactType.find(function(each) {
            return each.selected === true;
        });
        $scope.paymentInfo.contactMethod.push(contactSelected.value);
        console.log('contactSelected:', contactSelected);
        PublicService.getTaxConfig().then(function(res) {
            console.log('Tax Config:', res);
            if (res) {
                var taxConfig = res.data;
                $scope.taxOnTotal = (Number(taxConfig.daily_tax) * ($rootScope.customerdetails.price)) / 100; // jshint ignore:line
                $scope.taxOnTotal = $scope.taxOnTotal.toFixed(2);
                console.log('Tax on total:', $scope.taxOnTotal);
                $scope.totalPrice = (Number($rootScope.customerdetails.price) + Number($scope.taxOnTotal)).toFixed(2);
                $rootScope.customerdetails.price = $scope.totalPrice;
            }
        }, function(err) {
            console.log('err:', err);
        });

        PublicService.fetchAdditional().then(function(res) {
            console.log('Response add on:', res);
            if (res.data) {
                var addOnData = res.data;
                for (var i = 0; i < $scope.additionals.length; i++) {
                    for (var j = 0; j < addOnData.length; j++) {
                        if ($scope.additionals[i].id === addOnData[j].id) {
                            $scope.addServName = $scope.addServName + addOnData[j].name + ', ';
                        }
                    }
                }
                $scope.addServName = $scope.addServName.slice(0, -2);
            }
        }, function(err) {
            console.log('err:', err);
        });
    };

    $scope.contactMethod = function(method) {

        console.log('method', method);
        angular.forEach($scope.contactType, function(val) {
            if (method === val.value && !val.selected) {
                val.selected = true;
                $scope.paymentInfo.contactMethod.push(method);
            } else if (method === val.value && val.selected) {
                val.selected = false;
                for (var i = 0; i < $scope.paymentInfo.contactMethod.length; i++) {
                    if ($scope.paymentInfo.contactMethod[i] === method) {
                        $scope.paymentInfo.contactMethod.splice(i, 1);
                    }
                }
            }
        });
        console.log('Contact method:', $scope.paymentInfo.contactMethod);
    };

    $scope.paySubmit = function() {
        $scope.paymentInfo.password = '123456';
        console.log('Form submit', $scope.paymentInfo);
        if ($window.localStorage.bookDetails) {
            $scope.userBooking = JSON.parse($window.localStorage.bookDetails);
            // }
            //  else
            //   {
            var infoMonth = $scope.paymentInfo.expDate.split('/')[0];
            var infoYear = $scope.paymentInfo.expDate.split('/')[1];
            console.log('month, year:', infoMonth, infoYear);
            var currentYear = new Date().getFullYear();
            console.log('currentYear:', currentYear);
            if (infoYear < currentYear) {
                console.log('less:');
                vm.hasError = true;
            } else {
                vm.hasError = false;
                $scope.userPayment.exp_month = infoMonth; // jshint ignore:line
                $scope.userPayment.exp_year = infoYear; // jshint ignore:line
                $scope.userPayment.card_number = $scope.paymentInfo.creditNumber; // jshint ignore:line
                $scope.userPayment.cvc = $scope.paymentInfo.cvv;
                $scope.userPayment.email = $scope.paymentInfo.email;
                $scope.userPayment.rental_id = $scope.userBooking.rental_id; // jshint ignore:line
                $scope.userPayment.total_price = $scope.totalPrice; // jshint ignore:line
            }
            /**
             * [User registration]
             * @type {[type]}
             */
            if (!vm.hasError) {
                vm.showSpinner = true;
                $scope.userRegistration.email = $scope.paymentInfo.email;
                $scope.userRegistration.password = $scope.paymentInfo.password;
                $scope.userRegistration.confirm_password = $scope.paymentInfo.password; // jshint ignore:line
                $scope.userRegistration.name = $scope.paymentInfo.fullName;
                $scope.userRegistration.user_type = '4'; // jshint ignore:line
                $scope.userRegistration.address = $rootScope.customerdetails.address;
                $scope.userRegistration.contact_medium = $scope.paymentInfo.contactMethod; // jshint ignore:line
                $scope.userRegistration.device_type = 'web'; // jshint ignore:line
                $scope.userRegistration.phone = $scope.paymentInfo.phone;
                console.log('Reg obj:', $scope.userRegistration);
                // $scope.paymentInfo = {};
                PublicService.registerUser($scope.userRegistration)
                    .then(function(res) {
                        console.log('Response:', res);
                        if (res.token) {
                            $window.localStorage.token = res.token;
                            // $window.localStorage.userId = res.data.user_id;
                            $scope.userBooking.token = res.token;
                            PublicService.bookService($scope.userBooking).then(function(res) {
                                console.log('res:', res);
                                if (res.data.orderId) {
                                    $scope.userPayment.token = $window.localStorage.token;
                                    $scope.userPayment.booking_id = res.data.orderId; // jshint ignore:line
                                    PublicService.userPayment($scope.userPayment).then(function(res) {
                                        console.log('Payment:', res);
                                        vm.showSpinner = false;
                                        $scope.paymentInfo = {};
                                        $state.go('home.start');
                                        toastr.success('Order Placed', 'Success', {
                                            iconClass: 'toast-success'
                                        });
                                    }, function(err) {
                                        console.log('err:', err);
                                        vm.showSpinner = false;
                                    });
                                }
                            }, function(err) {
                                console.log('err:', err);
                                vm.showSpinner = false;
                            });
                        }
                    }, function(err) {
                        console.log('err:', err);
                        vm.showSpinner = false;
                    });
            } else {
                toastr.error('Expiry year should be greater than current Year', 'Error', {
                    iconClass: 'toast-error'
                });
            }
        }




    };
}
PaymentController.$inject = ['$scope', '$rootScope', '$stateParams', 'PublicService', '$window', 'toastr', '$state'];
module.exports = PaymentController;
