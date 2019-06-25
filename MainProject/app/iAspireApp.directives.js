(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .directive("iaspemailvalidation", emailValidation)
        .directive("passwordvalidation", passwordValidation)
        .directive("removengemailvalidation", removeNgEmailValidation)
        .directive("removengdatevalidation", removeNgDateValidation)
        .directive("datepicker", datepicker)
        .directive("datetimepicker", datetimepicker)
        .directive("expand", expand)
        .directive('restrictInput', restrictInput);
    

    //M0014
    function expand() {
        function link(scope, element, attrs) {
            scope.$on('onExpandAll', function (event, args) {
                scope.expanded = args.expanded;
            });
        }
        return {
            link: link
        };
    }


    //M0027 
    function restrictInput() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    var options = scope.$eval(attr.restrictInput);
                    if (!options.regex && options.type) {
                        switch (options.type) {
                            case 'digitsOnly': options.regex = '^[0-9]*$'; break;
                            case 'lettersOnly': options.regex = '^[a-zA-Z]*$'; break;
                            case 'lowercaseLettersOnly': options.regex = '^[a-z]*$'; break;
                            case 'uppercaseLettersOnly': options.regex = '^[A-Z]*$'; break;
                            case 'lettersAndDigitsOnly': options.regex = '^[a-zA-Z0-9]*$'; break;
                            case 'validPhoneCharsOnly': options.regex = '^[0-9 ()/-]*$'; break;
                            default: options.regex = '';
                        }
                    }
                    var reg = new RegExp(options.regex);
                    if (reg.test(viewValue)) { //if valid view value, return it
                        return viewValue;
                    } else { //if not valid view value, use the model value (or empty string if that's also invalid)
                        var overrideValue = (reg.test(ctrl.$modelValue) ? ctrl.$modelValue : '');
                        element.val(overrideValue);
                        return overrideValue;
                    }
                });
            }
        };
    }

    function emailValidation() {
        var emailRegEx = /([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {
                var validator = function (value) {
                    ctrl.$setValidity('iaspemailvalidation', emailRegEx.test(value));
                    return value;
                };
                ctrl.$parsers.unshift(validator);
                ctrl.$formatters.unshift(validator);
            }
        };
    }

    function passwordValidation() {
        //var passwordRegEx = /(?=^.{8,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/;
        //var passwordRegEx = /(?=^.{8,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^*()_+}{":;'?/<.>,])(?!.*\s).*$/;
        var passwordRegEx = /(?=^.{6,}$)(?!.*\s).*$/; // 6 or more characters and no spaces
        return {
            require: 'ngModel',
            restrict: '',
            link: function (scope, elm, attrs, ctrl) {
                var validator = function (value) {
                    ctrl.$setValidity('passwordvalidation', passwordRegEx.test(value));
                    return value;
                };
                ctrl.$parsers.unshift(validator);
                ctrl.$formatters.unshift(validator);
            }
        };
    }

    function removeNgEmailValidation() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$validators.email = function () {
                    return true;
                };
            }
        };
    }

    function removeNgDateValidation() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$validators.date = function () {
                    return true;
                };
            }
        };
    }

    function datepicker() {
        return {
            restrict: 'A',
            require: 'ngModel',
            transclude: true,
            link: function (scope, element, attrs, ngModelCtrl) {
                setTimeout(function () {
                    element.datepicker({
                        dateFormat: 'MM dd, yy',
                        onSelect: function (date) {
                            scope.$parent.$parent.q.SelectedOption = date;
                            scope.$apply();
                        }
                    });
                });
            }
        };
    }

    function datetimepicker() {
        return {
            restrict: 'A',
            require: 'ngModel',
            transclude: true,
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!Modernizr.inputtypes["datetime-local"]) {
                    setTimeout(function () {
                        //var momentFormatDate = 'MM/DD/YYYY';
                        var momentFormatDate = 'YYYY-MM-DD';
                        //var momentFormatTime = 'h:mm a';
                        element.datetimepicker({
                            //format: momentFormatDate + ' ' + momentFormatTime,
                            format: momentFormatDate,
                            formatDate: momentFormatDate,
                            //formatTime: momentFormatTime,
                            timepicker: false,
                            onChangeDateTime: function (currentTime, selectedTime) {
                                //scope.value = selectedTime;
                                scope.value = moment(selectedTime, momentFormatDate).format(momentFormatDate);
                                scope.$apply();
                            }
                        });
                        scope.$apply();
                    });
                } else {
                    $(element).attr("type", "date");
                }
            }
        };
    }

})();