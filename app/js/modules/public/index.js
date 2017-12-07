'use strict';

module.exports = angular.module('TidiWebPanel.modules.public', ['ui.router'])
    .config(require('./router/router'))
    .service('PublicService', require('./services/PublicService'))
    .controller('HomeController', require('./controllers/HomeController'))
    .controller('LandingController', require('./controllers/LandingController'))
    .controller('HouseController', require('./controllers/HouseController'))
    .controller('RoomController', require('./controllers/RoomController'))
    .controller('DateTimeController', require('./controllers/DateTimeController'))
    .controller('CleanLocationController', require('./controllers/CleanLocationController'))
    .controller('PaymentController', require('./controllers/PaymentController'))
    .directive('calendar', require('./directives/calendar'));
