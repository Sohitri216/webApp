'use strict';

function CleanLocationController($scope, $rootScope, $state, PublicService, $stateParams, $window, toastr) {
  var vm = this;
  $rootScope.heightWrap = false;
  $rootScope.controlBackgroundImage = false;
  $rootScope.customerdetails.bedCount = $stateParams.bedCount;
  $rootScope.customerdetails.bathCount = $stateParams.bathCount;
  $rootScope.customerdetails.price = $stateParams.price;
  $rootScope.customerdetails.date = $stateParams.date;
  $scope.place = null;
  $scope.init = function() {
    if ($window.localStorage.priceWithAddOn) {
      console.log('In price with add on', $rootScope.customerdetails.price);
      $rootScope.customerdetails.price = $window.localStorage.priceWithAddOn;
      $state.go('home.house-details.clean-location', {
        'bedCount': $rootScope.customerdetails.bedCount,
        'bathCount': $rootScope.customerdetails.bathCount,
        'price': $rootScope.customerdetails.price,
        'date': $rootScope.customerdetails.date
      }, { notify: false });

    }
    $scope.cleanDetails = {};
    $scope.addresses = [];
    $scope.addOn = [];
    // $scope.addOnLocal = [];
    console.log('In clean location controller');
    $scope.storedObj = JSON.parse($window.localStorage.bookDetails);

    // $scope.cleanDetails.additional = [];
    vm.otherWay = 'false';
    $scope.accessMethods = [{
      value: 'Some is home',
      selected: false
    }, {
      value: 'DoorMan',
      selected: false
    }, {
      value: 'Other',
      selected: false
    }];

    // $scope.addOn = [{
    //     serviceType: 'Inside Fridge',
    //     price: '$35',
    //     selected: false
    // }, {
    //     serviceType: 'Inside Oven',
    //     price: '$35',
    //     selected: false
    // }, {
    //     serviceType: 'Inside Cabinets',
    //     price: '$35',
    //     selected: false
    // }, {
    //     serviceType: 'Dummy',
    //     price: '$21',
    //     selected: false
    // }, {
    //     serviceType: 'Hello',
    //     price: '$11',
    //     selected: false
    // }];
    PublicService.fetchLocation().then(function(res) {
      console.log('Response location:', res);
      if (res.data) {
        var locationInfo = res.data;
        angular.forEach(locationInfo, function(val) {
          $scope.addresses.push({
            addr: val.location,
            apt: val.apt_number // jshint ignore:line
          });
        });
      }
    }, function(err) {
      console.log('Err:', err);
    });

    PublicService.fetchAdditional().then(function(res) {
      console.log('Response add on:', res);
      if (res.data) {
        var addOnData = res.data;
        console.log('add on:::::', addOnData);
        if (addOnData.length === 0 || Object.keys(addOnData).length === 0) {
          console.log('No additional service', addOnData);
          $scope.noAddOn = true;
        } else {
          $scope.noAddOn = false;
          angular.forEach(addOnData, function(val) {
            $scope.addOn.push({
              id: val.id,
              serviceType: val.name,
              price: '$' + val.price,
              selected: false
            });
          });
        }
        console.log('add on:', $scope.addOn);
      }
      if ($scope.storedObj.additional_services && !$window.localStorage.dateChangeFlagNotFirstTime) { // jshint ignore:line
        console.log('in additional');
        angular.forEach($scope.storedObj.additional_services, function(val) { // jshint ignore:line
          angular.forEach($scope.addOn, function(value) {
            // console.log('lc and contr:', val, value);
            if (value.id === val.id) {
              value.selected = true;
              // $scope.calulatePrice(value.price);
            }
          });
        });

      } else if ($scope.storedObj.additional_services && $window.localStorage.dateChangeFlagNotFirstTime) { // jshint ignore:line
        $scope.storedObj.additional_services = []; // jshint ignore:line
      }
    }, function(err) {
      console.log('err', err);
    });

    if (!$scope.storedObj.additional_services) { // jshint ignore:line
      $scope.storedObj.additional_services = []; // jshint ignore:line
    } else {
      $scope.otherAcess = true;
      $scope.cleanDetails.address = $scope.storedObj.address;
      $scope.cleanDetails.aptNo = $scope.storedObj.apartmentNo;
      angular.forEach($scope.accessMethods, function(val) {
        if ($scope.storedObj.accessWay === val.value) {
          val.selected = true;
          $scope.otherAcess = false;
        }
      });

      if ($scope.otherAcess) {
        $scope.accessMethods[2].selected = true;
        vm.otherWay = 'true';
        $scope.cleanDetails.otherAccessWay = $scope.storedObj.accessWay;
      }


      if ($scope.storedObj.notes) {
        $scope.cleanDetails.notes = $scope.storedObj.notes;
      }
    }
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('txtAutocomplete'));
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      // Get the place details from the autocomplete object.
      var place = autocomplete.getPlace();
      console.log('place===============',place.formatted_address); //jshint ignore:line
      $scope.cleanDetails.address=place.formatted_address; //jshint ignore:line
    });
  };

  $scope.calulatePrice = function(price, type) {
    if (type) {
      $rootScope.customerdetails.price = Number($rootScope.customerdetails.price) - Number(price.split('$')[1]);
      $stateParams.price = $rootScope.customerdetails.price;

    } else {
      console.log('Price:', price);
      var changedPrice = Number(price.split('$')[1]) + Number($rootScope.customerdetails.price);
      console.log('Price:', changedPrice);
      $rootScope.customerdetails.price = changedPrice;
      $stateParams.price = $rootScope.customerdetails.price;
      // $state.go('home.house-details.clean-location', {
      //     'bedCount': $rootScope.customerdetails.bedCount,
      //     'bathCount': $rootScope.customerdetails.bathCount,
      //     'price': $rootScope.customerdetails.price,
      //     'date': $rootScope.customerdetails.date
      // }, { notify: false });
    }
    //*****Changing ******//
    $window.localStorage.priceWithAddOn = $rootScope.customerdetails.price;
    $state.go('home.house-details.clean-location', {
      'bedCount': $rootScope.customerdetails.bedCount,
      'bathCount': $rootScope.customerdetails.bathCount,
      'price': $rootScope.customerdetails.price,
      'date': $rootScope.customerdetails.date
    }, { notify: false });

  };

  $scope.additionalService = function(addServ) {
    console.log('access way:', addServ);
    angular.forEach($scope.addOn, function(val) {
      if (addServ === val.id && !val.selected) {
        val.selected = true;
        $scope.calulatePrice(val.price);
        /**remove multiple id**/
        $scope.storedObj.additional_services.push({ // jshint ignore:line
          id: addServ
        });
        // $scope.addOnLocal.push();

      } else if (addServ === val.id && val.selected) {
        val.selected = false;
        for (var i = 0; i < $scope.storedObj.additional_services.length; i++) { // jshint ignore:line
          if ($scope.storedObj.additional_services[i].id === addServ) { // jshint ignore:line
            // if (deletedIndex) {
            angular.forEach($scope.addOn, function(val) { // jshint ignore:line
              console.log('In for each:', val, $scope.storedObj.additional_services, i); // jshint ignore:line
              if (val.id === $scope.storedObj.additional_services[i].id) { // jshint ignore:line
                $scope.calulatePrice(val.price, 'sub');
              }
            });
            // }
            $scope.storedObj.additional_services.splice(i, 1); // jshint ignore:line
            // var deletedIndex = i;
          }


        }
      }

    });
    $window.localStorage.bookDetails = JSON.stringify($scope.storedObj);
    console.log('add ons:', $scope.storedObj.additional_services); // jshint ignore:line
  };

  $scope.onSelect = function($item, $model, $label) {
    $scope.$item = $item;
    $scope.$model = $model;
    $scope.$label = $label;
    console.log('In on select:', $scope.$item);
    $scope.cleanDetails.aptNo = $scope.$item.apt;
    $scope.storedObj.apartmentNo = $scope.$item.apt;
    $scope.storedObj.address = $scope.cleanDetails.address;
    $window.localStorage.bookDetails = JSON.stringify($scope.storedObj);
  };

  $scope.accessWay = function(access) {
    console.log('access way:', access);
    angular.forEach($scope.accessMethods, function(val) {
      if (access === val.value) {
        val.selected = true;
        if (access === 'Other') {
          vm.otherWay = 'true';
          // $scope.storedObj.accessWay = $scope.cleanDetails.otherAccessWay
          $scope.storedObj.accessWay = '';
          $window.localStorage.bookDetails = JSON.stringify($scope.storedObj);
        } else {
          vm.otherWay = 'false';
          $scope.cleanDetails.accessWay = access;
          $scope.storedObj.accessWay = access;
          $window.localStorage.bookDetails = JSON.stringify($scope.storedObj);
        }
      } else {
        val.selected = false;
      }
    });
  };

  $scope.submitRoomInfo = function() {
    if ($scope.cleanDetails.address && !$scope.storedObj.address) {
      toastr.error('We are not available in your region', 'Error', {
        iconClass: 'toast-error'
      });
    } else if (!$scope.storedObj.address || $scope.storedObj.address === '') {
      toastr.error('please select your address', 'Error', {
        iconClass: 'toast-error'
      });
    } else {
      if (vm.otherWay === 'true') {
        console.log('accessWay if');
        $scope.storedObj.accessWay = $scope.cleanDetails.otherAccessWay;
        $window.localStorage.bookDetails = JSON.stringify($scope.storedObj);
      }
      if (!$scope.storedObj.accessWay || $scope.storedObj.accessWay === '') {
        toastr.error('please enter the access method', 'Error', {
          iconClass: 'toast-error'
        });
      } else {
        if ($scope.cleanDetails.notes) {
          $scope.storedObj.notes = $scope.cleanDetails.notes;
          $window.localStorage.bookDetails = JSON.stringify($scope.storedObj);
        }
        console.log('in submit', $scope.cleanDetails);
        $rootScope.customerdetails.address = $scope.storedObj.apartmentNo + ' ' + $scope.storedObj.address;
        $window.localStorage.priceWithAddOn = $rootScope.customerdetails.price;
        $state.go('home.house-details.payment', {
          'bedCount': $rootScope.customerdetails.bedCount,
          'bathCount': $rootScope.customerdetails.bathCount,
          'price': $rootScope.customerdetails.price,
          'date': $rootScope.customerdetails.date,
          'address': $rootScope.customerdetails.address
        });
      }

    }
  };



}
CleanLocationController.$inject = ['$scope', '$rootScope', '$state', 'PublicService', '$stateParams', '$window', 'toastr'];
module.exports = CleanLocationController;
