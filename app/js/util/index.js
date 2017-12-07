'use strict';

function getDateString(config) {
    var date = new Date(config.date),
        dateObject, months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];


    dateObject = {
        dd: date.getDate(),
        mm: date.getMonth() + 1,
        yy: date.getFullYear(),
        HH: date.getHours(),
        MN: date.getMinutes(),
        SS: date.getSeconds(),
    };

    if (dateObject.HH > 11) {
        dateObject.hh = 12 + dateObject.HH - 24;
        dateObject.AMPM = 'PM';
    } else {
        dateObject.hh = dateObject.HH;
        dateObject.AMPM = 'AM';
    }

    //find occurance of A exactly 1 times
    if (!/A{2}/i.test(config.format)) {
        config.format = config.format.replace(/A/ig, dateObject.AMPM);
    }

    //find occurance of s at least one and not more than 2
    if (/s+/i.test(config.format) && !(/s{3}/i.test(config.format))) {
        if (/s{2}/i.test(config.format)) {
            //find occurance of s exactly 2 times
            config.format = config.format.replace(/ss/ig, dateObject.SS > 9 ? dateObject.SS : '0' + dateObject.SS);
        } else {
            //find occurance of s exactly 1 times
            config.format = config.format.replace(/s/ig, dateObject.SS);
        }
    }

    //find occurance of h at least one and not more than 2
    if (/h+/.test(config.format) && !(/h{3}/.test(config.format))) {
        if (/h{2}/.test(config.format)) {
            //find occurance of h exactly 2 times
            config.format = config.format.replace(/hh/g, dateObject.hh > 9 ? dateObject.hh : '0' + dateObject.hh);
        } else {
            //find occurance of h exactly 1 times
            config.format = config.format.replace(/h/g, dateObject.hh);
        }
    }

    //find occurance of H at least one and not more than 2
    if (/H+/.test(config.format) && !(/H{3}/.test(config.format))) {
        if (/H{2}/.test(config.format)) {
            //find occurance of H exactly 2 times
            config.format = config.format.replace(/HH/g, dateObject.HH > 9 ? dateObject.HH : '0' + dateObject.HH);
        } else {
            //find occurance of H exactly 1 times
            config.format = config.format.replace(/HH/g, dateObject.HH);
        }
    }

    //find occurance of T at least one and not more than 2
    if (/T+/ig.test(config.format) && !(/T{3}/ig.test(config.format))) {
        if (/T{2}/i.test(config.format)) {
            //find occurance of T exactly 2 times
            config.format = config.format.replace(/tt/ig, dateObject.MN > 9 ? dateObject.MN : '0' + dateObject.MN);
        } else {
            //find occurance of T exactly 1 times
            config.format = config.format.replace(/t/ig, dateObject.MN);
        }
    }

    //find occurance of d at least one and not more than 2
    if (/d+/i.test(config.format) && !(/d{3}/i.test(config.format))) {
        if (/d{2}/i.test(config.format)) {
            //find occurance of d exactly 2 times
            config.format = config.format.replace(/dd/ig, dateObject.dd > 9 ? dateObject.dd : '0' + dateObject.dd);
        } else {
            //find occurance of d exactly 1 times
            config.format = config.format.replace(/d/ig, dateObject.dd);
        }
    }

    //find occurance of y atleast 2 times
    if (/y+/i.test(config.format) && !(/y{5}/i.test(config.format))) {
        //find occurance of y exactly 4 times
        if (/y{4}/i.test(config.format)) {
            config.format = config.format.replace(/yyyy/ig, dateObject.yy);
        } else if (!/y{3,}/i.test(config.format)) {
            //find occurance of y not exactly 3 times i.e 2 times
            config.format = config.format.replace(/yy/ig, dateObject.yy.toString().substring(2));
        }
    }

    //find occurance of m at least one and not more than 3
    if (/m+/i.test(config.format) && !(/m{4}/i.test(config.format))) {
        if (/m{3}/.test(config.format)) {
            //find occurance of m exactly 3 times
            config.format = config.format.replace(/mmm/ig, months[dateObject.mm - 1].toLowerCase());
        } else if (/M{3}/.test(config.format)) {
            //find occurance of M exactly 3 times
            config.format = config.format.replace(/MMM/ig, months[dateObject.mm].toUpperCase());
        } else if (/m{2,}/i.test(config.format)) {
            //find occurance of m exactly 2 times
            config.format = config.format.replace(/m{2,}/ig, dateObject.mm > 9 ? dateObject.mm : '0' + (dateObject.mm));
        } else {
            //find occurance of m exactly 1 times
            config.format = config.format.replace(/m{1,}/g, dateObject.mm);
        }
    }

    return config.format;
}

