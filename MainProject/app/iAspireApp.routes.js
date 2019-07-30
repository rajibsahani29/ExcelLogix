(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .config(["$routeProvider", config]).run(function ($rootScope, hidebackbutton) {
            $rootScope.$on('$routeChangeSuccess', function () {
                hidebackbutton();
            })
        }).factory('hidebackbutton', function () {
            return function () {
                if (typeof Windows !== 'undefined') {
                    var systemNavigation = Windows.UI.Core.SystemNavigationManager.getForCurrentView();
                    systemNavigation.appViewBackButtonVisibility = Windows.UI.Core.AppViewBackButtonVisibility.collapsed;
                }
            }
        });

    function config($routeProvider) {
        $routeProvider

            .when("/login", {
                templateUrl: "app/views/loginView.html",
                controller: "LoginController",
                controllerAs: "loginC"
            })
            .when("/header", {
                templateUrl: "app/views/HeaderView.html",
                controller: "HeaderController",
                controllerAs: "headC"
            })
            .when("/selection", {
                templateUrl: "app/views/selectionView.html",
                controller: "SelectionController",
                controllerAs: "selectionC"
            })

            .when("/createAccount", {
                templateUrl: "app/views/createAccountView.html",
                controller: "CreateAccountController",
                controllerAs: "createA"
            })

            .when("/forgotPassword", {
                templateUrl: "app/views/forgotPasswordView.html",
                controller: "ForgotPasswordController",
                controllerAs: "forgotPasswordC"
            })

            .when("/selectForm", {
                templateUrl: "app/views/selectFormView.html",
                controller: "SelectFormController",
                controllerAs: "sFC"
            })

            .when("/survey/:SurveyID/:SurveyGuid", {
                templateUrl: "app/views/surveyView.html",
                controller: "SurveyController",
                controllerAs: "survC"
            })

            .when("/DashboardSurvey/:SurveyID/:SurveyGuid/:TeacherName/:TeacherID/:EventID", {
                templateUrl: "app/views/DashBoardSurveyView.html",
                controller: "DashboardSurveyController",
                controllerAs: "dashsurvC"
            })

            .when("/openSavedDoc", {
                templateUrl: "app/views/openSavedDocView.html",
                controller: "OpenSavedDocController",
                controllerAs: "oSD"
            })

            .when("/reports", {
                templateUrl: "app/views/reportsView.html",
                controller: "ReportsController",
                controllerAs: "repC"
            })

            .when("/settings", {
                templateUrl: "app/views/settingsView.html",
                controller: "SettingsController",
                controllerAs: "setC"
            })
            .when("/BusinessReport", {
                templateUrl: "app/views/BusinessReport.html",
                controller: "BusinessReportController",
                controllerAs: "repC"
            })
            .when("/notifications", {
                templateUrl: "app/views/notificationsView.html",
                controller: "notificationsController",
                controllerAs: "notiC"
            })
            .when("/accounts", {
                templateUrl: "app/views/AccountView.html",
                controller: "AccountController",
                controllerAs: "accountC"
            })
            .otherwise({
                //redirectTo: function () {
                //    return (localStorage.getItem("AccessID") === null) ? "/login" : "/selection";
                //}
                redirectTo: "/login"
            });
    }

})();