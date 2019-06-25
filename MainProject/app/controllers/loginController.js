(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("LoginController", ["DataService", "$scope","$rootScope", "$location", "SMAAlertFactory", "ProjectConstants", loginController]);

    function loginController(DataService, $scope,$rootScope, $location, SMAAlertFactory, ProjectConstants) {
        
        $scope.AppC.ShowHeader = false;
        $scope.AppC.ShowFooter = false;
        $scope.AppC.ActivePageName = "";

        //var vid = document.getElementsByClassName("bgvid")[0];
        //vid.muted = true;

        /*jshint validthis:true */
        var loginC = this;

        loginC.AnimationClass = "pageTransitionAnimation";

        loginC.UserLoginUserName = $scope.AppC.userLogin;
        loginC.UserLoginPassword = $scope.AppC.userPassword;
        loginC.ModuleName = ProjectConstants.App.ModuleName;
        loginC.Login = login;

        loginC.keyPressedEmail = keyPressedEmail;
        loginC.keyPressedPassword = keyPressedPassword;
		loginC.BGClass = $location.absUrl().includes('iaspire.iaspireapp.com') ? true : false;
        loginC.userClickedButton = false;
        return loginC;
        
        // backend

        function login() {
            
            if (ProjectConstants.App.IsDownForMaintenance === true) { // quick check to see if the app is offline
                SMAAlertFactory.CreateInfoAlert("Oops!", "iAspire is currently down for maintenance.\n" + "Please try again later.");
            } else {
                if (!loginC.UserLoginUserName || loginC.UserLoginUserName === "") {
                    SMAAlertFactory.CreateInfoAlert("Oops!", "Please enter a valid username.");
                } else if (!loginC.UserLoginPassword || loginC.UserLoginPassword === "") {
                    SMAAlertFactory.CreateInfoAlert("Oops!", "Please enter a password.");
                } else {
                    loginC.userClickedButton = true;

                    if (!loginC.ModuleName || loginC.ModuleName === "") {
                        loginC.ModuleName = "Unspecified";
                    }

                    var userLoginObject = {
                        UserLoginUserName: loginC.UserLoginUserName,
                        UserLoginPassword: loginC.UserLoginPassword,
                        ModuleName: loginC.ModuleName
                    };

                    DataService.validateUserLogin(userLoginObject)
                    .success(function (data, status, headers, config) {						
						$rootScope.ID=data.UserID; 
                        $scope.AppC.ActiveUser = data;
						localStorage.setItem("MainUserData", JSON.stringify(data));
                        $location.path("selection");
                    })
                    .error(function (data, status, headers, config) {
                        if (status === 403) {
                            SMAAlertFactory.CreateInfoAlert(data, "Please contact iAspire for more information!");
                        } else {
                            SMAAlertFactory.CreateInfoAlert("Invalid Login", "Login credentials were incorrect\nPlease try again.");
                        }
                        loginC.userClickedButton = false;
                    });
                }
            }

        }

        function isEnterKey(keyCode) {
            if (keyCode === 13) return true;
            return false;
        }

        function keyPressedEmail(e) {
            if (isEnterKey(e.keyCode)) {
                $("#PasswordTextboxPosition").focus();
            }
        }

        function keyPressedPassword(e) {
            if (isEnterKey(e.keyCode)) {
                loginC.Login();
            }
        }


    }

})();