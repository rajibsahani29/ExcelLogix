(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .factory("ProjectConstants", projectConstants);

    function projectConstants() {

        /*jshint validthis:true */
        var pC = this;

        pC.App = function () { };
        pC.App.Version = "2.0.10";
        pC.App.LegalText = "© 2018 iAspire. All rights reserved.";
        pC.App.ModuleName = "iAspire_WebApp";
        pC.App.AreReportsReady = true;
        pC.App.IsDownForMaintenance = false;

        // query string parameters for survey stuff
        pC.QWRYSTR = function () { };
        pC.QWRYSTR.iAspireUserID = "iaspireuserid";
        pC.QWRYSTR.iAspireUserName = "iaspireusername";
        pC.QWRYSTR.iAspireSessionID = "iaspiresessionid";
        pC.QWRYSTR.ResumeID = "resumeid";
        pC.QWRYSTR.SurveyID = "surveyid";
        pC.QWRYSTR.VoterID = "voterid";
        pC.QWRYSTR.EventID = "eventid";
        pC.QWRYSTR.EmployeeID = "employeeid";
        pC.QWRYSTR.EmployeeName = "employeename";
        pC.QWRYSTR.MappedParameters = "mappedParams";
        pC.QWRYSTR.DefaultVoteTitle = "DefaultVoteTitle";
        pC.QWRYSTR.CurrentDateTime = "currentdatetime";
        pC.QWRYSTR.CurrentTime = "currenttime";

        // quick-gets for query string parameter values
        pC.QWRYSTRVal = function () { };
        pC.QWRYSTRVal.CurrentDateTimeValue = getCurrentDateTimeValue;
        pC.QWRYSTRVal.CurrentTimeValue = getCurrentTimeValue;

        // integer constants
        pC.Integers = function () { };
        pC.Integers.LoadDelayTime = 400; // milliseconds

        // HTML events
        pC.Events = function () { };
        pC.Events.SurveyComplete = "SurveyComplete";

        return pC;

        function getCurrentDateTimeValue() {
            return moment().format("MM-DD-YYYY");
        }

        function getCurrentTimeValue() {
            return moment().format("hh:mm A");
        }
    }

})();