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
        resolve: {
          settings: ['PublicService', '$q', function(PublicService, $q) {
            var deffered = $q.defer();
            PublicService.getSettings().then(function(res) {
              // console.log('In resolve', res);
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
      .state('home.start', {
        url: '^/start',
        template: require('../templates/landing.html'),
        controller: 'LandingController'
      })
      .state('home.orderDetails', {
        url: '^/order-details',
        abstract: true,
        type:'auth',
        template: require('../templates/house-details.html'),
        controller: 'OrderDetailsController'
      })
      .state('home.orderDetails.roomDetails', {
        url: '^/room-details',
        type:'auth',
        template: require('../templates/room-details.html'),
        controller: 'RoomDetailsController'
      })
      .state('home.orderDetails.timeSlotDetails', {
        url: '^/time-details',
        type:'auth',
        template: require('../templates/date-time-slot.html'),
        controller: 'DateTimeSlotController',
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
      .state('home.orderDetails.locationDetails', {
        url: '^/location-details',
        type:'auth',
        template: require('../templates/clean-location.html'),
        controller: 'LocationDetailsController'
      })
      .state('home.orderDetails.paymentDetails', {
        url: '^/payment',
        type:'auth',
        template: require('../templates/payment.html'),
        controller: 'PaymentController'
      });
    $urlRouterProvider.otherwise('/start');
  }
];
