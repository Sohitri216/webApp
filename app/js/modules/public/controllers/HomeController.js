'use strict';

function HomeController($scope, $rootScope, $state) {
    console.log('In home controller', $scope);
    $rootScope.heightWrap = true;
    $rootScope.controlBackgroundImage = false;
    $scope.gotoDashboard = function() {
        $state.go('home.start');
    };
}
HomeController.$inject = ['$scope', '$rootScope', '$state'];
module.exports = HomeController;
