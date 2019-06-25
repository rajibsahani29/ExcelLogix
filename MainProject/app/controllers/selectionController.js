(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .directive('afterRepeate', function () {
            return function (scope, element, attrs) {

                if (scope.$last) {
                    //window.alert("im the last!");
                    setTimeout(function () {
                        $($(".survdtltbl #tbody tr")[0]).find("td").each(function (index) {
                            console.log(this, $(this).width());
                            console.log($(".survdtltbl .childtbl tr td:nth-child(" + (index + 1) + ")"));
                            $(".survdtltbl .childtbl tr td:nth-child(" + (index + 1) + ")").width($(this).width() + "px");
                        });
                    }, 1500);

                }
            };
        })
        .controller("SelectionController", ["DataService", "$scope", "$rootScope", "$http", "$interval", "$window", "$filter", "$location", "SMAAlertFactory", "ProjectConstants", SelectionController]);

    function SelectionController(DataService, $scope, $rootScope, $http, $interval, $window, $filter, $location, SMAAlertFactory, ProjectConstants) {
        getVoteListForUser();
        var sc = this;        
        sc.TotalSurvey = null;
        sc.CompletedSurvey = null;
        sc.ResumedSurvey = null;
        sc.inActiveSurvey = 0;
        
        sc.TotalEmployee = null;
        sc.ActiveEmployee = null;
        sc.ArcivedEmployee = null;

        sc.ActivityData = [];

        sc.logout = logout; 

        sc.LoginUser = $rootScope.UserName;
        function getVoteListForUser(SurveyData) {   
            $('.loader-bg').fadeOut();            
            DataService.getDashboardDataNew()
                .success(function (data, status, headers, config) {
                    sc.TotalSurvey = data.Voterlist.length;
                    sc.CompletedSurvey = data.Voterlist.filter(function (e) { return e.Validated == 1 }).length;
                    sc.ResumedSurvey = data.Voterlist.filter(function (e) { return e.Validated == 0 }).length;

                    sc.TotalEmployee = data.Userlist.length;
                    sc.ArcivedEmployee = data.Userlist.filter(function (e) { return e.UserName.indexOf("INACTIVE-") > -1 }).length;
                    if ($.isNumeric(sc.ArcivedEmployee)) {
                        sc.ActiveEmployee = parseInt(data.Userlist.length) - parseInt(sc.ArcivedEmployee);
                    } else {
                        sc.ActiveEmployee = parseInt(data.Userlist.length) - 0;
                    }

                    sc.ActivityData = data.activitydata;

                    var date = new Date();
                    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
                        title: {
                            text: 'Surveys. ' + getMonthname(date.getUTCMonth()) + ', ' + date.getUTCFullYear()
        },
        //subtitle: {
        //    text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
        //},
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}%'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },

        series: [
            {
                name: "Surveys",
                colorByPoint: true,
                data: data.SurveyChartData
            }
        ],
       
    });
                }).error(function (data, status, headers, config) {
                    if (status === 0) // timeout
                    {
                        if (retryCount < 2) {
                            retryCount += 1;
                            //getVoteListForUser();
                        } else {
                            SMAAlertFactory.CreateInfoAlert("Alert", "It seems iAspire is overloaded at the moment\n please try again later.");
                        }
                    }
                });
        }
        function getMonthname(monthNumber) { //1 = January
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            return monthNames[monthNumber];
        }

        function logout() {
            function confirmCallback(val) {
                if (val === true) {
                    DataService.userLogout()
                        .success(function (data, status, headers, config) {
                            $scope.AppC.ActiveUser.UserID = null;
                            $rootScope.ID = null;
                            location.hash = '#login';
                        })
                        .error(function (data, status, headers, config) {
                            $scope.AppC.ActiveUser.UserID = null;
                            $rootScope.ID = null;
                        });
                }
            }
            SMAAlertFactory.CreateConfirmAlert("Are you sure you want to log out?", null, null, null, confirmCallback);
        }
    }
       })();
