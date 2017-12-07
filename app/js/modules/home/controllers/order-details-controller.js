'use strict';

module.exports = [
  '$scope',
  '$state',
  '$rootScope',
  'OrderDetails',
  function($scope, $state, $rootScope, OrderDetails) {
    $rootScope.heightWrap = true;
    $rootScope.controlBackgroundImage = false;
    $rootScope.abstractViewFullWidth = false;
    $rootScope.orderDetailsForHeader = OrderDetails.getData();
    $scope.routeConfig = {
      'room': 'home.orderDetails.roomDetails',
      'date': 'home.orderDetails.timeSlotDetails',
      'address': 'home.orderDetails.locationDetails'
    };

    //navigates to the route
    $scope.navigate = function(route) {
      delete $rootScope.orderDetailsForHeader.totalPrice;
      delete $rootScope.orderDetailsForHeader.taxAmount;
      // if (route!=='address') {
      //   delete $rootScope.orderDetailsForHeader.additional_services; // jshint ignore:line
      // }
      OrderDetails.setData($rootScope.orderDetailsForHeader);
      $state.go($scope.routeConfig[route]);
    };
  }
];
