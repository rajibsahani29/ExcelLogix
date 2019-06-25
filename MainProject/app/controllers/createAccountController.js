(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("CreateAccountController", ["$scope", "$location", "SMAAlertFactory", "ProjectConstants", "DataService", createAccountController]);

    ////M0027                        07/03/2018           Gimesh        Make it one education and business for create account page .Remove country and add phone number
    function createAccountController($scope, $location, SMAAlertFactory, ProjectConstants, DataService) {

        $scope.AppC.ShowHeader = false;
        $scope.AppC.ShowFooter = false;
        $scope.AppC.ActivePageName = "";

        //var vid = document.getElementsByClassName("bgvid")[0];
        //vid.muted = true;

        /*jshint validthis:true */
        var createA = this;

        //createA.UserName = "userEmail@userEmailServer.com";
        //createA.Password = "Password1";
        //createA.Name = "FirstName MI LastName";
        //createA.SchoolCorporation = "Adams Central";
        //createA.County = "Adams";
        //createA.State = "Indiana";

        createA.UserName = "";
        createA.Password = "";
        createA.Name = "";
        createA.SchoolCorporation = "";
        createA.County = "";
        createA.State = "AL";
        createA.PhoneNumber = "";//M0027

        createA.CheckPassword = checkPassword;
        createA.PasswordValidation = function () { };
        createA.PasswordValidation.ShowMessages = false;
        createA.PasswordValidation.ContainsUppercase = false;
        createA.PasswordValidation.ContainsLowercase = false;
        createA.PasswordValidation.ContainsNumber = false;
        createA.PasswordValidation.ContainsSymbol = false;
        createA.PasswordValidation.ContainsLength = false;
        createA.PasswordValidation.ContainsWhitespace = false;

        //createA.ShowData = showData;
        createA.CreateAccount = checkValidation;

        createA.userClickedButton = null;

        return createA;

        function checkValidation() {
            var phonenumberpattern = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
            if (ProjectConstants.App.IsDownForMaintenance === true) { // quick check to see if the app is offline
                SMAAlertFactory.CreateInfoAlert("Oops!", "iAspire is currently down for maintenance.\n" + "Please try again later.");
            } else {
                if (!createA.UserName || createA.UserName === "") {
                    SMAAlertFactory.CreateInfoAlert("Error", "Invalid email");
                } else if (!createA.Password || createA.Password === "") {
                    SMAAlertFactory.CreateInfoAlert("Error", "Invalid Password.\nMinimum requirements:\nlength 8 - 12 characters\n 1 small character\n1 capital character\n1 number");
                } else if (!createA.Name || createA.Name === "") {
                    SMAAlertFactory.CreateInfoAlert("Error", "Please enter a name");
                } else if (!createA.SchoolCorporation || createA.SchoolCorporation === "") {
                    SMAAlertFactory.CreateInfoAlert("Error", "Please enter a school corporation/Organization");
                }
                //else if (createA.PhoneNumber != "" && phonenumberpattern.test(createA.PhoneNumber) == false) {
                 //   SMAAlertFactory.CreateInfoAlert("Error", "Please enter a valid phone number");
                //}
                    //else if (!createA.County || createA.County === "") {
                    //    SMAAlertFactory.CreateInfoAlert("Error", "Please Enter a county");
                    //}
                else if (!createA.State || createA.State === "") {
                    SMAAlertFactory.CreateInfoAlert("Error", "Please Enter a state");
                } else {
                    createA.userClickedButton = true;
                    //var obj = {
                    //    UserName: createA.UserName,
                    //    Password: createA.Password,
                    //    Name: createA.Name,
                    //    SchoolCorporation: createA.SchoolCorporation,
                    //    County: createA.County,
                    //    State: createA.State,
                    //}
                    var obj = {
                        UserName: createA.UserName,
                        Password: createA.Password,
                        Name: createA.Name,
                        SchoolCorporation: createA.SchoolCorporation,
                        State: '',//M0027
                        PhoneNumber: createA.PhoneNumber  
                    };
                    DataService.createAccount(obj)
                    .success(function (data, status, headers, config) {
                        $scope.AppC.userLogin = createA.UserName;
                        $scope.AppC.userPassword = createA.Password;
                        window.location.hash = "#/login";
                    })
                    .error(function (data, status, headers, config) {
                        console.error(data);
                        if (status === 409) {
                            SMAAlertFactory.CreateInfoAlert("Oops!", "Email is already is use.");
                        } else {
                            SMAAlertFactory.CreateInfoAlert("Oops!", "Something has gone wrong.\n" + "Please try again later.");
                        }
                        createA.userClickedButton = false;
                    });
                }
            }

        }

        function checkPassword(event) {

            //var containsUppercase = /(?=.*[A-Z]).*$/;
            //var containsLowercase = /(?=.*[a-z]).*$/;
            //var containsNumber = /(?=.*[0-9]).*$/;
            //var containsSymbol = /(?=.*[!@#$%^*()_+}{":;'?/<.>,]).*$/;
            //var containsLength = /(^.{8,20}$)/;
            var containsLength = /(?=^.{6,}).*$/;
            var containsWhitespace = /(?=.*[\s]).*$/;

            if (createA.Password) {
                // check for an uppercase letter
                //if (containsUppercase.test(createA.Password) === true) {
                //    createA.PasswordValidation.ContainsUppercase = true;
                //} else {
                //    createA.PasswordValidation.ContainsUppercase = false;
                //}
                //// check for a lowercase letter
                //if (containsLowercase.test(createA.Password) === true) {
                //    createA.PasswordValidation.ContainsLowercase = true;
                //} else {
                //    createA.PasswordValidation.ContainsLowercase = false;
                //}
                //// check for a number
                //if (containsNumber.test(createA.Password) === true) {
                //    createA.PasswordValidation.ContainsNumber = true;
                //} else {
                //    createA.PasswordValidation.ContainsNumber = false;
                //}
                //// check for a symbol
                //if (containsSymbol.test(createA.Password) === true) {
                //    createA.PasswordValidation.ContainsSymbol = true;
                //} else {
                //    createA.PasswordValidation.ContainsSymbol = false;
                //}
                // check for length
                if (containsLength.test(createA.Password) === true) {
                    createA.PasswordValidation.ContainsLength = true;
                } else {
                    createA.PasswordValidation.ContainsLength = false;
                }
                // check for whitespace
                if (containsWhitespace.test(createA.Password) === true) {
                    createA.PasswordValidation.ContainsWhitespace = true;
                } else {
                    createA.PasswordValidation.ContainsWhitespace = false;
                }
                // check all
                //if (createA.PasswordValidation.ContainsUppercase === true &&
                //    createA.PasswordValidation.ContainsLowercase === true &&
                //    createA.PasswordValidation.ContainsNumber === true &&
                //    createA.PasswordValidation.ContainsSymbol === true &&
                //    createA.PasswordValidation.ContainsLength === true &&
                //    createA.PasswordValidation.ContainsWhitespace === false) {
                //    setTimeout(function () {
                //        createA.PasswordValidation.ShowMessages = false;
                //        $scope.$apply();
                //    }, 2000);
                //} else {
                //    createA.PasswordValidation.ShowMessages = true;
                //}
                if (createA.PasswordValidation.ContainsLength === true &&
                    createA.PasswordValidation.ContainsWhitespace === false) {
                    setTimeout(function () {
                        // double check
                        if (createA.PasswordValidation.ContainsLength === true &&
                            createA.PasswordValidation.ContainsWhitespace === false) {
                            createA.PasswordValidation.ShowMessages = false;
                            $scope.$apply();
                        }
                    }, 2000);
                } else {
                    createA.PasswordValidation.ShowMessages = true;
                }
            } else {
                createA.PasswordValidation.ShowMessages = false;
            }
        }

        //function showData() {
        //    console.log(createA.UserName);
        //    if (createA.UserName && createA.UserName.$valid) {
        //        console.log(createA.UserName.$valid);
        //    }
        //    if (createA.UserName && createA.UserName.$error) {
        //        console.log(createA.UserName.$error);
        //    }
        //    console.log(createA.Password);
        //    if (createA.Password &&createA.Password.$valid) {
        //        console.log(createA.Password.$valid);
        //    }
        //    if (createA.Password &&createA.Password.$error) {
        //        console.log(createA.Password.$error);
        //    }
        //    console.log(createA);
        //}
    }

})();