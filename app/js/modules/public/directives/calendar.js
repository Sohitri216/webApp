'use strict';

var calendar = function($rootScope, PublicService, $window, $stateParams, $state) {
  return {

    restrict: 'AEC',
    template: require('../templates/calendar.html'),
    scope: {
      selected: '=',
      off: '='
    },
    link: function(scope) {
      console.log('Off in directive:', scope.off);
      // scope.currentPrice = $rootScope.customerdetails.price;
      scope.fetchSlot = function(slotCreds) {
        var isToday;
        console.log('In slot creds::::::', slotCreds);
        if (new Date(slotCreds.startTime).toDateString() === new Date().toDateString()) {
          isToday = true;
          var currentTime = new Date().getHours();
        } else {
          console.log('Not today');
          isToday = false;
        }
        scope.timeSlot = [];
        PublicService.getFreeSlot(slotCreds).then(function(res) {
          console.log('response:', res);
          if (res.data) {
            $rootScope.dateSelected = 'true';
            $rootScope.controlBackgroundImage = true;
            var slotData = res.data;
            // console.log(slotData);
            for (var each in slotData) {
              if (slotData.hasOwnProperty(each)) {
                // console.log('each obj:', slotData[each]);
                // if (slotData[each] >= 9 && slotData[each] <= 21) {
                var eachObj = {};
                console.log('In if', currentTime, slotData[each]);
                if (isToday && currentTime < Number(slotData[each].id)) {
                  if (slotData[each].id > 12) {
                    eachObj.time = (slotData[each].id - 12) + ':00 pm';
                  } else {
                    eachObj.time = slotData[each].id + ':00 am';
                  }
                  // eachObj.time = slotData[each] + ':00';
                  if ($window.localStorage.selectedSlot && eachObj.time === $window.localStorage.selectedSlot) {
                    eachObj.selected = true;
                  } else {
                    eachObj.selected = false;
                  }
                  eachObj.status=slotData[each].status;
                  scope.timeSlot.push(eachObj);
                } else if (!isToday) {
                  console.log('in else not today');
                  if (slotData[each].id > 12) {
                    eachObj.time = (slotData[each].id - 12) + ':00 pm';
                  } else {
                    eachObj.time = slotData[each].id + ':00 am';
                  }
                  // eachObj.time = slotData[each] + ':00';
                  if ($window.localStorage.selectedSlot && eachObj.time === $window.localStorage.selectedSlot) {
                    eachObj.selected = true;
                  } else {
                    eachObj.selected = false;
                  }
                  eachObj.status=slotData[each].status;
                  scope.timeSlot.push(eachObj);
                }

                // }
              }
            }
            // console.log('===============================', eachObj,scope.timeSlot, scope.timeSlot.length, Object.keys(eachObj).length);
            if (typeof eachObj == 'undefined' || Object.keys(eachObj).length === 0) { // jshint ignore:line
              $rootScope.notAvailable = true;
              $rootScope.dateSelected = 'false';
              $rootScope.controlBackgroundImage = false;
              $rootScope.timeSlot = '';
            }
            // console.log('Time Slot:', scope.timeSlot);
            $rootScope.timeSlot = scope.timeSlot;
          } else {
            console.log('no data');
            $rootScope.notAvailable = true;
            $rootScope.dateSelected = 'false';
            $rootScope.controlBackgroundImage = false;
            $rootScope.timeSlot = '';
          }
        }, function(err) {
          console.log('Err:', err);
        });
      };
      scope.storedObj = JSON.parse($window.localStorage.bookDetails);
      if (scope.storedObj.service_start_time) { // jshint ignore:line
        var mDate = $window.localStorage.selectedDate;
        var isoDateFormat = new Date(mDate).toISOString();
        var getTime = scope.storedObj.service_start_time.split(' ')[0]; // jshint ignore:line
        console.log('time init:', getTime);
        var dateB = moment(isoDateFormat); // jshint ignore:line
        console.log('Date init:', dateB);
        scope.selected = dateB;
        var getSlotCreds = {
          bedroom: $rootScope.customerdetails.bedCount,
          bathroom: $rootScope.customerdetails.bathCount,
          startTime: getTime
        };
        console.log('get Slot Time', getSlotCreds);
        scope.fetchSlot(getSlotCreds);
        console.log('This is where we set base price');
        if ($window.localStorage.setPrice) {
          scope.currentPrice = $window.localStorage.setPrice;
          console.log('Current Price', scope.currentPrice);
        }
      } else {
        console.log('first time');
        scope.currentPrice = $rootScope.customerdetails.price;
      }

      function _removeTime(date) {
        console.log('In remove time', date);
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
      }

      function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
          var today = new Date();
          today.setHours(0, 0, 0, 0);
          // console.log(date.toDate());
          var currentDate = date.toDate();
          var disable;
          if (currentDate < today) {
            disable = true;
          } else {
            disable = false;
          }
          // if(scope.off[i].day_price==='0% off'){
          //     var offerRate=''
          // }
          // console.log('test:', scope.off[i]);
          days.push({
            name: date.format('dd').substring(0, 1),
            number: date.date(),
            isCurrentMonth: date.month() === month.month(),
            isToday: date.isSame(new Date(), 'day'),
            date: date,
            disable: disable,
            off: scope.off[i].day_price // jshint ignore:line
          });
          date = date.clone();
          date.add(1, 'd');
        }
        return days;
      }

      function calculateOfferPrice(val) {

        // $rootScope.customerdetails.price = scope.currentPrice - ((scope.currentPrice * val) / 100);
        $rootScope.customerdetails.price = scope.currentPrice - Number(val);
        $stateParams.price = $rootScope.customerdetails.price;
        console.log('stateparam:', $stateParams.price);
        $state.go('home.house-details.date-time-slot', {
          'bedCount': $rootScope.customerdetails.bedCount,
          'bathCount': $rootScope.customerdetails.bathCount,
          'price': $rootScope.customerdetails.price
        }, { notify: false });
      }

      scope.changeColor = function(person, bool) {
        if (bool === true) {
          person.hover = true;
        } else if (bool === false) {
          person.hover = false;
        }
      };

      function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false,
          date = start.clone(),
          monthIndex = date.month(),
          count = 0;
        while (!done) {
          scope.weeks.push({ days: _buildWeek(date.clone(), month) });
          date.add(1, 'w');
          done = count++ > 2 && monthIndex !== date.month();
          monthIndex = date.month();
        }
        console.log('weeks:', scope.weeks);
      }

      console.log('in link');
      // scope.selected = _removeTime(scope.selected || moment()); // jshint ignore:line
      // scope.selected = moment(); // jshint ignore:line
      console.log('This selected:', scope.selected);
      scope.month = scope.selected.clone();
      var start = scope.selected.clone();
      start.date(1);
      _removeTime(start.day(0));

      _buildMonth(scope, start, scope.month);


      scope.select = function(day) {
        if (!day.disable && day.isCurrentMonth) {
          console.log('Selected day:', day.date.toDate(), day.off);
          //Off calculation
          // var offPercent = day.off.split('%')[0];
          // var offPercent = day.off.split('$')[0];
          var offPercent=day.off;
          console.log('off =================$:', day.off.split(' '),offPercent);
          if (offPercent > '0') {
            console.log('if');
            calculateOfferPrice(offPercent);
          } else {
            console.log('else');
            $rootScope.customerdetails.price = scope.currentPrice;
            $stateParams.price = $rootScope.customerdetails.price;
            // $state.go('home.house-details.date-time-slot', { param: newvalue }, notify: false);
            $state.go('home.house-details.date-time-slot', {
              'bedCount': $rootScope.customerdetails.bedCount,
              'bathCount': $rootScope.customerdetails.bathCount,
              'price': $rootScope.customerdetails.price
            }, { notify: false });
          }
          if (scope.storedObj.service_start_time) { // jshint ignore:line
            $window.localStorage.dateChangeFlagNotFirstTime = true;
          }
          if ($window.localStorage.priceWithAddOn) {
            delete $window.localStorage.priceWithAddOn;
          }
          scope.selected = day.date;
          $window.localStorage.selectedDate = day.date;
          var dateFormat = day.date.toDate();
          var reqMonth, reqDay;
          console.log('Date:', dateFormat);
          if ((dateFormat.getMonth() + 1).toString().length === 1) {
            console.log('date formation--->>', dateFormat.getMonth().toString());
            reqMonth = dateFormat.getMonth() + 1;
            reqMonth = '0' + reqMonth;
          } else {
            console.log('date formation--->>', dateFormat.getMonth().toString().length);
            reqMonth = dateFormat.getMonth() + 1;
          }
          console.log('day today:', dateFormat.getDate().toString().length, dateFormat.getDate());
          if (dateFormat.getDate().toString().length === 1) {
            reqDay = '0' + dateFormat.getDate();
          } else {
            reqDay = dateFormat.getDate();
          }
          dateFormat = dateFormat.getFullYear() + '-' + reqMonth + '-' + reqDay;
          console.log('Date:', dateFormat);
          if ($window.localStorage.selectedSlot) {
            delete $window.localStorage.selectedSlot;
          }
          var slotCreds = {
            bedroom: $rootScope.customerdetails.bedCount,
            bathroom: $rootScope.customerdetails.bathCount,
            startTime: dateFormat
          };


          console.log('backend send:', slotCreds);
          var storedObj = JSON.parse($window.localStorage.bookDetails);
          storedObj.service_start_time = slotCreds.startTime; // jshint ignore:line
          $window.localStorage.bookDetails = JSON.stringify(storedObj);
          console.log('store locally:', $window.localStorage.bookDetails);
          scope.fetchSlot(slotCreds);
          // scope.timeSlot = [{
          //     time: '01:00 am',
          //     selected: false
          // }, {
          //     time: '02:00 am',
          //     selected: false
          // }, {
          //     time: '03:00 am',
          //     selected: false
          // }, {
          //     time: '04:00 am',
          //     selected: false
          // }, {
          //     time: '05:00 am',
          //     selected: false
          // }];

        } else {
          console.log('Disabled');
        }

      };

      scope.next = function() {
        var next = scope.month.clone();
        _removeTime(next.month(next.month() + 1).date(1));
        scope.month.month(scope.month.month() + 1);
        _buildMonth(scope, next, scope.month);
      };

      scope.previous = function() {
        var previous = scope.month.clone();
        // console.log('in previous:', previous, previous.month(previous.month() - 1).date(1));
        _removeTime(previous.month(previous.month() - 1).date(1));
        scope.month.month(scope.month.month() - 1);
        _buildMonth(scope, previous, scope.month);
      };
    }
  };
};

calendar.$inject = ['$rootScope', 'PublicService', '$window', '$stateParams', '$state'];
module.exports = calendar;
