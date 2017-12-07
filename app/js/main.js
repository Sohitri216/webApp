'use strict';

angular.module('TidiWebPanel', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'angular-loading-bar',
        'toastr',
        require('./modules').name,
        require('./util').name,
        require('./config').name,
        require('./common').name
    ])
    .config(['cfpLoadingBarProvider', 'toastrConfig', function(cfpLoadingBarProvider, toastrConfig) {
        cfpLoadingBarProvider.includeSpinner = false;
        angular.extend(toastrConfig, { maxOpened: 1 });
    }])
    .run([
        '$rootScope',
        '$state',
        'OrderDetails',
        function($rootScope, $state, OrderDetails) {
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams) {
                    console.log = function() {};
                    console.log('hi', toState, toParams, fromState, fromParams);
                    var data = OrderDetails.getData();
                    console.log('data==============', data, Object.keys(data).length, toState.name);
                    if (toState.type === 'auth') {
                        console.log('in if=========', data);
                        if (!Object.keys(data).length && fromState.type === 'auth') {
                            event.preventDefault();
                            $state.go('home.start');
                            console.log('in if');
                        }

                        if (!data.service_id && toState.name !== 'home.orderDetails.roomDetails') { // jshint ignore:line
                            event.preventDefault();
                            $state.go('home.orderDetails.roomDetails');
                        }

                        if ((!data.startTime || !data.selectedSlot) && toState.name !== 'home.orderDetails.timeSlotDetails' && toState.name !== 'home.orderDetails.roomDetails') {
                            event.preventDefault();
                            $state.go('home.orderDetails.timeSlotDetails');
                        }

                        if ((!data.address || !data.accessWay || !data.aptNo) && toState.name === 'home.orderDetails.paymentDetails') {
                            event.preventDefault();
                            $state.go('home.orderDetails.locationDetails');
                        }

                    }
                    if (toState.name === 'home.orderDetails.paymentDetails' && fromState.name === 'home.start') {
                        event.preventDefault();
                    }
                    if (fromState.name === 'home.start' && toState.name === 'home.orderDetails.timeSlotDetails') {
                        event.preventDefault();
                    }
                    if (fromState.name === 'home.start' && toState.name === 'home.orderDetails.locationDetails') {
                        event.preventDefault();
                    }
                    if (fromState.name === 'home.start' && toState.name === 'home.orderDetails.roomDetails' && !data.service_id) { // jshint ignore:line
                        event.preventDefault();
                    }
                });
        }
    ]);