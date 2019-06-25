(function () {

    "use strict";

    angular
        .module("ChildQuestion", []);

    angular
        .module("ChildQuestion")
        .config(config)
        .run(run)
        .factory("ChildQuestionFactory", childQuestionFactory)
        .controller("ChildQuestionController", ["$scope", childQuestionController]);

    function config() {

    }

    function run() {

    }

    function childQuestionFactory() {

        /*jshint validthis:true */
        var cQF = this;

        return cQF;

    }

    function childQuestionController($scope) {

        /*jshint validthis:true */
        var cQC = this;

        cQC.QuestionText = null;
        cQC.ParentQuestionID = null;

        cQC.ParentQuestion = null;

        cQC.SetParentQuestion = setParentQuestion;

        return cQC;

        function setParentQuestion() {
            cQC.ParentQuestion = $scope.$parent;
            $scope.$parent.AttachChildQuestion(cQC);
        }
    }

})();