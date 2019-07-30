(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .run(["AppDatabase", "iAspireDatabase", "$rootScope", "$location", "$window", runner]);

    function runner(AppDatabase, iAspireDatabase, $rootScope, $location, $window) {
        //AppDatabase.init();
        //iAspireDatabase.init();
        //gChartAPI.init();

        Date.parseDate = function (input, format) {
            return moment(input, format).toDate();
        };
        Date.prototype.dateFormat = function (format) {
            return moment(this).format(format);
        };
        //String.prototype.capitalizeFirstLetter = function () {
        //    return this.charAt(0).toUpperCase() + this.slice(1);
        //}
        $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
            //alert(current.$$route.originalPath.indexOf("/login")); 
            var Path = current.$$route.originalPath;
            $rootScope.Path = Path;
            var prePath = pre.$$route.originalPath;
            if (prePath == '/selectForm') {
                $rootScope.PrePath = "Forms";
            } else if (prePath == '/openSavedDoc') {
                $rootScope.PrePath = "Document";
            } else if (prePath == '/reports') {
                $rootScope.PrePath = "Reports";
            }
            else if (prePath == '/accounts') {
                $rootScope.PrePath = "Account";
            }
            else if (prePath.indexOf('survey')>-1) {
                $rootScope.PrePath = "Survey";
            }
            else {
                $rootScope.PrePath = "Dashboard";
            }
            //if (Path == "/login" && typeof $rootScope.ID != 'undefined' &&   $rootScope.ID!=null) {
            //    var id = $rootScope.ID;                
            //        $location.path("/selection");                
            //}
            //var windowWidth = window.innerWidth;
            //var isMobile = windowWidth < 1112;
            //var merchantData = JSON.parse(localStorage.getItem("MainUserData"));
            //if (isMobile == true && (Path == "/MobileView" || Path == "/selection")) {
            //    $location.href="#/MobileView";
            //} 
            ////if (isMobile == true && Path != "/login" && Path != "/selectForm" && Path != "/openSavedDoc" && Path != "/BusinessReport"
            ////    && Path != "/reports" && Path != "/settings" && Path != "/survey/:SurveyID/:SurveyGuid" && Path != "/createAccount"
            ////    && Path!="/forgotPassword") {
            ////    $location.path("/MobileView");               
            ////} 
        });
    }

})();