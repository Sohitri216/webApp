'use strict';

var calendar = function() {
    return {

        restrict: 'AEC',
        template: require('../templates/calendar.html'),
        scope: {
            selected: '=',
            off: '=',
            getSlot: '=',
            selectedDay: '='
        },
        link: function(scope) {
            if (scope.selectedDay) {
                console.log('From local storage date');
                scope.selected = moment(scope.selectedDay); // jshint ignore:line
                console.log(scope.selected, scope.selectedDay);
            }

            function _removeTime(date) {
                console.log('In remove time', date);
                return date.day(0).hour(0).minute(0).second(0).millisecond(0);
            }

            function _buildWeek(date, month) {
                var days = [],
                    offPrice;
                for (var i = 0; i < 7; i++) {
                    var today = new Date();
                    today.setHours(0, 0, 0, 0);
                    // console.log(date.toDate());
                    var currentDate = date.toDate();
                    var disable, sundayClosed;
                    if (currentDate < today) {
                        disable = true;
                        sundayClosed = false;
                    } else if (currentDate > today && date.toDate().toString().split(' ')[0] === 'Sun') {
                        disable = true;
                        sundayClosed = true;
                    } else {
                        disable = false;
                        sundayClosed = false;
                    }
                    // if(date.toDate().toString().split(' ')[0]==='Sun')
                    // if(scope.off[i].day_price==='0% off'){
                    //     var offerRate=''
                    // }
                    console.log('test:', date.toDate().toString().split(' ')[0]);
                    console.log('off price:', scope.off[i]);
                    if (typeof(scope.off[i]) === 'undefined') {
                        console.log('In undefined');
                        offPrice = 'Closed on Sunday';
                    } else if (scope.off[i].day_price) { // jshint ignore:line
                        offPrice = scope.off[i].day_price; // jshint ignore:line
                    }
                    days.push({
                        name: date.format('dd').substring(0, 1),
                        number: date.date(),
                        isCurrentMonth: date.month() === month.month(),
                        isToday: date.isSame(new Date(), 'day'),
                        date: date,
                        disable: disable,
                        sundayClosed: sundayClosed,
                        // off: scope.off[i].day_price // jshint ignore:line
                        off: offPrice // jshint ignore:line
                    });
                    date = date.clone();
                    date.add(1, 'd');
                }
                return days;
            }

            scope.changeColor = function(person, bool) {
                if (bool === true) {
                    person.hover = true;
                } else if (bool === false) {
                    person.hover = false;
                }
            };

            function _buildMonth(scope, start, month) {
                // if (month.isSame(scope.selected.clone())) {

                // }
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
            console.log('This selected:', scope.selected);
            scope.month = scope.selected.clone();
            var start = scope.selected.clone();
            start.date(1);
            _removeTime(start.day(0));

            _buildMonth(scope, start, scope.month);

            scope.select = function(day) {
                console.log('in select ', day.date.toDate(), day);
                if (day.date.toDate().toString().split(' ')[0] !== 'Sun') {
                    if (!day.disable && day.isCurrentMonth) {
                        scope.selected = day.date;
                        scope.getSlot(day.date.toDate(), day);
                    }
                } else {
                    console.log('Sunday Off');
                    // scope.getSlot(day.date.toDate(), day, true);
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