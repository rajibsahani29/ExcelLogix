(function () {

    "use strict";

    angular
        .module("AnswerType", []);

    angular
        .module("AnswerType")
        .config(config)
        .run(run)
        .factory("AnswerTypeFactory", answerTypeFactory)
        .controller("AnswerTypeController", answerTypeController);

    function config() {

    }

    function run() {

    }

    function answerTypeFactory() {

        /*jshint validthis:true */
        var aTF = this;

        return aTF;

    }

    function answerTypeController() {

        /*jshint validthis:true */
        var aTC = this;

        aTC.AnswerTypeID = null;
        aTC.FieldWidth = null;
        aTC.FieldHeight = null;
        aTC.FieldLength = null;
        aTC.TypeMode = null;
        aTC.PublicFieldResults = null;
        aTC.BuiltIn = null;
        aTC.Description = null;
        aTC.JavascriptFunctionName = null;
        aTC.JavascriptCode = null;
        aTC.JavascriptErrorCode = null;
        aTC.TypeNameSpace = null;
        aTC.TypeAssembly = null;
        aTC.XMLDataSource = null;


        //aTC.AnswerTypeID;
        //aTC.FieldWidth;
        //aTC.FieldHeight;
        //aTC.FieldLength;
        //aTC.TypeMode;
        //aTC.PublicFieldResults;
        //aTC.BuiltIn;
        //aTC.Description;
        //aTC.JavascriptFunctionName;
        //aTC.JavascriptCode;
        //aTC.JavascriptErrorCode;
        //aTC.TypeNameSpace;
        //aTC.TypeAssembly;
        //aTC.XMLDataSource;
        //aTC.adhghaerh;
        //aTC.sdfadjaerj;
        //aTC.zdfnzdtjae;
        //aTC.aerhaerja;
        //aTC.aerhaerjzdcjf;
        //aTC.DRJzerjsetj;
        //aTC.setkjsretdmj;
        //aTC.zdfjzdtksrx;
        //aTC.zdtkjxtrksrtxmg;
        //aTC.fgmx;
        //aTC.dzfjxrftjrd;

        return aTC;

    }

})();