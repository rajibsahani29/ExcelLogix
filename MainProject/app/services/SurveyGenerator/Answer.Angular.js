(function () {

    "use strict";

    angular
        .module("Answer", []);

    angular
        .module("Answer")
        .config(config)
        .run(run)
        .factory("AnswerFactory", answerFactory)
        .controller("AnswerController", ["$scope", answerController]);

    function config() {

    }

    function run() {

    }

    function answerFactory() {

    }

    function answerController($scope) {

        /*jshint validthis:true */
        var aC = this;

        aC.QuestionID = null;
        aC.AnswerTypeID = null;
        aC.DisplayOrder = null;
        aC.ScorePoint = null;
        aC.RatePart = null;
        aC.Selected = null;
        aC.AnswerID = null;
        aC.Mandatory = null;
        aC.AnswerText = null;
        aC.AnswerText_Get = getAnswerText;
        aC.ImageURL = null;
        aC.AnswerPipeAlias = null;
        aC.AnswerIDText = null;
        aC.AnswerAlias = null;
        aC.SliderRange = null;
        aC.SliderValue = null;
        aC.SliderMin = null;
        aC.SliderMax = null;
        aC.SliderAnimate = null;
        aC.SliderStep = null;
        aC.OldAnswerID = null;
        aC.DefaultText = null;
        aC.RegularExpressionID = null;

        aC.ParentQuestion = null;

        return aC;

        function getAnswerText() {
            var tA = document.createElement("textarea");
            tA.innerHTML = aC.AnswerText;
            return tA.innerText;
        }

        function setParentQuestion() {
            aC.ParentQuestion = $scope.$parent;
            $scope.$parent.AttachChildQuestion(aC);
        }

    }

})();