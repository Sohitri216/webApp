'use strict';

module.exports = [
    '$scope',
    '$state',
    '$rootScope',
    'OrderDetails',
    'PublicService',
    'settings',
    function($scope, $state, $rootScope, OrderDetails, PublicService, settings) {


        function init() {
            $rootScope.heightWrap = true;
            $rootScope.controlBackgroundImage = false;
            $rootScope.abstractViewFullWidth = false;
            $rootScope.largeScreen = false;

            $rootScope.settings = settings[0];
        }

        init();

        //redirects to the start view
        $scope.gotoStart = function() {
            OrderDetails.resetData();
            $state.go('home.start');
        };
    }
];