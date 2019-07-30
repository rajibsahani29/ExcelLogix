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
        sc.TotalSurvey = 0;
        sc.TotalSurveyResult = 0;
        sc.CompletedSurvey = 0;
        sc.ResumedSurvey = 0;
        sc.inActiveSurvey = 0;
        sc.inActiveSurveyResult = 0;
        sc.CompletedSurveyResult = 0;
        sc.ResumedSurveyResult = 0;

        sc.TotalEmployee = null;
        sc.ActiveEmployee = null;
        sc.ArcivedEmployee = null;

        sc.ActivityData = [];
        function getVoteListForUser(SurveyData) {   
            $('.loader-bg').fadeOut();   
            $scope.spinner = SMAAlertFactory.CreateSpinnerAlert();
            DataService.getDashboardDataNew()            
                .success(function (data, status, headers, config) {
                    sc.TotalSurvey = data.Voterlist.length;
                    //sc.TotalSurvey = angular.isNumber(sc.TotalSurvey) ? sc.TotalSurvey : 1;
                    if (sc.TotalSurvey == 0) {
                        sc.TotalSurveyResult = ((sc.TotalSurvey / 1) * 100);
                        sc.CompletedSurvey = data.Voterlist.filter(function (e) { return e.Validated == 1 }).length;
                        sc.CompletedSurveyResult = ((sc.CompletedSurvey / 1) * 100).toFixed(2);
                        sc.ResumedSurvey = data.Voterlist.filter(function (e) { return e.Validated == 0 }).length;
                        sc.ResumedSurveyResult = ((sc.ResumedSurvey / 1) * 100).toFixed(2);                        
                        sc.inActiveSurveyResult = ((sc.inActiveSurvey / 1) * 100).toFixed(2);
                    } else {
                        sc.TotalSurvey = data.Voterlist.length;
                        sc.TotalSurveyResult = ((sc.TotalSurvey / sc.TotalSurvey) * 100);
                        sc.CompletedSurvey = data.Voterlist.filter(function (e) { return e.Validated == 1 && e.isActive != 1 }).length;
                        sc.CompletedSurveyResult = ((sc.CompletedSurvey / sc.TotalSurvey) * 100).toFixed(2);
                        sc.ResumedSurvey = data.Voterlist.filter(function (e) { return e.Validated == 0 && e.isActive != 1 }).length;
                        sc.ResumedSurveyResult = ((sc.ResumedSurvey / sc.TotalSurvey) * 100).toFixed(2);
                        sc.inActiveSurvey = data.Voterlist.filter(function (e) { return e.isActive == 1 }).length;
                        sc.inActiveSurveyResult = ((sc.inActiveSurvey / sc.TotalSurvey) * 100).toFixed(2);
                    }
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
                    $scope.spinner.resolve();
                }).error(function (data, status, headers, config) {
                    if (status === 0) // timeout
                    {                       
                            SMAAlertFactory.CreateInfoAlert("Alert", "It seems system is overloaded at the moment\n please try again later.");
                    }
                    $scope.spinner.resolve();
                });
        }
        function getMonthname(monthNumber) { //1 = January
            var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            return monthNames[monthNumber];
        }
                
    }
       })();
