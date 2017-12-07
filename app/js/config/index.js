'use strict';

module.exports = angular.module('TidiWebPanel.config', [])
    .constant('API', require('./api'))
    .constant('AppConfig', require('./app-config'));
