'use strict';

module.exports = angular.module('TidiWebPanel.modules.home', ['ui.router'])
  .config(require('./router/router'))
  .factory('OrderDetails', require('./factories/order-details'))
  .service('PublicService', require('./services/PublicService'))
  .directive('calendar', require('./directives/calendar'))
  .controller('HomeController', require('./controllers/home-controller'))
  .controller('LandingController', require('./controllers/landing-controller'))
  .controller('OrderDetailsController', require('./controllers/order-details-controller'))
  .controller('RoomDetailsController', require('./controllers/room-details-controller'))
  .controller('DateTimeSlotController', require('./controllers/date-time-slot-controller'))
  .controller('LocationDetailsController', require('./controllers/location-details-controller'))
  .controller('PaymentController', require('./controllers/payment-controller'));
