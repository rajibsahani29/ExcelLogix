(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("AppController", ["$scope","$rootScope", "$http", "DataService", "ProjectConstants", "SMAAlertFactory", "$location", controller]);

    function controller($scope,$rootScope, $http, DataService, ProjectConstants, SMAAlertFactory, $location) {
               
        var AppC = this;    
        AppC.ActivePageName = "Home";
        AppC.ShowHeader = false;
        AppC.ShowFooter = false;
        AppC.AppVersion = ProjectConstants.App.Version;
        AppC.LegalInformation = ProjectConstants.App.LegalText;

        AppC.isUserAuthorized = false;
        AppC.rememberUser = true;

        AppC.ActiveUser = null;
        AppC.UserID = null;
        AppC.AccessID = null;
        AppC.UserRoles = []; // not currently built in
        AppC.Merchant = null;
        AppC.IsTeacher = false;

        AppC.IsTrialVersion = true;

        AppC.userLogin = "";
        AppC.userPassword = "";

        $scope.$on('$routeChangeStart', function (next, current) {
            ManageControls();
        });


        $scope.$watch('AppC.ActiveUser', function (newActiveUser, oldActiveUser) {
            if (typeof newActiveUser !== "undefined" && newActiveUser !== oldActiveUser) {
                if (newActiveUser.UserID) {
                    var ReportingSettings_DateRangeValue = localStorage.getItem("ReportingSettings_DateRangeValue");
                    var ReportingSettings_DateRangeType = localStorage.getItem("ReportingSettings_DateRangeType");
                    var ReportingSettings_CollapseComments = localStorage.getItem("ReportingSettings_CollapseComments");
                    var ReportingSettings_DataFormat = localStorage.getItem("ReportingSettings_DataFormat");
                    var ReportingSettings_DataType = localStorage.getItem("ReportingSettings_DataType");
                    var accessID = localStorage.getItem("AccessID");
					var LoginData = localStorage.getItem("IBSUserData");
                    var MainLoginData = localStorage.getItem("MainUserData");
                    localStorage.clear();
                    sessionStorage.clear();
					localStorage.setItem("IBSUserData", LoginData);
                    localStorage.setItem("MainUserData", MainLoginData);
                    if (AppC.rememberUser === true) {
                        localStorage.setItem("AccessID", JSON.stringify(newActiveUser.SessionID));
						localStorage.setItem("USerID",JSON.stringify(newActiveUser.UserID))
                        if (ReportingSettings_DateRangeValue && ReportingSettings_DateRangeType) {
                            localStorage.setItem("ReportingSettings_DateRangeValue", ReportingSettings_DateRangeValue);
                            localStorage.setItem("ReportingSettings_DateRangeType", ReportingSettings_DateRangeType);
                        }
                        if (ReportingSettings_CollapseComments) {
                            localStorage.setItem("ReportingSettings_CollapseComments", ReportingSettings_CollapseComments);
                        }
                        if (ReportingSettings_DataFormat) {
                            localStorage.setItem("ReportingSettings_DataFormat", ReportingSettings_DataFormat);
                        }
                        if (ReportingSettings_DataType) {
                            localStorage.setItem("ReportingSettings_DataType", ReportingSettings_DataType);
                        }
                    }
                    AppC.UserID = newActiveUser.UserID;
                    $rootScope.ID = newActiveUser.UserID;
                    $rootScope.UserName = newActiveUser.UserName;
                    AppC.AccessID = newActiveUser.SessionID;
                    AppC.isUserAuthorized = true;
                    if (AppC.UserID && $rootScope.ID && AppC.AccessID && AppC.isUserAuthorized) {
                        var windowWidth = window.innerWidth;
                        var isMobile = windowWidth < 1112;
                        var merchantData = JSON.parse(localStorage.getItem("MainUserData"));
                        
                    }
                    else {
                        //switch ($location.path()) {
                        //    case "/login":
                        //    case "/createAccount":
                        //    case "/forgotPassword":
                        //        //window.location.hash = "#/selection";
                        //        $location.path("login");
                        //        break;
                        //    default:
                        //        // do nothing
                        //}                        
                    }
                    // get the user's merchant
                    DataService.getMerchantsForUser()
                    .success(function (data, status, headers, config) {
						localStorage.setItem("MerchantData", JSON.stringify(AppC.Merchant));
                        AppC.Merchant = data;
                        AppC.IsTrialVersion = data.IsTrialAccount;
                    })
                    .error(function (data, status, headers, config) {

                    });
                    //---------------Check Premium User-------------------
                    DataService.checkUserIsPremium()
                    .success(function (data, status, headers, config) {
                        //console.log(data);
                        AppC.ActiveUser.IsPremium = data;
                    })
                    .error(function (data, status, headers, config) {

                    });
                    //---------------XX---------------------------
                    // check if the user is a teacher
                    DataService.userTeacherCheckIfUserIsTeacher()
                    .success(function (data, status, headers, config)
                    {
                        if (status !== 204) {
                            AppC.IsTeacher = true;
                        }
                    })
                    .error(function (data, status, headers, config) {

                    });
                    
                } else {
                    
                    localStorage.removeItem("AccessID");
                    sessionStorage.clear();
                    AppC.isUserAuthorized = false;
                    switch ($location.path()) { // for some reason, using window.location.hash caused issues with IE with an infinite digestloop
                        case "/login":
                        case "/createAccount":
                        case "/forgotPassword":
                            // do nothing
                            return;
                        default:
                            //window.location.hash = "#/login";
                           // $location.path("login");
                    }
                    SMAAlertFactory.CreateInfoAlert("You have been logged out!", "Please log in again.");
                }
            }
            
        }, true);

        // execute inits
        initHTTP();
        initUser();        
        // return
        return AppC;

        function resetUser() {
            localStorage.clear();
            sessionStorage.clear();
            AppC.isUserAuthorized = false;
            AppC.ActiveUser = null;
            AppC.UserID = null;
            AppC.AccessID = null;
            AppC.UserRoles = []; // not currently built in
            AppC.Merchant = null;
        }

        // backend
        function initUser() {
            var accessID = localStorage.getItem("AccessID");
			 var UserData = JSON.parse(localStorage.getItem("MainUserData"));
            accessID = UserData ? UserData.SessionID : accessID;
            if (accessID !== null) {
                // add popup here, only fires if the accessID was saved
                //accessID = JSON.parse(accessID);
                AppC.AccessID = accessID;
                DataService.validateAccessID(accessID)
                .success(function (data, status, headers, config) {
                    AppC.ActiveUser = data;
                   // ManageControls(true);
                })
                .error(function (data, status, headers, config) {
                    // add alert letting the person know they must log back in 
                    // because their session has ended... only if status === unauthorized
                    if (status === 403) {
                        SMAAlertFactory.CreateInfoAlert(data, "Please contact iAspire for more details");
                    }
                    resetUser();
                    ManageControls(false);
                    //window.location.hash = "#/login";
                });
            } else {
                // user is not remembered, must log in
                resetUser();
                //window.location.hash = "#/login";
                ManageControls(false);
            }
        }

        function initHTTP() {
            $http.defaults.headers.common["X-iA-AccessID"] = function () {
                return AppC.AccessID;
            };
        }
        function ManageControls(isVisible) {
            if (isVisible == undefined) {
                AppC.ShowMobileHeader = true;
                AppC.ShowSidebar = true;
                switch ($location.path()) {
                    case "/login":
                        AppC.ShowMobileHeader = false;
                        AppC.ShowSidebar = false;
                        break;
                    default:
                        break;
                }                
            }
            else {
                AppC.ShowMobileHeader = isVisible;
                AppC.ShowSidebar = isVisible;
            }
        }
    }
})();