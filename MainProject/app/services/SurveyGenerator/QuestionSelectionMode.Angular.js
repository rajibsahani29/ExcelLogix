(function () {

    "use strict";

    angular
        .module("QuestionSelectionMode", []);

    angular
        .module("QuestionSelectionMode")
        .config(config)
        .run(run)
        .factory("QuestionSelectionModeFactory", questionSelectionModeFactory)
        .controller("QuestionSelectionModeController", questionSelectionModeController);

    function config() {

    }

    function run() {

    }

    function questionSelectionModeFactory() {

        /*jshint validthis:true */
        var qSMF = this;

        return qSMF;

    }

    function questionSelectionModeController() {

        /*jshint validthis:true */
        var qSMC = this;

        qSMC.QuestionSelectionModeID = null;
        qSMC.Description = null;
        qSMC.TypeNameSpace = null;
        qSMC.TypeAssembly = null;
        qSMC.TypeMode = null;

        return qSMC;

    }

})();