(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .factory("timeoutHttpIntercept", [httpIntercept])
        //.factory("noCacheInterceptor", [CacheInterceptor])
        .config(["$httpProvider", configFunc]);

    function configFunc($httpProvider) {
        $httpProvider.interceptors.push('timeoutHttpIntercept');
        //$httpProvider.interceptors.push('noCacheInterceptor');

        /*
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        */
    }

    function httpIntercept() {
        return {
            "request": function (config) {
                if (!config.timeout || config.timeout === 30 * 1000) {
                    config.timeout = 1000 * 60 * 2; // 60 second timeout
                }
                return config;
            }
        };
    }

    //function CacheInterceptor() {
    //    return {
    //        request: function (config) {
    //            //if (config.method == 'GET' && config.url.indexOf('/api/') == -1 ) 
    //            {
    //                var separator = config.url.indexOf('?') === -1 ? '?' : '&';
    //                config.url = config.url + separator + 'noCache=' + new Date().getTime();
    //            }
    //            console.log(config.url);
    //            return config;
    //        }
    //    };
    //}

})();