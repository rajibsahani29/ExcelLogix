(function () {

    "use strict";

    angular
        .module("Survey", []);
    angular
        .module("Survey")
        .config(config)
        .run(run)
        .factory("SurveyFactory", surveyFactory)
        .controller("SurveyController", surveyController);

    function config() {

    }

    function run() {

    }

    function surveyFactory() {

    }

    function surveyController() {

        /*jshint validthis:true */
        var surveyC = this;

        surveyC.Activated = null;
        surveyC.AllowMultipleNSurveySubmissions = null;
        surveyC.AllowMultipleUserNameSubmissions = null;
        surveyC.Archive = null;
        surveyC.CloseDate = null;
        surveyC.CookieExpires = null;
        surveyC.CreationDate = null;
        surveyC.DefaultSurvey = null;
        surveyC.FolderID = null;
        surveyC.IPExpires = null;
        surveyC.LastEntryDate = null;
        surveyC.MultiLanguageModeID = null;
        surveyC.NavigationEnabled = null;
        surveyC.NotificationModeID = null;
        surveyC.OnlyInvited = null;
        surveyC.OpenDate = null;
        surveyC.ProgressDisplayModeID = null;
        surveyC.QuestionNumberingDisabled = null;
        surveyC.ResultsDisplayTimes = null;
        surveyC.ResumeModeID = null;
        surveyC.SaveTokenUserData = null;
        surveyC.Scored = null;
        surveyC.SurveyDisplayTimes = null;
        surveyC.SurveyGuid = null;
        surveyC.SurveyID = null;
        surveyC.Title = null;
        surveyC.UnAuthentifiedUserActionID = null;

        surveyC.Questions = [];

        surveyC.AddQuestion = addQuestion;

        return surveyC;

        function addQuestion(questionScope) {
            surveyC.Questions.push(questionScope);
        }
    }

})();