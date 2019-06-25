(function () {

    "use strict";

    angular
        .module("GoogleCharts", []);
    angular.module("GoogleCharts")
        .factory("gChartAPI", gchartAPI)
        .directive("gChartDirective", ["GChartAPI", gchartDirective])
        .controller("gChartController", gchartController);

    function gchartAPI() {
        // local variables
        var hasLoaded = false;
        var preLoadList = [];

        /*jshint validthis:true */
        var GCAPI = this;

        GCAPI.init = init;

        return GCAPI;

        function init() {
            google.load('visualization', '1', { 'packages': ['corechart'] });
            google.setOnLoadCallback(loaded);
        }

        function loaded() {
            hasLoaded = true;
            console.log("google charts has loaded");
        }

        function handlePreLoadList() {

        }
    }

    function gchartDirective(GChartAPI) {
        //return {
        //    restrict: 'A',
        //    require: 'ngModel',
        //    transclude: true,
        //    link: function (scope, element, attrs, ngModelCtrl) {
        //        setTimeout(function () { // exit the angular scope to do our work
        //            GChartAPI.newChart(element);
        //        }, 1);
        //    }
        //}
    }

    function gchartController() {
        /*jshint validthis:true */
        var GChartController = this;

        return GChartController;
    }

}());