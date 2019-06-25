(function () {

    angular
        .module("SurveyRenderer", []);

    angular
        .module("SurveyRenderer")
        .config(config)
        .run(run)
        .factory("SurveyRendererFactory", [surveyRendererFactory])
        .controller("SurveyRendererController", ["SurveyController",
                                                 "QuestionController",
                                                 "ChildQuestionController",
                                                 "AnswerTypeController",
                                                 "AnswerController",
                                                 surveyRendererController]);

    function config() {

    }

    function run() {

    }

    function surveyRendererFactory() {

        /*jshint validthis:true */
        var survRenFac = this;

        return survRenFac;

    }

    function surveyRendererController(SurveyController, QuestionController, ChildQuestionController, AnswerTypeController, AnswerController) {

        /*jshint validthis:true */
        var survRC = this;
        
        survRC.PrepareSurveyFromServer = prepareSurveyFromServer;
        survRC.GenerateAndAppendHTML = generateAndAppendHTML;
        survRC.InitAngularBinding = initAngularBinding;

        return survRC;

        // creates angular controllers for each part of the survey
        function prepareSurveyFromServer(data) {

            var surveyObject = new SurveyController();

        }

        // creates the html, and then appends it to the body
        function generateAndAppendHTML() {

        }

        // binds the html and the controllers to the angular runtime
        function initAngularBinding() {

        }
    }

})();