module.exports = angular
    .module('angular-ui-validator', [])
    .directive('uiForm', function() {
        return {
            controller: ['$scope', function($scope) {
                this.reset = function(modelKey) {
                    $scope[modelKey] = null;
                    $scope.$apply();
                };
            }],
            link: function(scope, element, attrs, controller) {

                element.on('reset', function() {
                    var children = element[0].children;
                    for (var key in children) {
                        switch (children[key].type) {
                            case 'text':
                            case 'url':
                            case 'email':
                            case 'password':
                            case 'number':
                            case 'tel':
                                if (children[key].attributes['ng-model']) {
                                    controller.reset(children[key].attributes['ng-model'].value);
                                    break;
                                }
                        }
                    }
                });

                element.on('submit', function() {
                    if (scope[attrs.name].$invalid) {
                        var error = scope[attrs.name].$error;
                        // console.log(error);
                        for (var i in error) {
                            error[i].forEach(function(each) {
                                each.$setDirty();
                            });
                        }
                        element.removeClass('ng-submitted');
                        scope[attrs.name].$submitted = false;
                        scope.$apply();
                    } else {
                        var submitFunction = scope[attrs.uiForm];
                        if (submitFunction && typeof submitFunction === 'function') {
                            submitFunction();
                        }
                    }
                });

            },
            restrict: 'A'
        };
    })
    .directive('uiRequired', function() {
        return {
            link: uiRequired,
            // scope: true,
            restrict: 'A',
            require: 'ngModel',
            priority: 90
        };
    })
    .directive('uiPattern', function() {
        return {
            link: uiPattern,
            restrict: 'A',
            scope: {
                uiPattern: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiEmail', function() {
        return {
            link: uiEmail,
            restrict: 'A',
            scope: true,
            require: 'ngModel',
            priority: 80
        };
    })
    .directive('uiUrl', function() {
        return {
            link: uiUrl,
            restrict: 'A',
            scope: true,
            require: 'ngModel'

        };
    })
    .directive('uiMinlength', function() {
        return {
            link: uiMinlength,
            restrict: 'A',
            scope: {
                uiMinlength: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiMaxlength', function() {
        return {
            link: uiMaxlength,
            restrict: 'A',
            scope: {
                uiMaxlength: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiLength', function() {
        return {
            link: uiLength,
            restrict: 'A',
            scope: {
                uiLength: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiAlphanum', function() {
        return {
            link: uiAlphanum,
            restrict: 'A',
            scope: true,
            require: 'ngModel'

        };
    })
    .directive('uiMinwords', function() {
        return {
            link: uiMinwords,
            restrict: 'A',
            scope: {
                uiMinwords: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiMaxwords', function() {
        return {
            link: uiMaxwords,
            restrict: 'A',
            scope: {
                uiMaxwords: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiWords', function() {
        return {
            link: uiWords,
            restrict: 'A',
            scope: {
                uiWords: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiEqualto', function() {
        return {
            link: uiEqualto,
            restrict: 'A',
            scope: {
                uiEqualto: '='
            },
            require: 'ngModel',
            priority: 50
        };
    })
    .directive('uiDigits', function() {
        return {
            link: uiDigits,
            restrict: 'A',
            scope: true,
            require: 'ngModel'

        };
    })
    .directive('uiMin', function() {
        return {
            link: uiMin,
            restrict: 'A',
            scope: {
                uiMin: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiMax', function() {
        return {
            link: uiMax,
            restrict: 'A',
            scope: {
                uiMax: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiRange', function() {
        return {
            link: uiRange,
            restrict: 'A',
            scope: {
                uiRange: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiMinDate', function() {
        return {
            link: uiMinDate,
            restrict: 'A',
            scope: {
                uiMinDate: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiMaxDate', function() {
        return {
            link: uiMaxDate,
            restrict: 'A',
            scope: {
                uiMaxDate: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiBetween', function() {
        return {
            link: uiBetween,
            restrict: 'A',
            scope: {
                uiBetween: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiInteger', function() {
        return {
            link: uiInteger,
            restrict: 'A',
            scope: {
                uiInteger: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiFloat', function() {
        return {
            link: uiFloat,
            restrict: 'A',
            scope: {
                uiFloat: '='
            },
            require: 'ngModel'

        };
    })
    .directive('uiNumber', function() {
        return {
            link: function(scope, element, attrs) {
                element.on('keydown', function(ev) {
                    switch (ev.keyCode) {
                        case 48:
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                        case 55:
                        case 56:
                        case 57:
                        case 96:
                        case 97:
                        case 98:
                        case 99:
                        case 100:
                        case 101:
                        case 102:
                        case 103:
                        case 104:
                        case 105:
                        case 8:
                        case 9:
                        case 13:
                            break;
                        case 190:
                            if (!attrs.uiNumber)
                                ev.preventDefault();
                            break;
                        default:
                            ev.preventDefault();
                            break;
                    }
                });
            },
            restrict: 'A',
            priority: 99
        };
    })
    .directive('uiAllowedUpto', function() {
        return {
            link: function(scope, element, attrs) {
                attrs.uiAllowedUpto = Number(attrs.uiAllowedUpto);
                if (!isNaN(attrs.uiAllowedUpto)) {

                    element.on('keydown', function(ev) {

                        switch (ev.keyCode) {
                            case 8:
                            case 9:
                            case 13:
                                break;
                            default:
                                if (element.val().length >= attrs.uiAllowedUpto) {
                                    ev.preventDefault();
                                }
                                break;
                        }

                    });

                }
            },
            restrict: 'A',
            priority: 95
        };
    })
    .directive('uiFormattedDate', function() {
        return {
            link: function(scope, element, attrs) {
                element.on('change', function() {
                    element.val(getDateString({
                        date: element.val(),
                        format: attrs.uiFormattedDate
                    }));
                });
            },
            restrict: 'A'
        };
    })
    .directive('uiExactLength', function() {
        return {
            link: function(scope, element, attrs, ngModel) {
                init(element, ngModel);
                ngModel.$parsers.push(function(viewValue) {
                    var flag = evaluateRegExp(scope.uiPattern, viewValue);

                    ngModel.$setValidity('uiPattern', flag);

                    if (flag) {
                        return viewValue;
                    }
                });
            },
            restrict: 'A',
            priority: 95,
            scope: {
                uiExactLength: '='
            },
            require: 'ngModel'
        };
    })

function evaluateRegExp(regExp, value) {
    return new RegExp(regExp || '').test(value);
}

function countWords(value) {
    return value.match(/\S/g).length;
}

function compare(target, source) {
    if (target === source) {
        return 0;
    }

    if (target > source) {
        return 1;
    }

    return -1;
}


function init(element, ngModel) {
    ngModel.$setUntouched();
    ngModel.$setPristine();
}

function uiRequired(scope, element, attrs, ngModel) { //here is the model
    init(element, ngModel);


    ngModel.$validators.uiRequired = function(modelValue, viewValue) {
        var value = modelValue || viewValue;
        return value ? true : false;
    };
}

function uiPattern(scope, element, attrs, ngModel) {

    init(element, ngModel);
    ngModel.$parsers.push(function(viewValue) {
        var flag = evaluateRegExp(scope.uiPattern, viewValue);

        ngModel.$setValidity('uiPattern', flag);

        if (flag) {
            return viewValue;
        }

    });
}

function uiEmail(scope, element, attrs, ngModel) {

    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = evaluateRegExp(/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/, viewValue);

            ngModel.$setValidity('uiEmail', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });
}

function uiUrl(scope, element, attrs, ngModel) {
    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = evaluateRegExp(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/, viewValue);

            ngModel.$setValidity('uiUrl', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });
}

function uiMinlength(scope, element, attrs, ngModel) {
    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = true;

            if (viewValue) {
                flag = evaluateRegExp('^.{' + scope.uiMinlength + ',}$', viewValue);
            }

            ngModel.$setValidity('uiMinLength', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });
}

function uiMaxlength(scope, element, attrs, ngModel) {
    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = evaluateRegExp('^.{0,' + scope.uiMaxlength + '}$', viewValue);

            ngModel.$setValidity('uiMaxLength', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });
}

function uiLength(scope, element, attrs, ngModel) {

    init(element, ngModel);

    if (typeof scope.uiLength === 'object') {

        if (Array.isArray(scope.uiLength) && scope.uiLength.length === 2) {
            scope.uiLength.min = scope.uiLength[0] < scope.uiLength[1] ? scope.uiLength[0] : scope.uiLength[1];
            scope.uiLength.max = scope.uiLength[0] > scope.uiLength[1] ? scope.uiLength[0] : scope.uiLength[1];
        }

        ngModel.$parsers.push(function(viewValue) {
            if (viewValue) {
                var flag = true;

                if (viewValue) {
                    flag = evaluateRegExp('^.{' + scope.uiLength.min + ',' + scope.uiLength.max + '}$', viewValue);
                }

                ngModel.$setValidity('uiLength', flag);

                if (flag) {
                    return viewValue;
                }
            } else {
                return viewValue;
            }
        });
    }
}

function uiEqualto(scope, element, attrs, ngModel) {

    init(element, ngModel);

    // ngModel.$parsers.push(function(viewValue) {

    //     var flag = true;
    //     console.log('parser', ngModel);
    //     if (viewValue) {
    //         flag = compare(viewValue, scope.uiEqualto) === 0 ? true : false;

    //         ngModel.$setValidity('uiEqualto', flag);

    //         if (flag) {
    //             return viewValue;
    //         }
    //     } else {
    //         return viewValue;
    //     }

    // });

    ngModel.$validators.uiEqualto = function(modelValue) {
        return modelValue == scope.uiEqualto;

    };

    scope.$watch("uiEqualto", function() {
        ngModel.$validate();
    });
}

function uiAlphanum(scope, element, attrs, ngModel) {

    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = true;

            if (viewValue) {
                flag = evaluateRegExp(/^[a-zA-Z0-9]+$/, viewValue);
            }

            ngModel.$setValidity('uiAlphanum', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });

}

function uiMinwords(scope, element, attrs, ngModel) {

    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = true;

            if (viewValue) {
                flag = compare(countWords(viewValue), (scope.uiMinwords || 0)) > -1 ? true : false;
            }

            ngModel.$setValidity('uiMinWords', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }

    });

}

function uiMaxwords(scope, element, attrs, ngModel) {

    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {

        if (viewValue) {
            var flag = true;

            if (viewValue) {
                flag = compare(countWords(viewValue), scope.uiMaxwords) === 1 ? false : true;
            }

            ngModel.$setValidity('uiMaxWords', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });

}

function uiWords(scope, element, attrs, ngModel) {

    init(element, ngModel);

    if (typeof scope.uiWords === 'object') {

        if (Array.isArray(scope.uiWords) && scope.uiWords.length === 2) {
            scope.uiWords.minWords =
                scope.uiWords[0] < scope.uiWords[1] ? scope.uiWords[0] : scope.uiWords[1];
            scope.uiWords.maxWords =
                scope.uiWords[0] > scope.uiWords[1] ? scope.uiWords[0] : scope.uiWords[1];
        }

        ngModel.$parsers.push(function(viewValue) {
            if (viewValue) {
                var flag = true,
                    totalWords;

                if (viewValue) {
                    totalWords = countWords(viewValue);
                    flag = compare(totalWords >= scope.uiWords.minWords) &&
                        compare(totalWords <= scope.uiWords.minWords);
                }

                ngModel.$setValidity('uiWords', flag);

                if (flag) {
                    return viewValue;
                }
            } else {
                return viewValue;
            }
        });
    }
}

function uiDigits(scope, element, attrs, ngModel) {
    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = evaluateRegExp(/^\d{1,}$/, viewValue);
            ngModel.$setValidity('uiDigits', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });
}

function uiInteger(scope, element, attrs, ngModel) {
    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = evaluateRegExp(/^\d+$/, viewValue);
            ngModel.$setValidity('uiInteger', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });
}

function uiFloat(scope, element, attrs, ngModel) {
    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = evaluateRegExp(/^\d+.\d+$/, viewValue);
            // var flag = evaluateRegExp(/^-?(\d+\.?\d+)$|(\d*\.?\d+)$/, viewValue);
            ngModel.$setValidity('uiFloat', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });
}

function uiMin(scope, element, attrs, ngModel) {
    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {

        if (viewValue) {
            var flag = Number(viewValue) >= scope.uiMin ? true : false;

            ngModel.$setValidity('uiMin', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });
}

function uiMax(scope, element, attrs, ngModel) {
    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = Number(viewValue) <= scope.uiMax ? true : false;

            ngModel.$setValidity('uiMax', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }
    });
}

function uiRange(scope, element, attrs, ngModel) {
    init(element, ngModel);

    if (typeof scope.uiRange === 'object') {

        if (Array.isArray(scope.uiRange) && scope.uiRange.length === 2) {
            scope.uiRange.min = scope.uiRange[0] < scope.uiRange[1] ? scope.uiRange[0] : scope.uiRange[1];
            scope.uiRange.max = scope.uiRange[0] > scope.uiRange[1] ? scope.uiRange[0] : scope.uiRange[1];
        }

        ngModel.$parsers.push(function(viewValue) {
            if (viewValue) {
                var temp = Number(viewValue);

                var flag = (temp >= scope.uiRange.min) && (temp <= scope.uiRange.max) ? true : false;

                ngModel.$setValidity('uiRange', flag);

                if (flag) {
                    return viewValue;
                }
            } else {
                return viewValue;
            }

        });
    }
}

function uiMinDate(scope, element, attrs, ngModel) {

    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = compare(new Date(viewValue), new Date(scope.uiMinDate)) > -1 ? true : false;

            ngModel.$setValidity('uiMinDate', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }

    });

}

function uiMaxDate(scope, element, attrs, ngModel) {
    init(element, ngModel);

    ngModel.$parsers.push(function(viewValue) {
        if (viewValue) {
            var flag = compare(new Date(viewValue), new Date(scope.uiMaxDate)) != 1 ? true : false;

            ngModel.$setValidity('uiMaxDate', flag);

            if (flag) {
                return viewValue;
            }
        } else {
            return viewValue;
        }

    });
}

function uiBetween(scope, element, attrs, ngModel) {
    init(element, ngModel);

    if (typeof scope.uiBetween === 'object') {

        if (Array.isArray(scope.uiBetween) && scope.uiBetween.length === 2) {
            scope.uiBetween.minBetween =
                scope.uiBetween[0] < scope.uiBetween[1] ? scope.uiBetween[0] : scope.uiBetween[1];
            scope.uiBetween.maxBetween =
                scope.uiBetween[0] > scope.uiBetween[1] ? scope.uiBetween[0] : scope.uiBetween[1];
        }

        ngModel.$parsers.push(function(viewValue) {

            if (viewValue) {

                var flag = true;

                flag = compare(new Date(viewValue), new Date(scope.uiBetween.minBetween)) > -1 &&
                    compare(new Date(viewValue), new Date(scope.uiBetween.maxBetween)) < 1;

                ngModel.$setValidity('uiBetween', flag);

                if (flag) {
                    return viewValue;
                }
            } else {
                return viewValue;
            }

        });
    }
}
