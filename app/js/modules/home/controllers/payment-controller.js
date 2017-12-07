'use strict';

module.exports = [
    '$scope',
    '$state',
    '$rootScope',
    'OrderDetails',
    'PublicService',
    '$timeout',
    'toastr',
    'AppConfig',
    function($scope, $state, $rootScope, OrderDetails, PublicService, $timeout, toastr, AppConfig) {


        //get additional service
        function getAdditionalServices() {
            PublicService.fetchAdditional().then(function(response) {
                $rootScope.additionalService = response.data;
                $rootScope.additionalService.forEach(function(each) {
                    $scope.orderDetails.additional_services.forEach(function(data) { // jshint ignore:line
                        if (each.id === data.id) {
                            $scope.addOn += each.name + ',';
                        }
                    });
                });
                $scope.addOn = $scope.addOn.substring(0, $scope.addOn.length - 1);
            }, function(err) {
                console.log('err', err);
            });
        }
        //Discount calculate
        function calculateDiscount(type, amount) {
            console.log('type,amount', type, amount, $scope.orderDetails.priceWithoutTax);
            if (type === 1) {
                //Percentage
                var discountAmount = ($scope.orderDetails.priceWithoutTax * amount) / 100;
                $scope.orderDetails.priceWithoutTax = $scope.orderDetails.priceWithoutTax - discountAmount;

                console.log(discountAmount, $scope.orderDetails.priceWithoutTax);
                $scope.orderDetails.priceWithoutTax = Number(parseFloat($scope.orderDetails.priceWithoutTax).toFixed(2));
                console.log('Discounted Price:', $scope.orderDetails.priceWithoutTax);
                calculateTax();
            } else if (type === 2) {
                //Absolute
                if ($scope.orderDetails.priceWithoutTax - amount > 0) {
                    $scope.orderDetails.priceWithoutTax = $scope.orderDetails.priceWithoutTax - amount;
                    $scope.orderDetails.priceWithoutTax = Number(parseFloat($scope.orderDetails.priceWithoutTax).toFixed(2));
                    console.log('Discounted Price:', $scope.orderDetails.priceWithoutTax);
                    calculateTax();
                } else {
                    $scope.applied = false;
                    OrderDetails.resetCoupon();
                    toastr.error(' Total payable amount should be more than the discounted amount', 'Error', {
                        iconClass: 'toast-error'
                    });
                }
            } else {
                console.log('Invalid type');
            }

        }
        //calculate tax amounts
        function calculateTax() {
            var taxPercetage;
            if ($scope.orderDetails.servicetype === 'deep') {
                taxPercetage = $rootScope.settings.deep_tax; // jshint ignore:line
            } else if ($scope.orderDetails.servicetype === 'full') {
                switch ($scope.orderDetails.rentalId) {
                    case 0:
                        taxPercetage = $rootScope.settings.daily_tax; // jshint ignore:line
                        break;
                    case 1:
                        taxPercetage = $rootScope.settings.weekly_tax; // jshint ignore:line
                        break;
                    case 2:
                        taxPercetage = $rootScope.settings.bi_weekly_tax; // jshint ignore:line
                        break;
                }
            }

            // $scope.orderDetails.taxAmount = ($scope.orderDetails.price * Number(taxPercetage)) / 100;
            $scope.orderDetails.taxAmount = ($scope.orderDetails.priceWithoutTax * Number(taxPercetage)) / 100;
            $scope.orderDetails.taxAmount = Number(parseFloat($scope.orderDetails.taxAmount).toFixed(2));
            $scope.orderDetails.totalPrice = $scope.orderDetails.priceWithoutTax + $scope.orderDetails.taxAmount;
            $scope.orderDetails.totalPrice = Number(parseFloat($scope.orderDetails.totalPrice).toFixed(2));
            OrderDetails.setData($scope.orderDetails);
            $rootScope.orderDetailsForHeader = OrderDetails.getData();
            console.log('taxPercetage', taxPercetage, $scope.orderDetails.taxAmount);
        }

        // create stripe elements
        function createStripeElements() {
            $timeout(function() {
                var style = {};

                $scope.stripe = window.Stripe(AppConfig.stripeKey);
                $scope.elements = $scope.stripe.elements();
                $scope.cardNumber = $scope.elements.create('cardNumber', { style: style });
                $scope.cardNumber.mount('#card-number');
                var cardExpiry = $scope.elements.create('cardExpiry', { style: style });
                cardExpiry.mount('#card-expiry');
                var cardCvc = $scope.elements.create('cardCvc', { style: style });
                cardCvc.mount('#card-cvc');
                // console.log('init sub view', $scope.stripe, Stripe);
            }, 0);
        }



        //make payment
        function makePayment(userData, token, orderData) {
            var data = {
                token: userData.token,
                booking_id: orderData.data.orderId, // jshint ignore:line
                stripe_token: token.id, // jshint ignore:line
                email: $scope.userInfo.email,
                servicetype: $scope.orderDetails.servicetype,
                total_price: $scope.orderDetails.totalPrice // jshint ignore:line
            };
            if ($scope.applied) {
                data.name = $scope.couponCode
            }
            if ($scope.orderDetails.servicetype === 'full') {
                data.rental_id = $scope.orderDetails.rentalId; // jshint ignore:line
            }
            PublicService.userPayment(data)
                .then(function(response) {
                    if (response.success) {
                        console.log('response', response);
                        toastr.success(response.message, 'Success', {
                            iconClass: 'toast-success'
                        });
                        OrderDetails.resetData();
                        OrderDetails.resetCoupon();
                        $state.go('home.start');
                    } else {
                        $scope.showSpinner = false;
                    }
                })
                .finally(function() {
                    $scope.showSpinner = false;

                });
        }

        //confirm booking from backend
        function confirmBooking(userData, token) {
            console.log(userData);
            var selectedTime = '',
                data = {},
                slot = $scope.orderDetails.selectedSlot.slice(-2),
                slotTime = $scope.orderDetails.selectedSlot.slice(0, -2).split(':')[0];
            if (slot === 'am') {
                if (Number(slotTime) < 10) {
                    selectedTime = $scope.orderDetails.startTime + ' 0' + slotTime + ':00:00';
                } else {
                    selectedTime = $scope.orderDetails.startTime + ' ' + slotTime + ':00:00';
                }
            } else {
                if (Number(slotTime) === 12) {
                    selectedTime = $scope.orderDetails.startTime + ' ' + slotTime + ':00:00';
                } else {
                    selectedTime = $scope.orderDetails.startTime + ' ' + (Number(slotTime) + 12) + ':00:00';
                }
            }
            console.log(slot, slotTime, selectedTime);
            data = {
                token: userData.token,
                service_start_time: selectedTime, // jshint ignore:line
                service_id: $scope.orderDetails.service_id, // jshint ignore:line
                additional_services: $scope.orderDetails.additional_services, // jshint ignore:line
                address: $scope.orderDetails.address,
                apartmentNo: $scope.orderDetails.aptNo,
                accessWay: $scope.orderDetails.accessWay,
                servicetype: $scope.orderDetails.servicetype,
                contact_medium: $scope.selectedMethod // jshint ignore:line
            };
            if ($scope.orderDetails.servicetype === 'full') {
                data.rental_id = $scope.orderDetails.rentalId; // jshint ignore:line
            }
            if ($scope.orderDetails.notes) {
                data.notes = $scope.orderDetails.notes;
            }
            PublicService.bookService(data)
                .then(function(response) {
                    if (response.success) {
                        console.log('in success', response);
                        makePayment(userData, token, response);
                        // getCardToken(userData, response);
                    } else {
                        $scope.showSpinner = false;
                    }
                }, function(error) {
                    console.log('error', error);
                    $scope.showSpinner = false;
                });
        }

        function submitUserData(token) {
            PublicService.registerUser({
                email: $scope.userInfo.email,
                password: '123456',
                confirm_password: '123456', // jshint ignore:line
                name: $scope.userInfo.fullName,
                user_type: '4', // jshint ignore:line
                address: $scope.orderDetails.address + '- Apt. No. -' + $scope.orderDetails.aptNo,
                contact_medium: $scope.selectedMethod, // jshint ignore:line
                device_type: 'web', // jshint ignore:line
                phone: $scope.userInfo.phone
            }).then(function(response) {
                if (response.success) {
                    console.log('in success', response);
                    confirmBooking(response, token);
                } else {
                    $scope.showSpinner = false;
                }
            }, function(error) {
                console.log('error', error);
                $scope.showSpinner = false;
            });
        }

        //get the card token from stripe
        function getCardToken() {
            $scope.stripe.createToken($scope.cardNumber)
                .then(function(response) {
                    console.log('response', response);
                    if (response.error) {
                        toastr.error(response.error.message, 'Error', {
                            iconClass: 'toast-error'
                        });
                        $scope.showSpinner = false;
                    } else {
                        submitUserData(response.token);
                        // makePayment(userData, response.token, orderData);
                    }
                });
        }


        $scope.applyCoupon = function() {
            console.log('Coupon:', $scope.couponCode);
            var couponState;
            if ($scope.couponCode) {
                $scope.applied = true;
                PublicService.checkDiscount({
                    name: $scope.couponCode
                }).then(function(res) {
                    console.log('res coupon:', res);
                    $scope.couponConfig = res.data;
                    couponState = {
                        name: $scope.couponCode,
                        status: $scope.applied,
                        discountType: $scope.couponConfig.discount_type,
                        price: $scope.couponConfig.discount_price
                    };
                    OrderDetails.setCoupon(couponState);
                    // $scope.checkValidity()
                    calculateDiscount($scope.couponConfig.discount_type, $scope.couponConfig.discount_price);
                }, function(err) {
                    console.log('Err:', err);
                    $scope.applied = false;
                });
            } else {
                console.log('No code found');
            }
        };


        $scope.init = function() {
            $rootScope.heightWrap = true;
            $rootScope.controlBackgroundImage = false;
            $rootScope.abstractViewFullWidth = false;
            $rootScope.largeScreen = true;
            $rootScope.padScreen = true;
            $scope.phonePattern = /^[2-9]{1}\d{9}$/;
            $scope.userInfo = {};
            $scope.showSpinner = false;
            $scope.applied = false;
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
            $scope.rentalConfig = {
                0: 'One-Time',
                1: 'Weekly',
                2: 'Bi-Weekly'
            };
            $scope.addOn = '';
            $scope.selectedMethod = ['Email'];
            getAdditionalServices();
            $scope.orderDetails = OrderDetails.getData();
            $scope.couponStatus = OrderDetails.getCoupon();
            console.log('coupon status:', $scope.couponStatus);
            createStripeElements();
            if (Object.keys($scope.couponStatus).length === 0 && $scope.couponStatus.constructor === Object) {
                console.log('Empty Object:No coupon:');
                $scope.applied = false;
            } else {
                $scope.applied = $scope.couponStatus.status;
                $scope.couponCode = $scope.couponStatus.name;
            }
            // $scope.orderDetails.price = parseFloat($scope.orderDetails.price).toFixed(2);
            $scope.orderDetails.priceWithoutTax = angular.copy($scope.orderDetails.price);
            console.log('Coupon Deduction:', $scope.orderDetails.priceWithoutTax);
            if ($scope.applied) {
                calculateDiscount($scope.couponStatus.discountType, $scope.couponStatus.price);
            } else {
                calculateTax();
                console.log('orderDetails', $scope.orderDetails, $rootScope.settings);
            }
        };

        //set the contact method
        //method - the contact method
        $scope.contactMethod = function(method) {
            console.log('method:', method);
            if (method.value !== 'Email') {
                method.selected = !method.selected;
            }
            // method.selected = true;
            if (method.selected && $scope.selectedMethod.indexOf(method.value) === -1) {
                console.log('in if');
                $scope.selectedMethod.push(method.value);
            }
        };

        //submit the form data
        $scope.submitData = function() {
            $scope.showSpinner = true;
            getCardToken();
            // submitUserData();
        };
    }
];