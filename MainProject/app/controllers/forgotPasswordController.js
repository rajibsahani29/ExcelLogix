(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("ForgotPasswordController", ["$scope", "$location", "DataService", "ProjectConstants", "SMAAlertFactory", forgotPasswordController]);

    function forgotPasswordController($scope, $location, DataService, ProjectConstants, SMAAlertFactory) {

        $scope.AppC.ShowHeader = false;
        $scope.AppC.ShowFooter = false;
        $scope.AppC.ActivePageName = "";
        //var vid = document.getElementsByClassName("bgvid")[0];
        //vid.muted = true;

        /*jshint validthis:true */
        var forgotP = this;

        forgotP.AnimationClass = "pageTransitionAnimation";
        forgotP.resetPassword = resetPassword;
        forgotP.Email = "";

        forgotP.userClickedButton = null;

        return forgotP;

        function resetPassword() {
            if (ProjectConstants.App.IsDownForMaintenance === true) { // quick check to see if the app is offline
                SMAAlertFactory.CreateInfoAlert("Oops!", "iAspire is currently down for maintenance.\n" + "Please try again later.");
            } else {
                if (!forgotP.Email || forgotP.Email === "") {
                    SMAAlertFactory.CreateInfoAlert("Oops!", "Invalid email format.");
                } else {
                    forgotP.userClickedButton = true;
                    var loginObject = {
                        UserLoginUserName: forgotP.Email,
						DomainName:document.location.origin
                    };
                    DataService.resetPassword(loginObject)
                    .success(function (data, status, headers, config) {
                        SMAAlertFactory.CreateInfoAlert("Success", "Your email should arrive within a few minutes");
                        forgotP.userClickedButton = false;
                    })
                    .error(function (data, status, headers, config) {
                        SMAAlertFactory.CreateInfoAlert("Oops!", "Something went wrong, please try again.");
                        forgotP.userClickedButton = false;
                    });
                }
            }
        }
    }

})();