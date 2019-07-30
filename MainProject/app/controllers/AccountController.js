(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("AccountController", ["DataService", "$scope", "$rootScope", "$location", "SMAAlertFactory", "ProjectConstants", accountController]);

    function accountController(DataService, $scope,$rootScope, $location, SMAAlertFactory, ProjectConstants) {
       
        var accountC = this;
        accountC.UserName = null;
        accountC.UserID = null;
        accountC.UserEmail = null;
        accountC.MerchantName = null;
        accountC.MerchantID = null;
        accountC.UserRoles = null;
        //return accountC;
        var userdata = JSON.parse(localStorage.getItem("MainUserData"));
        accountC.UserName = userdata.FirstName +" "+ userdata.LastName;
        accountC.UserID = userdata.UserID;
        accountC.UserEmail = userdata.Email;
        accountC.UserRoles = userdata.UserRoles;
        accountC.MerchantName = userdata.MerchantName;
        accountC.MerchantID = userdata.MerchantID;
        
    }

})();