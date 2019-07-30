(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("HeaderController", ["$scope","$rootScope", "DataService", "SMAAlertFactory", "ProjectConstants", headerController]);

    function headerController($scope, $rootScope, DataService, SMAAlertFactory, ProjectConstants) {
        var headC = this;
        headC.AnimateMenu = AnimateMenu;
        headC.Logout = logout;    

        $scope.userName = localStorage.getItem("iAsp.LoginName");
        if ($scope.userName == "") $scope.userName = "Account";
          
        return headC;
        function AnimateMenu(elem) {
            var btnclasschk = $('#btn').hasClass("dl-active")
            var menuclasschk = $('#ulmenu').hasClass("dl-menuopen");
            if (!btnclasschk && !menuclasschk) {
                $('#btn').addClass("dl-active");
                $('#ulmenu').addClass("dl-menuopen");
            } else {
                $('#btn').removeClass("dl-active");
                $('#ulmenu').removeClass("dl-menuopen");
            }
        }
        function logout() {
            function confirmCallback(val) {
                if (val === true) {
                    DataService.userLogout()
                        .success(function (data, status, headers, config) {
                            $scope.AppC.ActiveUser.UserID = null;
                            $rootScope.ID = null;
                            location.hash = '#login';
                        })
                        .error(function (data, status, headers, config) {
                            // we don't really care if it failed... the user clicked logout
                            $scope.AppC.ActiveUser.UserID = null;
                        });
                }
            }
            SMAAlertFactory.CreateConfirmAlert("Are you sure you want to log out?", null, null, null, confirmCallback);
        }
    }

})();