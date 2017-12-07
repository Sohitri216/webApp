'use strict';
module.exports = [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.hashPrefix(''); //to remove the exclamation mark in route
        $stateProvider
            .state('home', {
                url: '/home',
                template: require('../templates/home.html'),
                abstract: true,
                controller: 'HomeController',
            })
            .state('home.start', {
                url: '^/start',
                template: require('../templates/landing.html'),
                controller: 'LandingController',
                controllerAs: 'vm'
            })
            .state('home.house-details', {
                url: '^/house-details',
                template: require('../templates/house-details.html'),
                abstract: true,
                controller: 'HouseController'
                    // controllerAs: 'vm'
            })
            .state('home.house-details.room-details', {
                url: '^/room-details/bedCount/:bedCount/bathCount/:bathCount/price/:price',
                // url: '^/room-details?bedCount&bathCount',
                template: require('../templates/room-details.html'),
                controller: 'RoomController',
                params: {
                    bedCount: null,
                    bathCount: null,
                    price: null
                },
                controllerAs: 'vm'
            })
            .state('home.house-details.date-time-slot', {
                url: '^/date-time-slot/bedCount/:bedCount/bathCount/:bathCount/price/:price',
                template: require('../templates/date-time-slot.html'),
                controller: 'DateTimeController',
                controllerAs: 'vm',
                resolve: {
                    OfferPrice: ['PublicService', '$q', function(PublicService, $q) {
                        var deffered = $q.defer();
                        PublicService.getOfferPrice().then(function(res) {
                            console.log('In resolve', res);
                            if (res.data) {
                                return deffered.resolve(res.data);
                            } else {
                                deffered.reject();
                            }
                        }, function(err) {
                            deffered.reject(err);
                        });
                        return deffered.promise;
                    }]
                }
            })
            .state('home.house-details.clean-location', {
                url: '^/clean-location/bedCount/:bedCount/bathCount/:bathCount/price/:price/date/:date',
                template: require('../templates/clean-location.html'),
                controller: 'CleanLocationController',
                controllerAs: 'vm'
            })
            .state('home.house-details.payment', {
                url: '^/payment/bedCount/:bedCount/bathCount/:bathCount/price/:price/date/:date/address/:address',
                template: require('../templates/payment.html'),
                controller: 'PaymentController',
                controllerAs: 'vm'
            });

        $urlRouterProvider.otherwise('/start');
    }
];
