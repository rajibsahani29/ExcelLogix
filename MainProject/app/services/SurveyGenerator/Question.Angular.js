(function () {

    "use strict";

    angular
        .module("Question", []);
    angular
        .module("Question")
        .config(config)
        .run(run)
        .factory("QuestionFactory", questionFactory)
        .controller("QuestionController", ["$scope", questionController]);

    function config() {

    }

    function run() {

    }

    function questionFactory() {

        /*jshint validthis:true */
        var qF = this;

        return qF;
    }

    function questionController($scope) {
        /*jshint validthis:true */
        var qC = this;

        qC.QuestionID = null;
        qC.SurveyID = null;
        qC.LayoutModeID = null;
        qC.SelectionModeID = null;
        qC.ColumnsNumber = null;
        qC.MinSelectionRequired = null;
        qC.MaxSelectionAllowed = null;
        qC.RatingEnabled = null;
        qC.RandomizeAnswers = null;
        qC.PageNumber = null;
        qC.DisplayOrder = null;
        qC.DisplayOrder_Get = displayOrderFormat;
        qC.QuestionText = null;
        qC.QuestionPipeAlias = null;
        qC.QuestionIDText = null;
        qC.HelpText = null;
        qC.Alias = null;
        qC.ShowHelpText = null;
        qC.OldQuestionID = null;
        qC.LibraryID = null;
        qC.ParentQuestionID = null;

        qC.SelectedAnswer = null;
        qC.Answers = [];
        qC.ChildQuestions = [];

        // functions
        qC.AttachAnswer = attachAnswer;
        qC.AttachChildQuestion = attachChildQuestion;
        qC.SetSelectedAnswer = setSelectedAnswer;
        qC.AddToSurvey = addToSurvey;

        return qC;

        function displayOrderFormat() {
            var tA = document.createElement("textarea");
            tA.textContent = qC.DisplayOrder;
            return tA.innerHTML;
        }

        function attachAnswer(answerScope) {
            qC.Answers.push(answerScope);
        }

        function attachChildQuestion(childQuestionScope) {
            qC.ChildQuestions.push(childQuestionScope);
        }

        function setSelectedAnswer(answerScope) {
            qC.SelectedAnswer = answerScope;
        }

        function addToSurvey() {
            $scope.$parent.AddQuestion(qC);
        }
    }

})();