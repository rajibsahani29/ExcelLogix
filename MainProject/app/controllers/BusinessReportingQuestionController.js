/// <reference path="C:\OneDrive\iAspire\www\trunk\www_iAspire\www_iAspire_App\Scripts/jspdf.debug.js" />

(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .directive("reportingquestion", reportingQuestion)
        //START NILESH-TSK42
        .factory("StaticValues", [staticReportValues])
        //END NILESH-TSK42
		//START NILESH-TSK21
        .directive("elemReady", ["$parse", "$timeout", "ReportingQuestionInterface", elemReady])
        //END NILESH-TSK21
        
        .factory("ReportingQuestionConstants", reportingQuestionConstants)
        .factory("ReportingQuestionLogic", ["ReportingQuestionConstants", "ReportsControllerLogic", "ReportsConstants" ,"StaticValues", reportingQuestionLogic])
        .factory("ReportingQuestionInterface", ["$q", "ReportsConstants", reportingQuestionInterface])
        //START NILESH-TSK42
        .controller("BusinessReportingQuestionController", ["$scope", "ReportingQuestionLogic", "ReportingQuestionConstants", "ReportingQuestionInterface", "StaticValues", reportingQuestionController]);
        //END NILESH-TSK42

    function reportingQuestion() {
        return {
            restrict: "E",
            scope: {
                passedQuestion: "=question"
            },
            replace: true,
            templateUrl: 'app/views/BusinessReportingQuestionView.html',
            controller: "BusinessReportingQuestionController",
            controllerAs: "BrQC"
        };
    }

    //START NILESH-TSK42
    function staticReportValues() {
        var staticVal = this;
        staticVal.baseQuestion = {};
        staticVal.InitStaticValues = initStaticValues;
        return staticVal;

        function InitSettingForReport() {
            // Place All Setting here for report
            staticVal.EnableSumOfVoterAnswerForQuestion = false;
            staticVal.EnableDisplaySalesRepCountForSchoolNameJostenDataCollection = false;
        }

        function initStaticValues(Question) {
            staticVal.baseQuestion = Question;
            InitSettingForReport();
            SetSurveyInformation();
            checkForSumOfVoterAnswerForQuestion();
            if (staticVal.baseQuestion.OldQuestionID == staticVal.JostenDataCollection.SchoolName.QuestionId) {
                staticVal.EnableDisplaySalesRepCountForSchoolNameJostenDataCollection = true;
            }
        }

        function checkForSumOfVoterAnswerForQuestion() {
            //Qids : Ty = 15561, Ly = 15562, +-Unit = 15563 ,AspTy = 15566, AspLy = 15567, AspCalcu. = 15568
            if ([15561, 15562, 15563, 15566, 15567, 15568].indexOf(staticVal.baseQuestion.OldQuestionID) > -1) {
                staticVal.EnableSumOfVoterAnswerForQuestion = true;
            }
        }

        function SetSurveyInformation() {
            staticVal.JostenDataCollection = {
                SurveyId: 2296,
                SalesRep: { QuestionId: 15576, AnswerIds: { iAspireUserName: 36868 } },
                SchoolName: { QuestionId: 15522, AnswerIds: {} },
                Ty: { QuestionId: 15561, AnswerIds: {} },
            }
        }
    }
    //END NILESH-TSK42


	//START NILESH-TSK21
    function elemReady($parse, $timeout, repQInterface) {
        return {
            restrict: 'A',
            link: function ($scope, elem, attrs) {
                $timeout(function () {
                    elem.ready(function () {
                        /* uncomment when highchart comes
                        var chart = elem;
                        var svgdata = chart.highcharts().getsvg();
                        var canvas = document.createelement("canvas");
                        var offsetx = 80, offsety = 100;
                        canvas.width = parseint(svgdata.match(/width="([0-9]+)"/)[1]) + offsetx;
                        canvas.height = parseint(svgdata.match(/height="([0-9]+)"/)[1]) + offsety;
                        var ctx = canvas.getcontext("2d");
                        ctx.fillstyle = "#ffffff";
                        ctx.fillrect(0, 0, canvas.width, canvas.height)
                        var img = document.createelement("img");
                        img.setattribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeuricomponent(svgdata))));
                        var jpegbase64 = null;
                        img.onload = function () {
                            ctx.drawimage(img, offsetx, offsety);
                            jpegbase64 = canvas.todataurl("image/jpeg");
                            repqinterface.registerimage(attrs.displayorder, attrs.questionid, jpegbase64);
                        };
                        */


                        /* OLD CODE
                        if (!$scope.$$phase) {
                            $scope.$apply(function () {
                                var func = $parse(attrs.elemReady);
                                func($scope);
                            })
                        }
                        else {

                            var func = $parse(attrs.elemReady);
                            func($scope);
                        }
                        */
                        
                    });
                },0);
            }
        }
    }
    //END NILESH-TSK21

    function reportingQuestionConstants() {
        /*jshint validthis:true */
        var repQConstants = this;

        repQConstants.GetBaseGoogleChartsObject = getBaseGoogleChartsObject;
				//START NILESH-TSK21
        repQConstants.GetBaseHighChartsObject = getBaseHighChartsObject;
        repQConstants.HighChartImages = [];
        //END NILESH-TSK21


        repQConstants.DataFormatEnum = {
            "Totals": 0,
            "History": 1,
            "TotalsPercent": 2,
            "HistoryPercent": 3,
			//START NILESH-TSK21-4
            "Distribution": 4,
            //END NILESH-TSK21-4
        };
        repQConstants.TimeIntervalEnum = {
            "Day": 0,
            "Week": 1,
            "Month": 3,
            "Quarter": 5,
            "Year": 7
        };
        repQConstants.ChartTypeEnum = {
            "PieChart": 0,
            "ColumnChart": 1,
            "LineChart": 2,
            "Table": 3
        };

        return repQConstants;

        function getBaseGoogleChartsObject(chartType, data, options, formatters) {
            return {
                "type": chartType || "ColumnChart", // default to a pie chart
                "data": data || {// default to no data
                    "cols": [],
                    "rows": []
                },
                "options": options || {}, // default to no options
                "formatters": formatters || {} // default to no formatters
            };
        }
				//START NILESH-TSK21
        function getBaseHighChartsObject(Title, chartType, categories, series) {

            return {
                options: {
                    chart: {
                        //type: 'column',
                        type: chartType || 'column',
                        //events: {
                        //    load: function(event) {
                        //        var element = this;
                        //    }
                        //}
                    },
                    tooltip: {
                        shared: false,
                        formatter: function () {
                            /*
                            var tooltip;
                            tooltip = '<span><b>' + this.series.name + '</b></span><br/>' +
                                        '<span>Frequency : <b>' + this.y + '</b></span><br/>' +
                                        '<span><b>' + this.y + '</b> of total submissions (' + 0 + ')</span><br/>' +
                                        '<span><b>' + this.y + '</b> of submitted answers (' + 0 + ')</span><br/>' +
                                        '<span><b>' + this.y + '</b> rate of response by question response rate (' + 0 + ')</span><br/>';
                            //return tooltip;
                            */
                            return this.series.options.tooltipText;
                        }
                    },
                },

                "title": {
                    text: Title
                },
                "xAxis": {
                    visible: (categories && categories.length > 0 ? true : false),
                    categories: categories || []
                },
                "credits": {
                    enabled: false
                },
                //plotOptions: {
                //    series: {
                //        animation: {
                //            complete: function () {
                //                console.log("Executed : ");
                //            }
                //        }
                //    }
                //},
                
                "series": series || []

            }
        }
        //END NILESH-TSK21
    }


    function reportingQuestionLogic(repQConstants, repLogic, repConst, StaticValues) {
        /*jshint validthis:true */
        var questionLogic = this;
        questionLogic.ConvertGCDataToCSV = convertGCDataToCSV;

        questionLogic.DisplayComments = displayComments;
        questionLogic.FormatDataForCorrectReportType = formatDataForCorrectReportType;

        questionLogic.GetDataRows_Boolean = getDataRows_Boolean;
        questionLogic.GetDataRows_BooleanOther = getDataRows_BooleanOther;
        questionLogic.GetDataRows_TextEntry = getDataRows_TextEntry;
        questionLogic.GetDataRows_RangeAnswers = getDataRows_RangeAnswers;
        questionLogic.GetDataRows_Comments = getDataRows_Comments;

        questionLogic.CheckAnswerType_IsBooleanAnswerType = checkAnswerType_IsBooleanAnswerType;
        questionLogic.CheckAnswerType_IsOtherAnswerType = checkAnswerType_IsOtherAnswerType;
        questionLogic.CheckAnswerType_IsRangeAnswerType = checkAnswerType_IsRangeAnswerType;
        questionLogic.CheckAnswerType_IsHiddenAnswerType = checkAnswerType_IsHiddenAnswerType;
        questionLogic.CheckAnswerType_IsDropDownAnswerType = checkAnswerType_IsDropDownAnswerType;
        questionLogic.CheckAnswerType_IsCommentAnswerType = checkAnswerType_IsCommentAnswerType;
        questionLogic.CheckAnswerType_IsTextboxAnswerType = checkAnswerType_IsTextboxAnswerType;
        questionLogic.CheckAnswerType_IsCalendarAnswerType = checkAnswerType_IsCalendarAnswerType;
        questionLogic.CheckAnswerType_IsFileUploadAnswerType = checkAnswerType_IsFileUploadAnswerType;

        questionLogic.GetAbstractTimeValue = getAbstractTimeValue;

        return questionLogic;

        function convertGCDataToCSV(googleChartObject) {
            var dt_cols = googleChartObject.data.cols.length;
            var dt_rows = googleChartObject.data.rows.length;

            var csv_cols = [];
            var csv_out;

            for (var i = 0; i < dt_cols; i++) {
                csv_cols.push(googleChartObject.data.cols[i].label.replace(/,/g, ""));
            }

            csv_out = csv_cols.join(",") + "\r\n";

            for (var k = 0; k < dt_rows; k++) {
                var raw_col = [];
                for (var m = 0; m < dt_cols; m++) {
                    if (googleChartObject.data.rows[k].c[m].v.replace) {
                        raw_col.push(googleChartObject.data.rows[k].c[m].v.replace(/,/g, ""));
                    } else {
                        raw_col.push(googleChartObject.data.rows[k].c[m].v);
                    }
                }
                csv_out += raw_col.join(",") + "\r\n";
            }

            return csv_out;
        }

        function displayComments(bit) {
            return bit === 1 ? true : false;
        }

				//START NILESH-TSK21
        function makeTooltipForTotalsObjectHC(dataRow, frequencyCount, questionResponseRate) {
            var totalPercent = ((dataRow.data[0] / repConst.FilteredVotesCount) * 100).toFixed(1);
            var frequencyPercent = ((dataRow.data[0] / frequencyCount) * 100).toFixed(1);
            var answerFrequencyByQuestionFrequency = ((dataRow.data[0] / questionResponseRate) * 100).toFixed(1);

            var toolTip = '<span><b>' + dataRow.name + '</b></span><br/>' +
                            '<span>Frequency : <b>' + dataRow.data[0].toString() + '</b></span><br/>' +
                            '<span><b>' + totalPercent + '%</b> of total submissions (' + repConst.FilteredVotesCount + ')</span><br/>' +
                            '<span><b>' + frequencyPercent + '%</b> of submitted answers (' + frequencyCount + ')</span><br/>' +
                            '<span><b>' + answerFrequencyByQuestionFrequency + '%</b> rate of response by question response rate (' + questionResponseRate + ')</span><br/>';
            return toolTip;
        }

        function makeTooltipForTotalsPercentDataObjectHC(title, frequencyOfAnswer, percent) {
            var toolTip = '<span><b>' + title + '</b></span><br/>' +
                          '<span><b>' + percent + '%</b> of total submissions (' + repConst.FilteredVotesCount + ')</span><br/>' +
                          '<span>Frequency : <b>' + frequencyOfAnswer + '%</b><span>';
            return toolTip;
           
        }

        //This Function Internaly Called From Highchart So in this function "this" refered to current series data
        function makeTooltipForHistoryDataObjectHC() {
            var series = this.point.series.chart.series;
            var index = this.point.series.xData.indexOf(this.point.x);
            var timeFrequencyCount = 0;
            $.each(series, function (i, s) {
                // name  : s.data[index].category
                // Value : s.data[index].y
                timeFrequencyCount += s.data[index].y
            });


            var questionTitle = this.x;
            var frequency = this.y;
            var answerTitle = this.series.name;

            var timeQuestionResponseRate = this.series.options.arrTimeResRate[index];
           
            //CALCULATIONS
            var totalPercent = ((frequency / repConst.FilteredVotesCount) * 100).toFixed(1);
            var timeFrequencyPercent = ((frequency / timeFrequencyCount) * 100).toFixed(1);
            var timeAnswerFrequencyBytimeQuestionResponseFrequency = ((frequency / timeQuestionResponseRate) * 100).toFixed(1);

            //START NILESH-TSK42
            var toolTip = '';
            if (StaticValues.EnableSumOfVoterAnswerForQuestion) {
                toolTip = '<span><b>' + questionTitle + '</b></span><br/>' +
                        '<span><b>' + answerTitle + ' : ' + frequency + '</b></span><br/>';
            }
            else {
                toolTip = '<span><b>' + questionTitle + '</b></span><br/>' +
                          '<span><b>' + answerTitle + '</b></span><br/>' +
                          '<span>Frequency: ' + frequency + '</span><br/>' +
                          '<span><b>' + totalPercent + '%</b> of total submissions (' + repConst.FilteredVotesCount + ')</span><br/>' +
                          '<span><b>' + timeFrequencyPercent + '%</b> of submitted answers for time frame (' + timeFrequencyCount + ')</span><br/>' +
                          '<span><b>' + timeAnswerFrequencyBytimeQuestionResponseFrequency + '%</b> rate of response by question response rate for time frame(' + timeQuestionResponseRate + ')</span><br/>';

            }
            //END NILESH-TSK42
            return toolTip;
        }

        //history - percent => This Function Internaly Called From Highchart So in this function "this" refered to current series data
        function makeTooltipForHistoryPercentDataObjectHC() {
            var index = this.point.series.xData.indexOf(this.point.x);
            var timeFrequencyCount = this.series.options.arrTimeResRate[index];

            var questionTitle = this.x;
            var answerTitle = this.series.name;

            var toolTip = '<span><b>' + questionTitle + '</b></span><br/>' +
                          '<span><b>' + answerTitle + '</b></span><br/>' +
                          '<span><b>' + this.y + '%</b> of ' + timeFrequencyCount + '</span><br/>';
            return toolTip;

        
            var wrapperDiv = document.createElement("div");
            var questionTitleDiv = document.createElement("div");
            var answerTitleDiv = document.createElement("div");
            var percentageDiv = document.createElement("div");
            wrapperDiv.classList.add("googleChartsToolTip");
            wrapperDiv.appendChild(questionTitleDiv);
            wrapperDiv.appendChild(answerTitleDiv);
            wrapperDiv.appendChild(percentageDiv);
            var questionTitleLabel = document.createElement("label");
            questionTitleLabel.innerText = questionTitle;
            questionTitleLabel.classList.add("toolTipBold");
            questionTitleDiv.appendChild(questionTitleLabel);
            var answerTitleLabel = document.createElement("label");
            answerTitleLabel.innerText = answerTitle;
            answerTitleLabel.classList.add("toolTipBold");
            answerTitleDiv.appendChild(answerTitleLabel);

            var percentageLabel = document.createElement("label");
            percentageLabel.innerText = percentage + "% of " + timeFrequencyCount;
            percentageDiv.appendChild(percentageLabel);


            var innerHTMLContainer = document.createElement("div");
            innerHTMLContainer.appendChild(wrapperDiv);

            return {
                "v": innerHTMLContainer.innerHTML,
                "p": {}
            };
        }

        //END NILESH-TSK21
				
        // totals - frequency
        function makeTooltipForTotalsObject(dataRow, frequencyCount, questionResponseRate) {
            var totalPercent = ((dataRow[1].v / repConst.FilteredVotesCount) * 100).toFixed(1);
            var frequencyPercent = ((dataRow[1].v / frequencyCount) * 100).toFixed(1);
            var answerFrequencyByQuestionFrequency = ((dataRow[1].v / questionResponseRate) * 100).toFixed(1);

            var toolTip = "<div class=\"googleChartsToolTip\">" +
                                "<div>" +
                                    "<label style=\"font-weight: bold;\">" + dataRow[0].v + "</label>" +
                                "</div>" +
                                "<div>" +
                                    "<label>Frequency: " + dataRow[1].v.toString() + "</label>" +
                                "</div>" +
                                "<div>" +
                                    "<label>" + totalPercent + "% of total submissions (" + repConst.FilteredVotesCount + ")</label>" +
                                "</div>" +
                                "<div>" +
                                    "<label>" + frequencyPercent + "% of submitted answers (" + frequencyCount + ")</label>" +
                                "</div>" +
                                "<div>" +
                                    "<label>" + answerFrequencyByQuestionFrequency + "% rate of response by question response rate (" + questionResponseRate + ")</label>" +
                                "</div>" +
                            "</div>";
            return {
                "v": toolTip,
                "p": {}
            };
        }
				
				
								//START NILESH-CNG-31
        function makeTooltipForTotalsObject_TotalMinute(dataRow, frequencyCount, questionResponseRate) {
            var toolTip = "<div class=\"googleChartsToolTip\">" +
                                "<div>" +
                                    "<label style=\"font-weight: bold;\">" + dataRow[0].v + "</label>" +
                                "</div>" +
                                "<div>" +
                                    "<label style='white-space:nowrap;'>Frequency: " + dataRow[1].v.toString() + "</label>" +
                                "</div>" +
                            "</div>";
            return {
                "v": toolTip,
                "p": {}
            };
        }
        function makeTooltipForHistoryDataObject_TotalMinute(frequency, questionTitle, answerTitle, timeFrequencyCount, timeQuestionResponseRate) {
            
            var wrapperDiv = document.createElement("div");
            var questionTitleDiv = document.createElement("div");
            var frequencyDiv = document.createElement("div");
            var totalPercentDiv = document.createElement("div");
             
            wrapperDiv.classList.add("googleChartsToolTip");
            wrapperDiv.appendChild(questionTitleDiv);
            wrapperDiv.appendChild(frequencyDiv);
            wrapperDiv.appendChild(totalPercentDiv);

            var questionTitleLabel = document.createElement("label");
            questionTitleLabel.innerText = questionTitle + " - " + answerTitle;
            questionTitleLabel.style = "white-space:nowrap;"
            questionTitleLabel.classList.add("toolTipBold");
            questionTitleDiv.appendChild(questionTitleLabel);

            var frequencyLabel = document.createElement("label");
            frequencyLabel.innerText = "Frequency: " + frequency;
            frequencyLabel.style = "white-space:nowrap;"
            frequencyDiv.appendChild(frequencyLabel);

            var totalPercentLabel = document.createElement("label");
            totalPercentLabel.innerText = "No. of total submissions : " + repConst.FilteredVotesCount;
            totalPercentLabel.style = "white-space:nowrap;"
            totalPercentDiv.appendChild(totalPercentLabel);

            
            var innerHTMLContainer = document.createElement("div");
            innerHTMLContainer.appendChild(wrapperDiv);

            return {
                "v": innerHTMLContainer.innerHTML,
                "p": {}
            };
        }
        //END NILESH-CNG-31

				
        // history - frequency
        function makeTooltipForHistoryDataObject(frequency, questionTitle, answerTitle, timeFrequencyCount, timeQuestionResponseRate) {
            var totalPercent = ((frequency / repConst.FilteredVotesCount) * 100).toFixed(1);
            var timeFrequencyPercent = ((frequency / timeFrequencyCount) * 100).toFixed(1);
            var timeAnswerFrequencyBytimeQuestionResponseFrequency = ((frequency / timeQuestionResponseRate) * 100).toFixed(1);

            var wrapperDiv = document.createElement("div");
            var questionTitleDiv = document.createElement("div");
            var answerTitleDiv = document.createElement("div");
            var frequencyDiv = document.createElement("div");
            var totalPercentDiv = document.createElement("div");
            var timeFrequencyPercentDiv = document.createElement("div");
            var timeAnswerFreqByQuestionRespRateDiv = document.createElement("div");
            wrapperDiv.classList.add("googleChartsToolTip");
            wrapperDiv.appendChild(questionTitleDiv);
            wrapperDiv.appendChild(answerTitleDiv);
            wrapperDiv.appendChild(frequencyDiv);
            wrapperDiv.appendChild(totalPercentDiv);
            wrapperDiv.appendChild(timeFrequencyPercentDiv);
            wrapperDiv.appendChild(timeAnswerFreqByQuestionRespRateDiv);
            var questionTitleLabel = document.createElement("label");
            questionTitleLabel.innerText = questionTitle;
            questionTitleLabel.classList.add("toolTipBold");
            questionTitleDiv.appendChild(questionTitleLabel);
            var answerTitleLabel = document.createElement("label");
            answerTitleLabel.innerText = answerTitle;
            answerTitleLabel.classList.add("toolTipBold");
            answerTitleDiv.appendChild(answerTitleLabel);
            var frequencyLabel = document.createElement("label");
            frequencyLabel.innerText = "Frequency: " + frequency;
            frequencyDiv.appendChild(frequencyLabel);
            var totalPercentLabel = document.createElement("label");
            totalPercentLabel.innerText = totalPercent + "% of total submissions (" + repConst.FilteredVotesCount + ")";
            totalPercentDiv.appendChild(totalPercentLabel);
            var timeFrequencyLabel = document.createElement("label");
            timeFrequencyLabel.innerText = timeFrequencyPercent + "% of submitted answers for time frame (" + timeFrequencyCount + ")";
            timeFrequencyPercentDiv.appendChild(timeFrequencyLabel);
            var timeAnswerFreqByQuestRespRateLabel = document.createElement("label");
            timeAnswerFreqByQuestRespRateLabel.innerText = timeAnswerFrequencyBytimeQuestionResponseFrequency + "% rate of response by question response rate for time frame (" + timeQuestionResponseRate + ")";
            timeAnswerFreqByQuestionRespRateDiv.appendChild(timeAnswerFreqByQuestRespRateLabel);

            var innerHTMLContainer = document.createElement("div");
            innerHTMLContainer.appendChild(wrapperDiv);

            return {
                "v": innerHTMLContainer.innerHTML,
                "p": {}
            };
        }

        // totals - percent
        function makeTooltipForTotalsPercentDataObject(title, frequencyOfAnswer, percent) {
            var toolTip = "<div class=\"googleChartsToolTip\">" +
                                "<div>" +
                                    "<label style=\"font-weight: bold;\">" + title + "</label>" +
                                "</div>" +
                                "<div>" +
                                    "<label>" + percent + "% of total submissions (" + repConst.FilteredVotesCount + ")</label>" +
                                "</div>" +
                                "<div>" +
                                    "<label>Frequency: " + frequencyOfAnswer + "</label>" +
                                "</div>" +
                            "</div>";
            return {
                "v": toolTip,
                "p": {}
            };
        }

        // history - percent
        function makeTooltipForHistoryPercentDataObject(percentage, questionTitle, answerTitle, timeFrequencyCount) {

            var wrapperDiv = document.createElement("div");
            var questionTitleDiv = document.createElement("div");
            var answerTitleDiv = document.createElement("div");
            var percentageDiv = document.createElement("div");
            wrapperDiv.classList.add("googleChartsToolTip");
            wrapperDiv.appendChild(questionTitleDiv);
            wrapperDiv.appendChild(answerTitleDiv);
            wrapperDiv.appendChild(percentageDiv);
            var questionTitleLabel = document.createElement("label");
            questionTitleLabel.innerText = questionTitle;
            questionTitleLabel.classList.add("toolTipBold");
            questionTitleDiv.appendChild(questionTitleLabel);
            var answerTitleLabel = document.createElement("label");
            answerTitleLabel.innerText = answerTitle;
            answerTitleLabel.classList.add("toolTipBold");
            answerTitleDiv.appendChild(answerTitleLabel);

            var percentageLabel = document.createElement("label");
            percentageLabel.innerText = percentage + "% of " + timeFrequencyCount;
            percentageDiv.appendChild(percentageLabel);


            var innerHTMLContainer = document.createElement("div");
            innerHTMLContainer.appendChild(wrapperDiv);

            return {
                "v": innerHTMLContainer.innerHTML,
                "p": {}
            };
        }

        function formatDataForCorrectReportType(baseQuestion, chartType, dataFormat, timeInterval) {
            var returnValue = null;
            var dataFormatIntValue = repQConstants.DataFormatEnum[dataFormat];
            if (dataFormatIntValue === 0) {
                returnValue = formatData_Totals(baseQuestion, chartType, dataFormat);
            } else if (dataFormatIntValue === 1) {
                returnValue = formatData_History(baseQuestion, chartType, dataFormat, timeInterval);
            } else if (dataFormatIntValue === 2) {
                returnValue = formatData_TotalsPercent(baseQuestion, chartType, dataFormat);
            } else if (dataFormatIntValue === 3) {
                returnValue = formatData_HistoryPercent(baseQuestion, chartType, dataFormat, timeInterval);
            }
			//START NILESH-TSK21-4
            else if (dataFormatIntValue === 4) {
                returnValue = formatData_Distribution(baseQuestion, chartType, dataFormat, timeInterval);
            }
            //END NILESH-TSK21-4
            return returnValue;
        }
				
        // totals - frequency
		function formatData_Totals(baseQuestion, chartType, dataFormat) {
            var dataFormatEnum = repQConstants.DataFormatEnum[dataFormat];
            var returnValue = {
                CommentList: [],
                GoogleChartsObjectList: []
                //START NILESH-TSK21
                ,
                HighChartObjectList: []
                //END NILESH-TSK21  
            };

            var booleanAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsBooleanAnswerType(e); }); // check boolean
            var booleanOtherAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsOtherAnswerType(e); }); // check for boolean-other
            var rangeAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsRangeAnswerType(e); }); // check range
            var dropDownAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsDropDownAnswerType(e); }); // check dropdown
            var commentAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsCommentAnswerType(e); }); // check comments
            var textEntryAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsTextboxAnswerType(e); }); // check for text box

            
            //START NILESH-TSK21
            var baseGoogleChartsObject = {}, secondaryGCObject = {};

            var baseHighChartObject = {}, baseHighChartSecondaryObject = {};
            if (localStorage.getItem("IsPremiumUser") == "true") {
                var baseHighChartObject = repQConstants.GetBaseHighChartsObject(baseQuestion.CleanQuestionText, 'column', null, null);
                var baseHighChartSecondaryObject = repQConstants.GetBaseHighChartsObject(baseQuestion.CleanQuestionText, 'column', null, null);

                // first three calls all can manipulate the data object
                if (booleanAnswers.length > 0) {
                    var newRowsForHC = getDataRowsHC_Boolean(booleanAnswers, dataFormatEnum);
                    for (var n in newRowsForHC) {
                        baseHighChartObject.series.push(newRowsForHC[n]);
                    }
                }

                if (booleanOtherAnswers.length > 0) {
                    var newRows_otherForHC = getDataRowsHC_BooleanOther(booleanOtherAnswers, dataFormatEnum);
                    for (var n in newRows_otherForHC) {
                        baseHighChartObject.series.push(newRows_otherForHC[n]);
                    }
                }

                if (textEntryAnswers.length > 0) {
                    var newRows_textHC = getDataRowsHC_TextEntry(textEntryAnswers, dataFormatEnum);
                    for (var n in newRows_textHC) {
                        baseHighChartObject.series.push(newRows_textHC[n]);
                    }
                }

                // range or dropdown answers will require a different method of gathering the data
                if (rangeAnswers.length > 0) {
                    baseHighChartSecondaryObject.series = getDataRowsHC_RangeAnswers(rangeAnswers, dataFormatEnum);
                }
            }
            else {
                //END NILESH-TSK21
                var options = {
                    "tooltip": { "isHtml": true },
                    "title": baseQuestion.CleanQuestionText
                };
                var columns = [];
                var rows = [];
                columns.push({
                    "id": "a",
                    "label": "Answers",
                    "type": "string"
                });
                columns.push({
                    "id": "f",
                    "label": "Frequency",
                    "type": "number"
                });
                columns.push({
                    "id": "",
                    "role": "tooltip",
                    "type": 'string',
                    "p": {
                        "role": "tooltip",
                        "html": true
                    }
                });
                baseGoogleChartsObject = repQConstants.GetBaseGoogleChartsObject(chartType, null, options, null);
                secondaryGCObject = repQConstants.GetBaseGoogleChartsObject(chartType, null, options, null);
                for (var k = 0; k < columns.length; k++) {
                    baseGoogleChartsObject.data.cols.push(columns[k]);
                    secondaryGCObject.data.cols.push(columns[k]);
                }

                // first three calls all can manipulate the data object
                if (booleanAnswers.length > 0) {
                    var newRows = getDataRows_Boolean(booleanAnswers, dataFormatEnum);
                    for (var n in newRows) {
                        baseGoogleChartsObject.data.rows.push(newRows[n]);
                    }
                }

                if (booleanOtherAnswers.length > 0) {
                    var newRows_other = getDataRows_BooleanOther(booleanOtherAnswers, dataFormatEnum);
                    for (var q in newRows_other) {
                        baseGoogleChartsObject.data.rows.push(newRows_other[q]);
                    }
                }

                if (textEntryAnswers.length > 0) {
                    var newRows_text = getDataRows_TextEntry(textEntryAnswers, dataFormatEnum);
                    for (var z in newRows_text) {
                        baseGoogleChartsObject.data.rows.push(newRows_text[z]);
                    }
                }

                // range or dropdown answers will require a different method of gathering the data
                if (rangeAnswers.length > 0) {
                    secondaryGCObject.data.rows = getDataRows_RangeAnswers(rangeAnswers, dataFormatEnum);
                }
                //START NILESH-TSK21
            }
            //END NILESH-TSK21

            //console.log("Final HighChartObject");
            //console.log(baseHighChartObject);
            //console.log("Final baseGoogleChartsObject");
            //console.log(baseGoogleChartsObject);

            //console.log("newRows Count - " + newRows.length + " newRowsForHC Count - " + newRowsForHC.count)

            //console.log("commentAnswers = ");
            //console.log(commentAnswers);
            //console.log("commentAnswersForSelection = ");
            //console.log(commentAnswersForSelection);


            if (dropDownAnswers.length > 0) { // ignoring this for now
                getDataRows_DropDownAnswers(dropDownAnswers, dataFormatEnum);
            }

            // comments are completely separate, not going to do anything with google charts for these
            if (commentAnswers.length > 0) {
                returnValue.CommentList = getDataRows_Comments(commentAnswers);
            }
            // else if(commentAnswersForSelection.length > 0)
            // {
            // returnValue.CommentList = getDataRows_Comments(commentAnswersForSelection);
            // }




            returnValue.GoogleChartsObjectList = [
                baseGoogleChartsObject,
                secondaryGCObject
            ];

            //START NILESH-TSK21
            returnValue.HighChartObjectList = [
                baseHighChartObject,
                baseHighChartSecondaryObject
            ];
            //END NILESH-TSK21

            //console.log(BrQC.Question);
            return returnValue;
        }
		
	    // history - frequency
        function formatData_History(baseQuestion, chartType, dataFormat, timeInterval) {
            var dataFormatEnum = repQConstants.DataFormatEnum[dataFormat];
            var timeIntervalInt = repQConstants.TimeIntervalEnum[timeInterval];
            var returnValue = {
                CommentList: [],
                //START NILESH-TSK21
                HighChartObjectList: [],
                //END NILESH-TSK21
                GoogleChartsObjectList: []

            };
            var options = {
                "title": baseQuestion.CleanQuestionText,
                //"isStacked": true,
                "tooltip": { "isHtml": true }
            };
            var columns = [];
            var rows = [];
            var abstractTimeStartNumber = 0;
            var abstractTimeEndNumber = 0;
            var abstractTimeRoundTrip = 0;
            var momentFunc = "";
            var idTextFormat = "";
            var textFormat = "";
            switch (timeIntervalInt) {
                case 0: // day
                    abstractTimeStartNumber = repConst.StartDate.dayOfYear();
                    abstractTimeEndNumber = repConst.EndDate.dayOfYear();
                    abstractTimeRoundTrip = 365;
                    momentFunc = "dayOfYear";
                    idTextFormat = "DDDD";
                    textFormat = "DDDo [day of the year]";
                    columns.push({
                        "id": "dayOfTheYear",
                        "label": "Day",
                        "type": "string"
                    });
                    break;
                case 1: // week
                    abstractTimeStartNumber = repConst.StartDate.week();
                    abstractTimeEndNumber = repConst.EndDate.week();
                    abstractTimeRoundTrip = 52;
                    momentFunc = "week";
                    idTextFormat = "ww";
                    textFormat = "wo [week of the year]";
                    columns.push({
                        "id": "weekOfTheYear",
                        "label": "Week",
                        "type": "string"
                    });
                    break;
                case 3: // month
                    abstractTimeStartNumber = repConst.StartDate.month();
                    abstractTimeEndNumber = repConst.EndDate.month();
                    abstractTimeRoundTrip = 12;
                    momentFunc = "month";
                    idTextFormat = "MM";
                    textFormat = "MMMM";
                    columns.push({
                        "id": "month",
                        "label": "Month",
                        "type": "string"
                    });
                    break;
                case 5: // quarter
                    abstractTimeStartNumber = repConst.StartDate.quarter();
                    abstractTimeEndNumber = repConst.EndDate.quarter();
                    abstractTimeRoundTrip = 4;
                    momentFunc = "quarter";
                    idTextFormat = "Q";
                    textFormat = "[Quarter:] Q";
                    columns.push({
                        "id": "quarter",
                        "label": "Quarter",
                        "type": "string"
                    });
                    break;
                case 7: // year
                    abstractTimeStartNumber = repConst.StartDate.year();
                    abstractTimeEndNumber = repConst.EndDate.year();
                    abstractTimeRoundTrip = 1;
                    momentFunc = "year";
                    idTextFormat = "YYYY";
                    textFormat = "YYYY";
                    columns.push({
                        "id": "year",
                        "label": "Year",
                        "type": "string"
                    });
                    break;
                default: // shouldn't happen
                    break;
            }
            var multiplier = repConst.EndDate.year() - repConst.StartDate.year();
            if (multiplier > 0) {
                abstractTimeEndNumber = abstractTimeEndNumber + (abstractTimeRoundTrip * multiplier);
            }
            //if (abstractTimeStartNumber >= abstractTimeEndNumber) {
            //    abstractTimeStartNumber = abstractTimeStartNumber - (abstractTimeRoundTrip * multiplier);
            //}

            //START NILESH-TSK21
            var hcCategory = [];
            //END NILESH-TSK21
            for (var i = abstractTimeStartNumber; i <= abstractTimeEndNumber; i++) {
                rows.push({
                    "c": [
                        {
                            //"id": moment()[momentFunc](i).format(idTextFormat),
                            "id": i,
                            "v": moment(repConst.StartDate.year(), "YYYY")[momentFunc](i).format(textFormat)
                        }
                    ]
                });
                //START NILESH-TSK21
                hcCategory.push(moment(repConst.StartDate.year(), "YYYY")[momentFunc](i).format(textFormat));
                //END NILESH-TSK21
            }
            var baseGoogleChartsObject = repQConstants.GetBaseGoogleChartsObject(chartType, null, options, null);
            var secondaryGCObject = repQConstants.GetBaseGoogleChartsObject(chartType, null, options, null);
            for (var k = 0; k < columns.length; k++) {
                baseGoogleChartsObject.data.cols.push(columns[k]);
                secondaryGCObject.data.cols.push(columns[k]);
            }
            for (var l = 0; l < rows.length; l++) {
                baseGoogleChartsObject.data.rows.push(rows[l]);
                secondaryGCObject.data.rows.push(rows[l]);
            }

            //START NILESH-TSK21
            var baseHighChartObject = repQConstants.GetBaseHighChartsObject(baseQuestion.CleanQuestionText, 'column', hcCategory, null);
            var baseHighChartSecondaryObject = repQConstants.GetBaseHighChartsObject(baseQuestion.CleanQuestionText, 'column', hcCategory, null);
            //END NILESH-TSK21

            var booleanAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsBooleanAnswerType(e); }); // check boolean

            var booleanOtherAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsOtherAnswerType(e); }); // check for boolean-other

            var rangeAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsRangeAnswerType(e); }); // check range

            var dropDownAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsDropDownAnswerType(e); }); // check dropdown

            var commentAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsCommentAnswerType(e); }); // check comments

            var textEntryAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsTextboxAnswerType(e); }); // check for text box

            // first three calls all can manipulate the data object
            if (booleanAnswers.length > 0) {
                var newRows = getDataRows_Boolean(booleanAnswers, dataFormatEnum, momentFunc, abstractTimeRoundTrip);
                //console.log(newRows);
                for (var x = 0; x < newRows.NewColumns.length; x++) {
                    baseGoogleChartsObject.data.cols.push(newRows.NewColumns[x]);
                }
                //var timeframeCount
                for (var m = 0; m < newRows.DataLists.length; m++) {
                    for (var j = 0, len = baseGoogleChartsObject.data.rows.length; j < len; j++) {
                        var abstractTimeNumber = baseGoogleChartsObject.data.rows[j].c[0].id;
                        if (newRows.DataLists[m][abstractTimeNumber]) {
                            var newObject_boolean = {
                                "v": newRows.DataLists[m][abstractTimeNumber]
                            };
                            baseGoogleChartsObject.data.rows[j].c.push(newObject_boolean);
                        } else {
                            baseGoogleChartsObject.data.rows[j].c.push({
                                "v": "0.0"
                            });
                        }
                    }
                }

                //START NILESH-TSK21

                //var timeframeCount
                var newRowsForHC = getDataRowsHC_Boolean(booleanAnswers, dataFormatEnum, momentFunc, abstractTimeRoundTrip);

                var arrTimeResponceRate = [];
                for (var j = abstractTimeStartNumber; j <= abstractTimeEndNumber; j++) {
                    arrTimeResponceRate.push(repLogic.GetVoterCountByDateRangeIfQuestionWasAnswered(momentFunc, j, baseQuestion.OldQuestionID));
                }

                for (var m = 0; m < newRowsForHC.DataLists.length; m++) {
                    var seriesData = [];
                    for (var j = abstractTimeStartNumber; j <= abstractTimeEndNumber; j++) {
                        if (newRowsForHC.DataLists[m][j]) {
                            seriesData.push(parseInt(newRowsForHC.DataLists[m][j]));
                        }
                        else {
                            seriesData.push(0);
                        }
                    }

                    var objChartAnswer = {
                        "name": newRowsForHC.NewColumns[m].label,
                        "data": seriesData,
                        "arrTimeResRate": arrTimeResponceRate
                    }
                    baseHighChartObject.series.push(objChartAnswer);
                }
                //END NILESH-TSK21
            }

            if (booleanOtherAnswers.length > 0) {
                var newRows_other = getDataRows_BooleanOther(booleanOtherAnswers, dataFormatEnum, momentFunc, abstractTimeRoundTrip);
                for (var s = 0; s < newRows_other.NewColumns.length; s++) {
                    baseGoogleChartsObject.data.cols.push(newRows_other.NewColumns[s]);
                }
                for (var r = 0; r < newRows_other.DataLists.length; r++) {
                    for (var b = 0, len2 = baseGoogleChartsObject.data.rows.length; b < len2; b++) {
                        var abstractTimeNumber_other = baseGoogleChartsObject.data.rows[b].c[0].id;
                        if (newRows_other.DataLists[r][abstractTimeNumber_other]) {
                            baseGoogleChartsObject.data.rows[b].c.push({
                                "v": newRows_other.DataLists[r][abstractTimeNumber_other]
                            });
                        } else {
                            baseGoogleChartsObject.data.rows[b].c.push({
                                "v": "0.0"
                            });
                        }
                    }
                }

                
                //START NILESH-TSK21
                var newRows_otherForHC = getDataRowsHC_BooleanOther(booleanOtherAnswers, dataFormatEnum, momentFunc, abstractTimeRoundTrip);

                var arrTimeResponceRate = [];
                for (var j = abstractTimeStartNumber; j <= abstractTimeEndNumber; j++) {
                    arrTimeResponceRate.push(repLogic.GetVoterCountByDateRangeIfQuestionWasAnswered(momentFunc, j, baseQuestion.OldQuestionID));
                }

                for (var m = 0; m < newRows_otherForHC.DataLists.length; m++) {
                    var seriesData = [];
                    for (var j = abstractTimeStartNumber; j <= abstractTimeEndNumber; j++) {
                        if (newRows_otherForHC.DataLists[m][j]) {
                            seriesData.push(parseInt(newRows_otherForHC.DataLists[m][j]));
                        }
                        else {
                            seriesData.push(0);
                        }
                    }

                    var objChartAnswer = {
                        "name": newRows_otherForHC.NewColumns[m].label,
                        "data": seriesData,
                        "arrTimeResRate": arrTimeResponceRate
                    }
                    baseHighChartObject.series.push(objChartAnswer);
                }
                //END NILESH-TSK21
            }

            if (textEntryAnswers.length > 0) {
                var newRows_text = getDataRows_TextEntry(textEntryAnswers, dataFormatEnum, momentFunc, abstractTimeRoundTrip);
                for (var u = 0; u < newRows_text.NewColumns.length; u++) {
                    baseGoogleChartsObject.data.cols.push(newRows_text.NewColumns[u]);
                }
                for (var c = 0; c < newRows_text.DataLists.length; c++) {
                    for (var f = 0, len3 = baseGoogleChartsObject.data.rows.length; f < len3; f++) {
                        var abstractTimeNumber_text = baseGoogleChartsObject.data.rows[f].c[0].id;
                        if (newRows_text.DataLists[c][abstractTimeNumber_text]) {
                            baseGoogleChartsObject.data.rows[f].c.push({
                                "v": newRows_text.DataLists[c][abstractTimeNumber_text]
                            });
                        } else {
                            baseGoogleChartsObject.data.rows[f].c.push({
                                "v": "0.0"
                            });
                        }
                    }
                }


                //START NILESH-TSK21
                var newRows_textHC = getDataRowsHC_TextEntry(textEntryAnswers, dataFormatEnum, momentFunc, abstractTimeRoundTrip);

                var arrTimeResponceRate = [];
                for (var j = abstractTimeStartNumber; j <= abstractTimeEndNumber; j++) {
                    arrTimeResponceRate.push(repLogic.GetVoterCountByDateRangeIfQuestionWasAnswered(momentFunc, j, baseQuestion.OldQuestionID));
                }

                for (var m = 0; m < newRows_textHC.DataLists.length; m++) {
                    var seriesData = [];
                    for (var j = abstractTimeStartNumber; j <= abstractTimeEndNumber; j++) {
                        if (newRows_textHC.DataLists[m][j]) {
                            seriesData.push(parseInt(newRows_textHC.DataLists[m][j]));
                        }
                        else {
                            seriesData.push(0);
                        }
                    }

                    var objChartAnswer = {
                        "name": newRows_textHC.NewColumns[m].label,
                        "data": seriesData,
                        "arrTimeResRate": arrTimeResponceRate
                    }
                    baseHighChartObject.series.push(objChartAnswer);
                }
                //END NILESH-TSK21

            }

            // range or dropdown answers will require a different method of gathering the data
            if (rangeAnswers.length > 0) {
                secondaryGCObject.data.rows = getDataRows_RangeAnswers(rangeAnswers, dataFormatEnum);

                //START NILESH-TSK21
                baseHighChartSecondaryObject.series = getDataRowsHC_RangeAnswers(rangeAnswers, dataFormatEnum);
                //END NILESH-TSK21
            } else {
                secondaryGCObject.data.rows = [];
                baseHighChartSecondaryObject.series = [];
            }

            if (dropDownAnswers.length > 0) { // ignoring this for now
                getDataRows_DropDownAnswers(dropDownAnswers, dataFormatEnum);
            }

            // comments are completely separate, not going to do anything with google charts for these
            if (commentAnswers.length > 0) {
                returnValue.CommentList = getDataRows_Comments(commentAnswers);
            }

            //console.log(baseGoogleChartsObject);

            for (var aa = 1; aa < baseGoogleChartsObject.data.cols.length; aa += 2) { // what an absolute hack
                baseGoogleChartsObject.data.cols.splice(aa + 1, 0, {
                    "id": baseGoogleChartsObject.data.cols[aa].id + "-toolTip",
                    "role": "tooltip",
                    "type": 'string',
                    "p": {
                        "role": "tooltip",
                        "html": true
                    }
                });
                for (var bb = 0; bb < baseGoogleChartsObject.data.rows.length; bb++) { // loop the data rows and only modify the given question we added a tooltip for
                    var timeframeTotal = 0;
                    var cc = 1;
                    while (cc < baseGoogleChartsObject.data.rows[bb].c.length) {
                        if (baseGoogleChartsObject.data.rows[bb].c[cc] && baseGoogleChartsObject.data.rows[bb].c[cc].v !== "0.0") {
                            timeframeTotal += baseGoogleChartsObject.data.rows[bb].c[cc].v;
                        }
                        if (cc < aa) {
                            cc += 2;
                        } else {
                            cc++;
                        }
                    }
                    if (baseGoogleChartsObject.data.rows[bb].c[aa]) {
                        var timeframeTotalResponseRate = repLogic.GetVoterCountByDateRangeIfQuestionWasAnswered(momentFunc, baseGoogleChartsObject.data.rows[bb].c[0].id, baseQuestion.OldQuestionID);
                        //START NILESH-TSK31
												//START NILESH-TSK35
												if (getQuestionIdForSumOfDuration_GoalSetting().indexOf(baseQuestion.OldQuestionID) > -1) {
                            //END NILESH-TSK35
														//Create Tooltip Here
                            baseGoogleChartsObject.data.rows[bb].c.splice(aa + 1, 0, makeTooltipForHistoryDataObject_TotalMinute(baseGoogleChartsObject.data.rows[bb].c[aa].v, baseGoogleChartsObject.data.rows[bb].c[0].v, baseGoogleChartsObject.data.cols[aa].label, timeframeTotal, timeframeTotalResponseRate));
                        }
                        else {
                            //END NILESH-TSK31
                            baseGoogleChartsObject.data.rows[bb].c.splice(aa + 1, 0, makeTooltipForHistoryDataObject(baseGoogleChartsObject.data.rows[bb].c[aa].v, baseGoogleChartsObject.data.rows[bb].c[0].v, baseGoogleChartsObject.data.cols[aa].label, timeframeTotal, timeframeTotalResponseRate));
                            //START NILESH-TSK31
                        }
                        //END NILESH-TSK31
                    }
                }
            }

            //START NILESH-TSK21
            baseHighChartObject.options.tooltip.formatter = makeTooltipForHistoryDataObjectHC;
            //END NILESH-TSK21

            //console.log(BrQC.Question);
            returnValue.GoogleChartsObjectList = [
                baseGoogleChartsObject,
                secondaryGCObject
            ];//console.log(JSON.stringify(returnObject));


            //START NILESH-TSK21
            returnValue.HighChartObjectList = [
                baseHighChartObject,
                baseHighChartSecondaryObject
            ];
            //END NILESH-TSK21

            return returnValue;
        }

		// totals  - percent
        function formatData_TotalsPercent(baseQuestion, chartType, dataFormat) {
            console.log("Call formatData_TotalsPercent");
            var dataFormatEnum = repQConstants.DataFormatEnum[dataFormat];
            var returnValue = {
                CommentList: [],
                GoogleChartsObjectList: []
                //START NILESH-TSK21
                ,
                HighChartObjectList: []
                //END NILESH-TSK21  
            };
            var options = {
                "tooltip": { "isHtml": true },
                "title": baseQuestion.CleanQuestionText
            };
            var columns = [];
            var rows = [];
            columns.push({
                "id": "a",
                "label": "Answers",
                "type": "string"
            });
            columns.push({
                "id": "f",
                "label": "Percent Of Total Submissions",
                "type": "number"
            });
            columns.push({
                "id": "",
                "role": "tooltip",
                "type": 'string',
                "p": {
                    "role": "tooltip",
                    "html": true
                }
            });
            var baseGoogleChartsObject = repQConstants.GetBaseGoogleChartsObject(chartType, null, options, null);
            var secondaryGCObject = repQConstants.GetBaseGoogleChartsObject(chartType, null, options, null);
            for (var k = 0; k < columns.length; k++) {
                baseGoogleChartsObject.data.cols.push(columns[k]);
                secondaryGCObject.data.cols.push(columns[k]);
            }

            //START NILESH-TSK21
            var baseHighChartObject = repQConstants.GetBaseHighChartsObject(baseQuestion.CleanQuestionText, 'column', null, null);
            var baseHighChartSecondaryObject = repQConstants.GetBaseHighChartsObject(baseQuestion.CleanQuestionText, 'column', null, null);
            //END NILESH-TSK21

            var booleanAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsBooleanAnswerType(e); }); // check boolean

            var booleanOtherAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsOtherAnswerType(e); }); // check for boolean-other

            var rangeAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsRangeAnswerType(e); }); // check range

            var dropDownAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsDropDownAnswerType(e); }); // check dropdown

            var commentAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsCommentAnswerType(e); }); // check comments

            var textEntryAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsTextboxAnswerType(e); }); // check for text box

            // first three calls all can manipulate the data object
            console.log("boolean Type", booleanAnswers.length);

            if (booleanAnswers.length > 0) {
                var newRows = getDataRows_Boolean(booleanAnswers, dataFormatEnum);
                for (var n in newRows) {
                    baseGoogleChartsObject.data.rows.push(newRows[n]);
                }

                //START NILESH-TSK21
                var newRowsForHC = getDataRowsHC_Boolean(booleanAnswers, dataFormatEnum);

                for (var n in newRowsForHC) {
                    baseHighChartObject.series.push(newRowsForHC[n]);
                }

                console.log("Final HighChartObject");
                console.log(baseHighChartObject);
                console.log("Final baseGoogleChartsObject");
                console.log(baseGoogleChartsObject);

                console.log("newRows Count - " + newRows.length + " newRowsForHC Count - " + newRowsForHC.count)

                //END NILESH-TSK21
            }

            console.log("booleanOtherAnswers type", booleanOtherAnswers.length);
            if (booleanOtherAnswers.length > 0) {
                var newRows_other = getDataRows_BooleanOther(booleanOtherAnswers, dataFormatEnum);
                for (var q in newRows_other) {
                    baseGoogleChartsObject.data.rows.push(newRows_other[q]);
                }
                //START NILESH-TSK21
                var newRows_otherHC = getDataRowsHC_BooleanOther(booleanOtherAnswers, dataFormatEnum);

                for (var n in newRows_otherHC) {
                    baseHighChartObject.series.push(newRows_otherHC[n]);
                }
                //END NILESH-TSK21
            }

            console.log("textEntryAnswers type", textEntryAnswers.length);
            if (textEntryAnswers.length > 0) {
                var newRows_text = getDataRows_TextEntry(textEntryAnswers, dataFormatEnum);
                for (var z in newRows_text) {
                    baseGoogleChartsObject.data.rows.push(newRows_text[z]);
                }
                //START NILESH-TSK21
                var newRows_textHC = getDataRowsHC_TextEntry(textEntryAnswers, dataFormatEnum);
                for (var n in newRows_textHC) {
                    baseHighChartObject.series.push(newRows_textHC[n]);
                }
                //END NILESH-TSK21
            }

            // range or dropdown answers will require a different method of gathering the data
            console.log("rangeAnswers type", rangeAnswers.length);
            if (rangeAnswers.length > 0) {
                secondaryGCObject.data.rows = getDataRows_RangeAnswers(rangeAnswers, dataFormatEnum);
                //START NILESH-TSK21
                baseHighChartSecondaryObject.series = getDataRowsHC_RangeAnswers(rangeAnswers, dataFormatEnum);
                //END NILESH-TSK21
            }

            console.log("dropDownAnswers type", dropDownAnswers.length);
            if (dropDownAnswers.length > 0) { // ignoring this for now
                getDataRows_DropDownAnswers(dropDownAnswers, dataFormatEnum);
            }

            // comments are completely separate, not going to do anything with google charts for these
            console.log("commentAnswers type", commentAnswers.length);
            if (commentAnswers.length > 0) {
                returnValue.CommentList = getDataRows_Comments(commentAnswers);
            }

            //console.log(BrQC.Question);
            //console.log(BrQC.GoogleChartsObjectList);
            returnValue.GoogleChartsObjectList = [
                baseGoogleChartsObject,
                secondaryGCObject
            ];

            //START NILESH-TSK21
            returnValue.HighChartObjectList = [
                baseHighChartObject,
                baseHighChartSecondaryObject
            ];
            //END NILESH-TSK21
            return returnValue;
        }

        // history - percent
        function formatData_HistoryPercent(baseQuestion, chartType, dataFormat, timeInterval) {
            var dataFormatEnum = repQConstants.DataFormatEnum[dataFormat];
            var timeIntervalInt = repQConstants.TimeIntervalEnum[timeInterval];
            var returnValue = {
                CommentList: [],
                //START NILESH-21
                HighChartObjectList: [],
                //END NILESH-21
                GoogleChartsObjectList: []

            };
            var options = {
                "title": baseQuestion.CleanQuestionText,
                "tooltip": { "isHtml": true }
            };
            var columns = [];
            var rows = [];
            var abstractTimeStartNumber = 0;
            var abstractTimeEndNumber = 0;
            var abstractTimeRoundTrip = 0;
            var momentFunc = "";
            var idTextFormat = "";
            var textFormat = "";
            switch (timeIntervalInt) {
                case 0: // day
                    abstractTimeStartNumber = repConst.StartDate.dayOfYear();
                    abstractTimeEndNumber = repConst.EndDate.dayOfYear();
                    abstractTimeRoundTrip = 365;
                    momentFunc = "dayOfYear";
                    idTextFormat = "DDDD";
                    textFormat = "DDDo [day of the year]";
                    columns.push({
                        "id": "dayOfTheYear",
                        "label": "Day",
                        "type": "string"
                    });
                    break;
                case 1: // week
                    abstractTimeStartNumber = repConst.StartDate.week();
                    abstractTimeEndNumber = repConst.EndDate.week();
                    abstractTimeRoundTrip = 52;
                    momentFunc = "week";
                    idTextFormat = "ww";
                    textFormat = "wo [week of the year]";
                    columns.push({
                        "id": "weekOfTheYear",
                        "label": "Week",
                        "type": "string"
                    });
                    break;
                case 3: // month
                    abstractTimeStartNumber = repConst.StartDate.month();
                    abstractTimeEndNumber = repConst.EndDate.month();
                    abstractTimeRoundTrip = 12;
                    momentFunc = "month";
                    idTextFormat = "MM";
                    textFormat = "MMMM";
                    columns.push({
                        "id": "month",
                        "label": "Month",
                        "type": "string"
                    });
                    break;
                case 5: // quarter
                    abstractTimeStartNumber = repConst.StartDate.quarter();
                    abstractTimeEndNumber = repConst.EndDate.quarter();
                    abstractTimeRoundTrip = 4;
                    momentFunc = "quarter";
                    idTextFormat = "Q";
                    textFormat = "[Quarter:] Q";
                    columns.push({
                        "id": "quarter",
                        "label": "Quarter",
                        "type": "string"
                    });
                    break;
                case 7: // year
                    abstractTimeStartNumber = repConst.StartDate.year();
                    abstractTimeEndNumber = repConst.EndDate.year();
                    abstractTimeRoundTrip = 1;
                    momentFunc = "year";
                    idTextFormat = "YYYY";
                    textFormat = "YYYY";
                    columns.push({
                        "id": "year",
                        "label": "Year",
                        "type": "string"
                    });
                    break;
                default: // shouldn't happen
                    break;
            }
            var multiplier = repConst.EndDate.year() - repConst.StartDate.year();
            if (multiplier > 0) {
                abstractTimeEndNumber = abstractTimeEndNumber + (abstractTimeRoundTrip * multiplier);
            }
            //if (abstractTimeStartNumber >= abstractTimeEndNumber) {
            //    abstractTimeStartNumber = abstractTimeStartNumber - (abstractTimeRoundTrip * multiplier);
            //}

            //START NILESH-TSK21
            var hcCategory = [];
            //END NILESH-TSK21

            for (var i = abstractTimeStartNumber; i <= abstractTimeEndNumber; i++) {
                rows.push({
                    "c": [
                        {
                            "id": i,
                            "v": moment(repConst.StartDate.year(), "YYYY")[momentFunc](i).format(textFormat)
                        }
                    ]
                });
                //START NILESH-TSK21
                hcCategory.push(moment(repConst.StartDate.year(), "YYYY")[momentFunc](i).format(textFormat));
                //END NILESH-TSK21
            }
            var baseGoogleChartsObject = repQConstants.GetBaseGoogleChartsObject(chartType, null, options, null);
            var secondaryGCObject = repQConstants.GetBaseGoogleChartsObject(chartType, null, options, null);
            for (var k = 0; k < columns.length; k++) {
                baseGoogleChartsObject.data.cols.push(angular.copy(columns[k]));
                secondaryGCObject.data.cols.push(angular.copy(columns[k]));
            }
            for (var l = 0; l < rows.length; l++) {
                baseGoogleChartsObject.data.rows.push(angular.copy(rows[l]));
                secondaryGCObject.data.rows.push(angular.copy(rows[l]));
            }

            //START NILESH-TSK21
            var baseHighChartObject = repQConstants.GetBaseHighChartsObject(baseQuestion.CleanQuestionText, 'column', hcCategory, null);
            var baseHighChartSecondaryObject = repQConstants.GetBaseHighChartsObject(baseQuestion.CleanQuestionText, 'column', hcCategory, null);
            //END NILESH-TSK21


            var booleanAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsBooleanAnswerType(e); }); // check boolean

            var booleanOtherAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsOtherAnswerType(e); }); // check for boolean-other

            var rangeAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsRangeAnswerType(e); }); // check range

            var dropDownAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsDropDownAnswerType(e); }); // check dropdown

            var commentAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsCommentAnswerType(e); }); // check comments

            var textEntryAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsTextboxAnswerType(e); }); // check for text box

            //START NILESH-TSK21
            var arrTimeResponceRate = [];
            for (var j = abstractTimeStartNumber; j <= abstractTimeEndNumber; j++) {
                arrTimeResponceRate.push(repLogic.GetVoterCountByDateRange(momentFunc, j));
            }
            //END NILESH-TSK21

            // first three calls all can manipulate the data object
            if (booleanAnswers.length > 0) {
                var newRows = getDataRows_Boolean(booleanAnswers, dataFormatEnum, momentFunc, abstractTimeRoundTrip);
                //console.log(newRows);
                for (var x = 0; x < newRows.NewColumns.length; x++) {
                    baseGoogleChartsObject.data.cols.push(newRows.NewColumns[x]);
                }
                //var timeframeCount
                for (var m = 0; m < newRows.DataLists.length; m++) {
                    for (var j = 0, len = baseGoogleChartsObject.data.rows.length; j < len; j++) {
                        var abstractTimeNumber = baseGoogleChartsObject.data.rows[j].c[0].id;
                        if (newRows.DataLists[m][abstractTimeNumber]) {
                            var timeframeFrequency = repLogic.GetVoterCountByDateRange(momentFunc, abstractTimeNumber);
                            //console.log(newRows.DataLists[m][abstractTimeNumber], timeframeFrequency);
                            var newObject_boolean = {
                                "v": ((newRows.DataLists[m][abstractTimeNumber] / timeframeFrequency) * 100).toFixed(1),
                            };
                            baseGoogleChartsObject.data.rows[j].c.push(newObject_boolean);
                        } else {
                            baseGoogleChartsObject.data.rows[j].c.push({
                                "v": "0.0"
                            });
                        }
                    }
                }

                //START NILESH-TSK21

                //var timeframeCount
                var newRowsForHC = getDataRowsHC_Boolean(booleanAnswers, dataFormatEnum, momentFunc, abstractTimeRoundTrip);
                for (var m = 0; m < newRowsForHC.DataLists.length; m++) {
                    var seriesData = [];
                    for (var j = abstractTimeStartNumber; j <= abstractTimeEndNumber; j++) {
                        if (newRowsForHC.DataLists[m][j]) {
                            var timeframeFrequency = repLogic.GetVoterCountByDateRange(momentFunc, j);
                            seriesData.push(parseFloat(((newRowsForHC.DataLists[m][j] / timeframeFrequency) * 100).toFixed(1)));
                        }
                        else {
                            seriesData.push(0);
                        }
                    }
                    var objChartAnswer = {
                        "name": newRowsForHC.NewColumns[m].label,
                        "data": seriesData,
                        "arrTimeResRate": arrTimeResponceRate
                    }
                    baseHighChartObject.series.push(objChartAnswer);
                }
                //END NILESH-TSK21
            }

            if (booleanOtherAnswers.length > 0) {
                var newRows_other = getDataRows_BooleanOther(booleanOtherAnswers, dataFormatEnum, momentFunc);
                for (var s = 0; s < newRows_other.NewColumns.length; s++) {
                    baseGoogleChartsObject.data.cols.push(newRows_other.NewColumns[s]);
                }
                for (var r = 0; r < newRows_other.DataLists.length; r++) {
                    for (var b = 0, len2 = baseGoogleChartsObject.data.rows.length; b < len2; b++) {
                        var abstractTimeNumber_other = baseGoogleChartsObject.data.rows[b].c[0].id;
                        if (newRows_other.DataLists[r][abstractTimeNumber_other]) {
                            var timeframeFrequency_other = repLogic.GetVoterCountByDateRange(momentFunc, abstractTimeNumber_other);
                            var newObject_other = {
                                "v": ((newRows_other.DataLists[r][abstractTimeNumber_other] / timeframeFrequency_other) * 100).toFixed(1),
                            };
                            baseGoogleChartsObject.data.rows[b].c.push(newObject_other);
                        } else {
                            baseGoogleChartsObject.data.rows[b].c.push({
                                "v": "0.0"
                            });
                        }
                    }
                }

                //START NILESH-TSK21

                //var timeframeCount
                var newRows_otherHC = getDataRowsHC_BooleanOther(booleanOtherAnswers, dataFormatEnum, momentFunc);
                for (var m = 0; m < newRows_otherHC.DataLists.length; m++) {
                    var seriesData = [];
                    for (var j = abstractTimeStartNumber; j <= abstractTimeEndNumber; j++) {
                        if (newRows_otherHC.DataLists[m][j]) {
                            var timeframeFrequency = repLogic.GetVoterCountByDateRange(momentFunc, j);
                            seriesData.push(parseFloat(((newRows_otherHC.DataLists[m][j] / timeframeFrequency) * 100).toFixed(1)));
                        }
                        else {
                            seriesData.push(0);
                        }
                    }
                    var objChartAnswer = {
                        "name": newRows_otherHC.NewColumns[m].label,
                        "data": seriesData,
                        "arrTimeResRate": arrTimeResponceRate
                    }
                    baseHighChartObject.series.push(objChartAnswer);
                }
                //END NILESH-TSK21
            }

            if (textEntryAnswers.length > 0) {
                var newRows_text = getDataRows_TextEntry(textEntryAnswers, dataFormatEnum, momentFunc);
                for (var u = 0; u < newRows_text.NewColumns.length; u++) {
                    baseGoogleChartsObject.data.cols.push(newRows_text.NewColumns[u]);
                }
                for (var c = 0; c < newRows_text.DataLists.length; c++) {
                    for (var f = 0, len3 = baseGoogleChartsObject.data.rows.length; f < len3; f++) {
                        var abstractTimeNumber_text = baseGoogleChartsObject.data.rows[f].c[0].id;
                        if (newRows_text.DataLists[c][abstractTimeNumber_text]) {
                            var timeframeFrequency_text = repLogic.GetVoterCountByDateRange(momentFunc, abstractTimeNumber_text);
                            var newObject_text = {
                                "v": ((newRows_text.DataLists[c][abstractTimeNumber_text] / timeframeFrequency_text) * 100).toFixed(1),
                            };
                            baseGoogleChartsObject.data.rows[f].c.push(newObject_text);
                        } else {
                            baseGoogleChartsObject.data.rows[f].c.push({
                                "v": "0.0"
                            });
                        }
                    }
                }


                //START NILESH-TSK21

                //var timeframeCount
                var newRows_textHC = getDataRowsHC_TextEntry(textEntryAnswers, dataFormatEnum, momentFunc);
                for (var m = 0; m < newRows_textHC.DataLists.length; m++) {
                    var seriesData = [];
                    for (var j = abstractTimeStartNumber; j <= abstractTimeEndNumber; j++) {
                        if (newRows_textHC.DataLists[m][j]) {
                            var timeframeFrequency = repLogic.GetVoterCountByDateRange(momentFunc, j);
                            seriesData.push(parseFloat(((newRows_textHC.DataLists[m][j] / timeframeFrequency) * 100).toFixed(1)));
                        }
                        else {
                            seriesData.push(0);
                        }
                    }

                    var objChartAnswer = {
                        "name": newRows_textHC.NewColumns[m].label,
                        "data": seriesData,
                        "arrTimeResRate": arrTimeResponceRate
                    }
                    baseHighChartObject.series.push(objChartAnswer);
                }
                //END NILESH-TSK21

            }

            // range or dropdown answers will require a different method of gathering the data
            if (rangeAnswers.length > 0) {
                secondaryGCObject.data.rows = getDataRows_RangeAnswers(rangeAnswers, dataFormatEnum);
            } else {
                secondaryGCObject.data.rows = [];
            }

            if (dropDownAnswers.length > 0) { // ignoring this for now
                getDataRows_DropDownAnswers(dropDownAnswers, dataFormatEnum);
            }

            // comments are completely separate, not going to do anything with google charts for these
            if (commentAnswers.length > 0) {
                returnValue.CommentList = getDataRows_Comments(commentAnswers);
            }

            //console.log(baseGoogleChartsObject);

            for (var aa = 1; aa < baseGoogleChartsObject.data.cols.length; aa += 2) { // what an absolute hack
                baseGoogleChartsObject.data.cols.splice(aa + 1, 0, {
                    "id": baseGoogleChartsObject.data.cols[aa].id + "-toolTip",
                    "role": "tooltip",
                    "type": 'string',
                    "p": {
                        "role": "tooltip",
                        "html": true
                    }
                });
                for (var bb = 0; bb < baseGoogleChartsObject.data.rows.length; bb++) { // loop the data rows and only modify the given question we added a tooltip for
                    //var timeframeTotal = 0;
                    //var cc = 1;
                    //while (cc < baseGoogleChartsObject.data.rows[bb].c.length) {
                    //    if (baseGoogleChartsObject.data.rows[bb].c[cc]) {
                    //        timeframeTotal += baseGoogleChartsObject.data.rows[bb].c[cc].v;
                    //    }
                    //    if (cc < aa) {
                    //        cc += 2;
                    //    } else {
                    //        cc++;
                    //    }
                    //}

                    // instead of the timeFrameTotal based on the number of selected options, we want the number of submissions for the given timeframe
                    var timeframeTotal = repLogic.GetVoterCountByDateRange(momentFunc, baseGoogleChartsObject.data.rows[bb].c[0].id);
                    if (baseGoogleChartsObject.data.rows[bb].c[aa]) {
                        baseGoogleChartsObject.data.rows[bb].c.splice(aa + 1, 0, makeTooltipForHistoryPercentDataObject(baseGoogleChartsObject.data.rows[bb].c[aa].v, baseGoogleChartsObject.data.rows[bb].c[0].v, baseGoogleChartsObject.data.cols[aa].label, timeframeTotal));
                    }
                }
            }


            //START NILESH-TSK21
            baseHighChartObject.options.tooltip.formatter = makeTooltipForHistoryPercentDataObjectHC;
            //END NILESH-TSK21


            //console.log(BrQC.Question);
            returnValue.GoogleChartsObjectList = [
                baseGoogleChartsObject,
                secondaryGCObject
            ];

            //START NILESH-TSK21
            returnValue.HighChartObjectList = [
                baseHighChartObject,
                baseHighChartSecondaryObject
            ];
            //END NILESH-TSK21

            return returnValue;
        }

		//START NILESH-TSK21-4
        // Distribution
        function formatData_Distribution(baseQuestion, chartType, dataFormat) {

            
            var dataFormatEnum = repQConstants.DataFormatEnum[dataFormat];
            var returnValue = {
                CommentList: [],
                GoogleChartsObjectList: []
                //START NILESH-TSK21
                ,
                HighChartObjectList: []
                //END NILESH-TSK21  
            };

            var booleanAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsBooleanAnswerType(e); }); // check boolean
            var booleanOtherAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsOtherAnswerType(e); }); // check for boolean-other
            var rangeAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsRangeAnswerType(e); }); // check range
            var dropDownAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsDropDownAnswerType(e); }); // check dropdown
            var commentAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsCommentAnswerType(e); }); // check comments
            var textEntryAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsTextboxAnswerType(e); }); // check for text box

            var baseGoogleChartsObject = {}, secondaryGCObject = {};

            var baseHighChartObject = {}, baseHighChartSecondaryObject = {};

            if (localStorage.getItem("IsPremiumUser") == "true") {

                baseHighChartObject = repQConstants.GetBaseHighChartsObject(baseQuestion.CleanQuestionText, 'boxplot', null, null);
                baseHighChartSecondaryObject = repQConstants.GetBaseHighChartsObject(baseQuestion.CleanQuestionText, 'boxplot', null, null);

                // first three calls all can manipulate the data object
                if (booleanAnswers.length > 0) {
                    var reportSeriesInfo = getDataRowsHC_Boolean(booleanAnswers, dataFormatEnum);
                    baseHighChartObject.xAxis.visible = true;
                    baseHighChartObject.xAxis.categories = reportSeriesInfo.categories;
                    baseHighChartObject.options = {
                        chart: {
                            type: 'boxplot'
                        }
                    }
                    var chartSeriesItem = {
                        name: 'Observations',
                        data: reportSeriesInfo.data,
                        tooltip: {
                            headerFormat: '<b>{point.key}</b><br/>'
                        }
                    }
                    baseHighChartObject.series.push(chartSeriesItem);
                }

                if (booleanOtherAnswers.length > 0) {
                    var reportSeriesInfo = getDataRowsHC_BooleanOther(booleanOtherAnswers, dataFormatEnum);

                    baseHighChartObject.xAxis.categories = baseHighChartObject.xAxis.categories.concat(reportSeriesInfo.categories);
                    if (baseHighChartObject.series && baseHighChartObject.series[0].data && baseHighChartObject.series[0].data.length > 0) {
                        baseHighChartObject.series[0].data = baseHighChartObject.series[0].data.concat(reportSeriesInfo.data);
                    }
                    else {
                        baseHighChartObject.xAxis.visible = true;
                        baseHighChartObject.options = {
                            chart: {
                                type: 'boxplot'
                            }
                        }
                        var chartSeriesItem = {
                            name: 'Observations',
                            data: reportSeriesInfo.data,
                            tooltip: {
                                headerFormat: '<b>{point.key}</b><br/>'
                            }
                        }
                        baseHighChartObject.series.push(chartSeriesItem);
                    }
                }

                if (textEntryAnswers.length > 0) {
                    var reportSeriesInfo = getDataRowsHC_TextEntry(textEntryAnswers, dataFormatEnum);
                    baseHighChartObject.xAxis.visible = true;
                    baseHighChartObject.xAxis.categories = reportSeriesInfo.categories;
                    baseHighChartObject.options = {
                        chart: {
                            type: 'boxplot'
                        }
                    }
                    var chartSeriesItem = {
                        name: 'Observations',
                        data: reportSeriesInfo.data,
                        tooltip: {
                            headerFormat: '<b>{point.key}</b><br/>'
                        }
                    }
                    baseHighChartObject.series.push(chartSeriesItem);
                }

                // range or dropdown answers will require a different method of gathering the data
                if (rangeAnswers.length > 0) {
                    reportSeriesInfo = getDataRowsHC_RangeAnswers(rangeAnswers, dataFormatEnum);
                    baseHighChartObject.xAxis.visible = true;
                    baseHighChartObject.xAxis.categories = reportSeriesInfo.categories;
                    baseHighChartObject.options = {
                        chart: {
                            type: 'boxplot'
                        }
                    }
                    var chartSeriesItem = {
                        name: 'Observations',
                        data: reportSeriesInfo.data,
                        tooltip: {
                            headerFormat: '<b>{point.key}</b><br/>'
                        }
                    }
                    baseHighChartObject.series.push(chartSeriesItem);
                }
            }
            else {
                //END NILESH-TSK21
                var options = {
                    "tooltip": { "isHtml": true },
                    "title": baseQuestion.CleanQuestionText
                };
                var columns = [];
                var rows = [];
                columns.push({
                    "id": "a",
                    "label": "Answers",
                    "type": "string"
                });
                columns.push({
                    "id": "f",
                    "label": "Frequency",
                    "type": "number"
                });
                columns.push({
                    "id": "",
                    "role": "tooltip",
                    "type": 'string',
                    "p": {
                        "role": "tooltip",
                        "html": true
                    }
                });
                var baseGoogleChartsObject = repQConstants.GetBaseGoogleChartsObject(chartType, null, options, null);
                var secondaryGCObject = repQConstants.GetBaseGoogleChartsObject(chartType, null, options, null);
                for (var k = 0; k < columns.length; k++) {
                    baseGoogleChartsObject.data.cols.push(columns[k]);
                    secondaryGCObject.data.cols.push(columns[k]);
                }

                // first three calls all can manipulate the data object
                if (booleanAnswers.length > 0) {
                    var newRows = getDataRows_Boolean(booleanAnswers, dataFormatEnum);
                    for (var n in newRows) {
                        baseGoogleChartsObject.data.rows.push(newRows[n]);
                    }
                }

                if (booleanOtherAnswers.length > 0) {
                    var newRows_other = getDataRows_BooleanOther(booleanOtherAnswers, dataFormatEnum);
                    for (var q in newRows_other) {
                        baseGoogleChartsObject.data.rows.push(newRows_other[q]);
                    }
                }

                if (textEntryAnswers.length > 0) {
                    var newRows_text = getDataRows_TextEntry(textEntryAnswers, dataFormatEnum);
                    for (var z in newRows_text) {
                        baseGoogleChartsObject.data.rows.push(newRows_text[z]);
                    }
                }

                // range or dropdown answers will require a different method of gathering the data
                if (rangeAnswers.length > 0) {
                    secondaryGCObject.data.rows = getDataRows_RangeAnswers(rangeAnswers, dataFormatEnum);
                }
                //START NILESH-TSK21
            }
            //END NILESH-TSK21

            //console.log("Final HighChartObject");
            //console.log(baseHighChartObject);
            //console.log("Final baseGoogleChartsObject");
            //console.log(baseGoogleChartsObject);

            //console.log("newRows Count - " + newRows.length + " newRowsForHC Count - " + newRowsForHC.count)

            //console.log("commentAnswers = ");
            //console.log(commentAnswers);
            //console.log("commentAnswersForSelection = ");
            //console.log(commentAnswersForSelection);

            if (dropDownAnswers.length > 0) { // ignoring this for now
                getDataRows_DropDownAnswers(dropDownAnswers, dataFormatEnum);
            }

            // comments are completely separate, not going to do anything with google charts for these
            if (commentAnswers.length > 0) {
                returnValue.CommentList = getDataRows_Comments(commentAnswers);
            }
            // else if(commentAnswersForSelection.length > 0)
            // {
            // returnValue.CommentList = getDataRows_Comments(commentAnswersForSelection);
            // }




            returnValue.GoogleChartsObjectList = [
                baseGoogleChartsObject,
                secondaryGCObject
            ];

            //START NILESH-TSK21
            returnValue.HighChartObjectList = [
                baseHighChartObject,
                baseHighChartSecondaryObject
            ];
            //END NILESH-TSK21

            //console.log(BrQC.Question);
            return returnValue;
        }
        //END NILESH-TSK21-4
		
		
		//START NILESH-TSK21
        function getDataRowsHC_Boolean(answerList, dataFormatInt, momentFunc, roundTrip) {

            function dataFormat0() { // totals
                var dataObject = [];
                var frequencyCount = 0;
                var voterResponseList = [];
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    var answerCount = 0;
                    for (var k in voterResults) {
                        if (voterResults[k].VoterAnswerValue === "true" ||
                            voterResults[k].VoterAnswerValue === "1") {
                            answerCount++;
                            frequencyCount++;
                            if (voterResponseList.indexOf(voterResults[k].VoterID) === -1) {
                                voterResponseList.push(voterResults[k].VoterID);
                            }
                        }
                    }

                    // add it to the object
                    dataObject.push({
                        "name": answerList[i].CleanAnswerText,
                        "data": [answerCount],
                        "tooltipText": ''
                    });
                }
                var questionResponseCount = voterResponseList.length;
                for (var r in dataObject) {
                    dataObject[r].tooltipText = makeTooltipForTotalsObjectHC(dataObject[r], frequencyCount, questionResponseCount);
                }
                return dataObject;
            }
            
            function dataFormat1() { // history
                var newColumns = [];
                var dataLists = [];
                var dataObject = [];
                var frequencyCount = 0;
                for (var s in answerList) {
                    var data = {};
                    var voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[s].OldAnswerID);
                    for (var j in voterResults_history) {
                        var dateVal = null;
                        var momentFormat = "";
                        if (voterResults_history[j].DateFromForm !== -1) {
                            dateVal = voterResults_history[j].DateFromForm;
                            momentFormat = "MM-DD-YYYY";
                        } else {
                            dateVal = voterResults_history[j].StartDate;
                            momentFormat = "YYYY-MM-DDTHH:mm:ss";
                        }
                        var voterMoment = moment(dateVal, momentFormat);
                        var abstractDateVal = 0;
                        if (momentFunc !== "year") {
                            if (repConst.StartDate.isSame(voterMoment, "year") === true) {
                                abstractDateVal = voterMoment[momentFunc]();
                            } else {
                                var abstractDuration = (voterMoment.year() - repConst.StartDate.year()) * roundTrip;
                                abstractDateVal = voterMoment[momentFunc]() + abstractDuration;
                            }
                        } else {
                            abstractDateVal = voterMoment[momentFunc]();
                        }
                        if (!data[abstractDateVal]) {
                            data[abstractDateVal] = 1;
                            frequencyCount++;
                        } else {
                            data[abstractDateVal]++;
                            frequencyCount++;
                        }
                    }
                    newColumns.push({
                        "id": answerList[s].OldAnswerID,
                        "label": answerList[s].CleanAnswerText,
                        "type": "number"
                    });
                    dataLists.push(data);
                }
                return { NewColumns: newColumns, DataLists: dataLists, TotalFrequency: frequencyCount };
            }
            
            function dataFormat2() { // TotalsPercent
                var dataObject = [];
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    var answerCount = 0;
                    for (var k in voterResults) {
                        if (voterResults[k].VoterAnswerValue === "true" || voterResults[k].VoterAnswerValue === "1") {
                            answerCount++;
                        }
                    }
                    var percent = ((answerCount / repConst.FilteredVotesCount) * 100).toFixed(1);
                    dataObject.push({
                        "name": answerList[i].CleanAnswerText,
                        "data": [answerCount],
                        "tooltipText": makeTooltipForTotalsPercentDataObjectHC(answerList[i].CleanAnswerText, answerCount, percent)
                    });
                }
                return dataObject;
            }

            function dataFormat3() { // TotalsHistory
                var dataObject = [];
                var dataLists = [];
                var newColumns = [];
                for (var s in answerList) {
                    var data = {};
                    var voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[s].OldAnswerID);
                    //console.log(voterResults_history);
                    for (var j in voterResults_history) {
                        var dateVal = null;
                        var momentFormat = "";
                        if (voterResults_history[j].DateFromForm !== -1) {
                            dateVal = voterResults_history[j].DateFromForm;
                            momentFormat = "MM-DD-YYYY";
                        } else {
                            dateVal = voterResults_history[j].StartDate;
                            momentFormat = "YYYY-MM-DDTHH:mm:ss";
                        }
                        var voterMoment = moment(dateVal, momentFormat);
                        var abstractDateVal = 0;
                        if (momentFunc !== "year") {
                            if (repConst.StartDate.isSame(voterMoment, "year") === true) {
                                abstractDateVal = voterMoment[momentFunc]();
                            } else {
                                var abstractDuration = (voterMoment.year() - repConst.StartDate.year()) * roundTrip;
                                abstractDateVal = voterMoment[momentFunc]() + abstractDuration;
                            }
                        } else {
                            abstractDateVal = voterMoment[momentFunc]();
                        }
                        //var abstractTime = moment(dateVal, momentFormat)[momentFunc]();
                        //console.log(dateVal, momentFormat, momentFunc, abstractTime);
                        if (!data[abstractDateVal]) {
                            data[abstractDateVal] = 1;
                        } else {
                            data[abstractDateVal]++;
                        }
                    }
                    newColumns.push({
                        "id": answerList[s].OldAnswerID,
                        "label": answerList[s].CleanAnswerText,
                        "type": "number"
                    });
                    dataLists.push(data);
                }
                return { NewColumns: newColumns, DataLists: dataLists };
            }
           
            //START NILESH-TSK21-4
            function dataFormat4() { // Distribution

                //FOR JOSTEN : LY-TY UNIT
                //START NILESH-TSK42 
                var returnAnswerQuestionId = StaticValues.JostenDataCollection.Ty.QuestionId;
                //END NILESH-TSK42

                var dataObject = [];
                var frequencyCount = 0;
                var voterResponseList = [];
                var arrCategory = [];
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesForJostenByAnswerId(returnAnswerQuestionId, answerList[i].OldAnswerID);
                    var arrValues = [];
                    for (var k in voterResults) {
                        if (!isNaN(voterResults[k].VoterSubAnswerValue))
                        {
                            arrValues.push(parseInt(voterResults[k].VoterSubAnswerValue))
                        }
                    }
                    var finalArr = GetBoxPlotData(arrValues);

                    // add it to the object
                    arrCategory.push(answerList[i].CleanAnswerText);
                    dataObject.push(finalArr.GetArray());
                }
                var returnValue = {};
                returnValue.data = dataObject;
                returnValue.categories = arrCategory;
                return returnValue;
            }
            //END NILESH-TSK21-4
            
			
			if (dataFormatInt === 0) {
                return dataFormat0();
            }
            else if (dataFormatInt === 1) {
                return dataFormat1();
            }
            else if (dataFormatInt === 2) {
                return dataFormat2();
            }
            else if (dataFormatInt === 3) {
                return dataFormat3();
            }
            //START NILESH-TSK21-4
            else if (dataFormatInt === 4) {
                return dataFormat4();
            }
            //END NILESH-TSK21-4

            return {};
        }
        function getDataRowsHC_BooleanOther(answerList, dataFormatInt, momentFunc, roundTrip) {
            function dataFormat0() {
                var dataObject = [];
                var frequencyCount = 0;
                var voterResponseList = [];
                for (var i in answerList) {
                    var responses = [];
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    var questionWasAnswered = false;
                    for (var k in voterResults) {
                        var textValue = voterResults[k].VoterAnswerValue;
                        if (textValue && textValue !== "") {
                            var wasFound = false;
                            for (var l in responses) {
                                if (responses[l].TextValue === textValue) {
                                    wasFound = true;
                                    responses[l].Count++;
                                    frequencyCount++;
                                    if (voterResponseList.indexOf(voterResults[k].VoterID) === -1) {
                                        voterResponseList.push(voterResults[k].VoterID);
                                    }
                                    break;
                                }
                            }
                            if (wasFound === false) {
                                responses.push({
                                    TextValue: textValue,
                                    Count: 1
                                });
                                frequencyCount++;
                                if (voterResponseList.indexOf(voterResults[k].VoterID) === -1) {
                                    voterResponseList.push(voterResults[k].VoterID);
                                }
                            }
                        }
                    }

                    // add it to the object
                    for (var j in responses) {
                        dataObject.push({
                            "name": responses[j].TextValue,
                            "data": [responses[j].Count],
                            "tooltipText": ''
                        });
                    }
                }
                var questionResponseCount = voterResponseList.length;
                for (var r in dataObject) {
                    dataObject[r].tooltipText = makeTooltipForTotalsObjectHC(dataObject[r], frequencyCount, questionResponseCount);
                }
                return dataObject;
            }
            
            function dataFormat1() {
                var dataObject = [];
                var frequencyCount = 0;
                var newColumns = [];
                var dataLists = [];
                for (var s in answerList) {
                    var responses_history = [];
                    var voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[s].OldAnswerID);
                    for (var m in voterResults_history) {
                        var textValue_history = voterResults_history[m].VoterAnswerValue;
                        if (textValue_history && textValue_history !== "") {
                            var wasFound_history = false;
                            var dateVal = null;
                            var momentFormat = "";
                            if (voterResults_history[m].DateFromForm !== -1) {
                                dateVal = voterResults_history[m].DateFromForm;
                                momentFormat = "MM-DD-YYYY";
                            } else {
                                dateVal = voterResults_history[m].StartDate;
                                momentFormat = "YYYY-MM-DDTHH:mm:ss";
                            }
                            var voterMoment = moment(dateVal, momentFormat);
                            var abstractDateVal = 0;
                            if (momentFunc !== "year") {
                                if (repConst.StartDate.isSame(voterMoment, "year") === true) {
                                    abstractDateVal = voterMoment[momentFunc]();
                                } else {
                                    var abstractDuration = (voterMoment.year() - repConst.StartDate.year()) * roundTrip;
                                    abstractDateVal = voterMoment[momentFunc]() + abstractDuration;
                                }
                            } else {
                                abstractDateVal = voterMoment[momentFunc]();
                            }
                            for (var n in responses_history) {
                                if (responses_history[n].TextValue === textValue_history) {
                                    wasFound_history = true;
                                    responses_history[n].DataList[abstractDateVal]++;
                                    frequencyCount++;
                                    break;
                                }
                            }
                            if (wasFound_history === false) {
                                var ob = {
                                    TextValue: textValue_history,
                                    DataList: {}
                                };
                                ob.DataList[abstractDateVal] = 1;
                                frequencyCount++;
                                responses_history.push(ob);
                            }
                        }
                    }
                    // loop through responses and set up columns and data lists
                    for (var q in responses_history) {
                        newColumns.push({
                            "id": responses_history[q].TextValue.toLowerCase(),
                            "label": responses_history[q].TextValue,
                            "type": "number"
                        });
                        dataLists.push(responses_history[q].DataList);
                    }
                }
                return { NewColumns: newColumns, DataLists: dataLists, TotalFrequency: frequencyCount };
            }

            function dataFormat2() {
                var dataObject = [];
                for (var i in answerList) {
                    var responses = [];
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    for (var k in voterResults) {
                        var textValue = voterResults[k].VoterAnswerValue;
                        if (textValue && textValue !== "") {
                            var wasFound = false;
                            for (var l in responses) {
                                if (responses[l].TextValue === textValue) {
                                    wasFound = true;
                                    responses[l].Count++;
                                    break;
                                }
                            }
                            if (wasFound === false) {
                                responses.push({
                                    TextValue: textValue,
                                    Count: 1
                                });
                            }
                        }
                    }
                    // add it to the object
                    for (var j in responses) {
                        var percent = ((responses[j].Count / repConst.FilteredVotesCount) * 100).toFixed(1);
                        dataObject.push({
                            "name": responses[j].TextValue,
                            "data": [percent],
                            "tooltipText": makeTooltipForTotalsPercentDataObjectHC(responses[j].TextValue, responses[j].Count, percent)
                        });
                    }
                }
                return dataObject;
            }

            function dataFormat3() {
                var dataObject = [];
                var frequencyCount = 0;
                var newColumns = [];
                return dataObject;
            }

			//START NILESH-TSK21-4
            function dataFormat4() { // Distribution
                //FOR JOSTEN : LY-TY UNIT
                //START NILESH-TSK42 
                var returnAnswerQuestionId = StaticValues.JostenDataCollection.Ty.QuestionId;
                //END NILESH-TSK42 

                var arrCategory = [];
                var seriesData = [];
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesForJostenByAnswerId(returnAnswerQuestionId, answerList[i].OldAnswerID);
                    for (var k in voterResults) {
                        var textValue = answerList[i].CleanAnswerText;
                        if (textValue && textValue !== "") {
                            if (arrCategory.indexOf(textValue) == -1) {
                                arrCategory.push(textValue);
                                var arrSeries = [];
                                arrSeries.push(parseFloat(voterResults[k].VoterSubAnswerValue));
                                seriesData.push(arrSeries);
                            }
                            else {
                                var index = arrCategory.indexOf(textValue);
                                seriesData[index].push(parseFloat(voterResults[k].VoterSubAnswerValue));
                            }
                        }
                    }
                    // add it to the object
                }
                var dataObject = [];
                for (k in seriesData) {
                    dataObject.push(GetBoxPlotData(seriesData[k]).GetArray());
                }

                var returnValue = {};
                returnValue.data = dataObject;
                returnValue.categories = arrCategory;
                return returnValue;
            }
            //END NILESH-TSK21-4

			
            if (dataFormatInt === 0) {
                return dataFormat0();
            }
            else if (dataFormatInt === 1) {
                return dataFormat1();
            }
            else if (dataFormatInt === 2) {
                return dataFormat2();
            } 
            else if (dataFormatInt === 3) {
                return dataFormat3();
            }
			//START NILESH-TSK21-4
            else if (dataFormatInt === 4) {
                return dataFormat4();
            }
            //END NILESH-TSK21-4
            return {};
        }
        function getDataRowsHC_TextEntry(answerList, dataFormatInt, momentFunc, roundTrip) {
            function dataFormat0() {
                var dataObject = [];
                var frequencyCount = 0;
                var voterResponseList = [];
                for (var i in answerList) {
                    var responses = [];
                    //START NILESH-TSK42
                    //var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    var voterResults = {};
                    if (StaticValues.EnableDisplaySalesRepCountForSchoolNameJostenDataCollection) {
                        voterResults = repLogic.GetVoterAnswerValuesByAnswerID(StaticValues.JostenDataCollection.SalesRep.AnswerIds.iAspireUserName);
                    }
                    else {
                        voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    }
                    //END NILESH-TSK42

                    for (var k in voterResults) {
                        var textValue = voterResults[k].VoterAnswerValue;
                        if (textValue && textValue !== "") {
                            //START NIELSH-TSK42
                            if (StaticValues.EnableSumOfVoterAnswerForQuestion == true) {
                                if (parseFloat(textValue).toString() != "NaN") {
                                    // Here Count used for Make Sum of voter Answer
                                    if (responses.length == 0) {
                                        responses.push({
                                            TextValue: "Total",
                                            Count: parseFloat(textValue)
                                        });
                                    }
                                    else {
                                        responses[0].Count += parseFloat(textValue);
                                    }
                                }
                            }
                            else {
                                //END NIELSH-TSK42
                                var wasFound = false;
                                for (var l in responses) {
                                    if (responses[l].TextValue === textValue) {
                                        wasFound = true;
                                        responses[l].Count++;
                                        frequencyCount++;
                                        if (voterResponseList.indexOf(voterResults[k].VoterID) === -1) {
                                            voterResponseList.push(voterResults[k].VoterID);
                                        }
                                        break;
                                    }
                                }
                                if (wasFound === false) {
                                    responses.push({
                                        TextValue: textValue,
                                        Count: 1
                                    });
                                    frequencyCount++;
                                    if (voterResponseList.indexOf(voterResults[k].VoterID) === -1) {
                                        voterResponseList.push(voterResults[k].VoterID);
                                    }
                                }
                                //START NIELSH-TSK42
                            }
                            //END NIELSH-TSK42
                        }
                    }
                    for (var q in responses) {
                        dataObject.push({
                            "name": responses[q].TextValue,
                            "data": [responses[q].Count],
                            "tooltipText": ''
                        });
                    }
                }
                var questionResponseCount = voterResponseList.length;
                for (var r in dataObject) {
                    //START NILESH-TSK42
                    if (StaticValues.EnableSumOfVoterAnswerForQuestion) {
                        dataObject[r].tooltipText = '<span><b>' + dataObject[r].name + ' : ' + dataObject[r].data[0] + '</b></span>';
                    }
                    else {
                        dataObject[r].tooltipText = makeTooltipForTotalsObjectHC(dataObject[r], frequencyCount, questionResponseCount);
                    }
                    //END NILESH-TSK42
                }
                return dataObject;
            }
            
            function dataFormat1() {
                var dataObject = [];
                var frequencyCount = 0;
                var newColumns = [];
                var dataLists = [];
                for (var j in answerList) {
                    var responses_history = [];
                    //START NILESH-TSK42
                    //var voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[j].OldAnswerID);
                    var voterResults_history = {};
                    if (StaticValues.EnableDisplaySalesRepCountForSchoolNameJostenDataCollection) {
                        voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(StaticValues.JostenDataCollection.SalesRep.AnswerIds.iAspireUserName);
                    }
                    else {
                        voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[j].OldAnswerID);
                    }
                    //END NILESH-TSK42
                    for (var n in voterResults_history) {
                        var textValue_history = voterResults_history[n].VoterAnswerValue;
                        if (textValue_history && textValue_history !== "") {
                            var wasFound_history = false;
                            var dateVal = null;
                            var momentFormat = "";
                            if (voterResults_history[n].DateFromForm !== -1) {
                                dateVal = voterResults_history[n].DateFromForm;
                                momentFormat = "MM-DD-YYYY";
                            } else {
                                dateVal = voterResults_history[n].StartDate;
                                momentFormat = "YYYY-MM-DDTHH:mm:ss";
                            }
                            var voterMoment = moment(dateVal, momentFormat);
                            var abstractDateVal = 0;
                            if (repConst.StartDate.isSame(voterMoment, "year") === true) {
                                abstractDateVal = voterMoment[momentFunc]();
                            } else {
                                var abstractDuration = (voterMoment.year() - repConst.StartDate.year()) * roundTrip;
                                abstractDateVal = voterMoment[momentFunc]() + abstractDuration;
                            }
                            //START NILESH-TSK42
                            if (StaticValues.EnableSumOfVoterAnswerForQuestion == true) {
                                if (parseFloat(textValue_history).toString() != "NaN") {
                                    for (var qq in responses_history) {
										if (responses_history[qq].DataList[abstractDateVal] != undefined) {
											wasFound_history = true;
											responses_history[qq].DataList[abstractDateVal] += parseFloat(textValue_history);
											frequencyCount++;
											break;
										}
									}
									if (wasFound_history === false) {
										var ob = {
                                            TextValue: "Total",
                                            DataList: {}
                                        };
                                        ob.DataList[abstractDateVal] = parseFloat(textValue_history);
                                        responses_history.push(ob);
                                        frequencyCount++;
									}
									 
                                }
                            }
                            else {
                                //END NILESH-TSK42
                                for (var qq in responses_history) {
                                    if (responses_history[qq].TextValue === textValue_history) {
                                        wasFound_history = true;
                                        responses_history[qq].DataList[abstractDateVal]++;
                                        frequencyCount++;
                                        break;
                                    }
                                }
                                if (wasFound_history === false) {
                                    var ob = {
                                        TextValue: textValue_history,
                                        DataList: {}
                                    };
                                    ob.DataList[abstractDateVal] = 1;
                                    frequencyCount++;
                                    responses_history.push(ob);
                                }
                                //START NILESH-TSK42
                            }
                            //END NILESH-TSK42
                        }
                    }
                    // loop through responses and set up columns and data lists
                    for (var m in responses_history) {
                        newColumns.push({
                            "id": responses_history[m].TextValue.toLowerCase(),
                            "label": responses_history[m].TextValue,
                            "type": "number"
                        });
                        dataLists.push(responses_history[m].DataList);
                    }
                }
                return { NewColumns: newColumns, DataLists: dataLists, TotalFrequency: frequencyCount };
            }

            function dataFormat2() {
                var dataObject = [];
                for (var i in answerList) {
                    var responses = [];
                    //START NILESH-TSK42
                    //var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    var voterResults = {};
                    if (StaticValues.EnableDisplaySalesRepCountForSchoolNameJostenDataCollection) {
                        voterResults = repLogic.GetVoterAnswerValuesByAnswerID(StaticValues.JostenDataCollection.SalesRep.AnswerIds.iAspireUserName);
                    }
                    else {
                        voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    }
                    //END NILESH-TSK42
                    for (var k in voterResults) {
                        var textValue = voterResults[k].VoterAnswerValue;
                        if (textValue && textValue !== "") {
                            var wasFound = false;
                            for (var l in responses) {
                                if (responses[l].TextValue === textValue) {
                                    wasFound = true;
                                    responses[l].Count++;
                                    break;
                                }
                            }
                            if (wasFound === false) {
                                responses.push({
                                    TextValue: textValue,
                                    Count: 1
                                });
                            }
                        }
                    }
                    for (var q in responses) {
                        var percent = ((responses[q].Count / repConst.FilteredVotesCount) * 100).toFixed(1);
                        dataObject.push({
                                "name": responses[q].TextValue,
                                "data": [parseInt(percent)],
                                "tooltipText": makeTooltipForTotalsPercentDataObjectHC(responses[q].TextValue, responses[q].Count, percent)
                            });
                    }
                }
                return dataObject;
            }

            function dataFormat3() {
                var dataObject = [];
                var frequencyCount = 0;
                var newColumns = [];
                var dataLists = [];
                for (var j in answerList) {
                    var responses_history = [];
                    //START NILESH-TSK42
                    //var voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[j].OldAnswerID);
                    var voterResults_history = {};
                    if (StaticValues.EnableDisplaySalesRepCountForSchoolNameJostenDataCollection) {
                        voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(StaticValues.JostenDataCollection.SalesRep.AnswerIds.iAspireUserName);
                    }
                    else {
                        voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[j].OldAnswerID);
                    }
                    //END NILESH-TSK42
                    for (var n in voterResults_history) {
                        var textValue_history = voterResults_history[n].VoterAnswerValue;
                        if (textValue_history && textValue_history !== "") {
                            var wasFound_history = false;
                            var dateVal = null;
                            var momentFormat = "";
                            if (voterResults_history[n].DateFromForm !== -1) {
                                dateVal = voterResults_history[n].DateFromForm;
                                momentFormat = "MM-DD-YYYY";
                            } else {
                                dateVal = voterResults_history[n].StartDate;
                                momentFormat = "YYYY-MM-DDTHH:mm:ss";
                            }
                            var voterMoment = moment(dateVal, momentFormat);
                            var abstractDateVal = 0;
                            if (repConst.StartDate.isSame(voterMoment, "year") === true) {
                                abstractDateVal = voterMoment[momentFunc]();
                            } else {
                                var abstractDuration = (voterMoment.year() - repConst.StartDate.year()) * roundTrip;
                                abstractDateVal = voterMoment[momentFunc]() + abstractDuration;
                            }
                            for (var qq in responses_history) {
                                if (responses_history[qq].TextValue === textValue_history) {
                                    wasFound_history = true;
                                    responses_history[qq].DataList[abstractDateVal]++;
                                    frequencyCount++;
                                    break;
                                }
                            }
                            if (wasFound_history === false) {
                                var ob = {
                                    TextValue: textValue_history,
                                    DataList: {}
                                };
                                ob.DataList[abstractDateVal] = 1;
                                frequencyCount++;
                                responses_history.push(ob);
                            }
                        }
                    }
                    // loop through responses and set up columns and data lists
                    for (var m in responses_history) {
                        newColumns.push({
                            "id": responses_history[m].TextValue.toLowerCase(),
                            "label": responses_history[m].TextValue,
                            "type": "number"
                        });
                        dataLists.push(responses_history[m].DataList);
                    }
                }
                return { NewColumns: newColumns, DataLists: dataLists, TotalFrequency: frequencyCount };
            }
            
			//START NILESH-TSK21-4
            function dataFormat4() { // Distribution
                //FOR JOSTEN : LY-TY UNIT
                //START NILESH-TSK42 
                var returnAnswerQuestionId = StaticValues.JostenDataCollection.Ty.QuestionId;
                //END NILESH-TSK42

                var arrCategory = [];
                var seriesData = [];
                for (var i in answerList) {
                    //START NILESH-TSK42
                    //var voterResults = repLogic.GetVoterAnswerValuesForJostenByAnswerId(returnAnswerQuestionId, answerList[i].OldAnswerID);
                    var voterResults = {};
                    if (StaticValues.EnableDisplaySalesRepCountForSchoolNameJostenDataCollection) {
                        voterResults = repLogic.GetVoterAnswerValuesForJostenByAnswerId(returnAnswerQuestionId, StaticValues.JostenDataCollection.SalesRep.AnswerIds.iAspireUserName);
                    }
                    else {
                        voterResults = repLogic.GetVoterAnswerValuesForJostenByAnswerId(returnAnswerQuestionId, answerList[i].OldAnswerID);
                    }
                    //END NILESH-TSK42
                    for (var k in voterResults) {
                        var textValue = voterResults[k].VoterAnswerValue;
                        if (textValue && textValue !== "") {
                            if (arrCategory.indexOf(textValue) == -1) {
                                arrCategory.push(textValue);
                                var arrSeries = [];
                                arrSeries.push(parseFloat(voterResults[k].VoterSubAnswerValue));
                                seriesData.push(arrSeries);
                            }
                            else {
                                var index = arrCategory.indexOf(textValue);
                                seriesData[index].push(parseFloat(voterResults[k].VoterSubAnswerValue));
                            }
                        }
                    }
                    // add it to the object
                }
                var dataObject = [];
                for (k in seriesData)
                {
                    dataObject.push(GetBoxPlotData(seriesData[k]).GetArray());
                }

                var returnValue = {};
                returnValue.data = dataObject;
                returnValue.categories = arrCategory;
                return returnValue;
            }
            //END NILESH-TSK21-4

			
			if (dataFormatInt === 0) {
                return dataFormat0();
            }
            else if (dataFormatInt === 1) {
                return dataFormat1();
            } 
            else if (dataFormatInt === 2) {
                return dataFormat2();
            } 
            else if (dataFormatInt === 3) {
                return dataFormat3();
            }
			//START NILESH-TSK21-4
            else if (dataFormatInt === 4) {
                return dataFormat4();
            }
            //END NILESH-TSK21-4
            return {};
        }
        function getDataRowsHC_RangeAnswers(answerList, dataFormatInt, momentFunc, roundTrip) {
            function dataFormat0() {
                var dataObject = [];
                var frequencyCount = 0;
                for (var i in answerList) {
                    var responseOptions = {};
                    if (answerList[i].SliderStep === 0) answerList[i].SliderStep = 1;
                    for (var k = answerList[i].SliderMin; k <= answerList[i].SliderMax; k = k + answerList[i].SliderStep) {
                        responseOptions[k] = 0;
                    }
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    for (var j in voterResults) {
                        responseOptions[voterResults[j].VoterAnswerValue]++;
                        frequencyCount++;
                    }
                    var keys = Object.keys(responseOptions);
                    for (var l in keys) {
                        dataObject.push({
                            "name": keys[l],
                            "data": [responseOptions[keys[l]]],
                            "tooltipText": ''
                        });
                    }

                }
                for (var r in dataObject) {
                    dataObject[r].tooltipText = makeTooltipForTotalsObjectHC(dataObject[r], frequencyCount);
                }
                return dataObject;
            }
            function dataFormat1() {
                return null;
            }
            function dataFormat2() {
                var dataObject = [];
                for (var i in answerList) {
                    var responseOptions = {};
                    if (answerList[i].SliderStep === 0) answerList[i].SliderStep = 1;
                    for (var k = answerList[i].SliderMin; k <= answerList[i].SliderMax; k = k + answerList[i].SliderStep) {
                        responseOptions[k] = 0;
                    }
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    for (var j in voterResults) {
                        responseOptions[voterResults[j].VoterAnswerValue]++;
                    }
                    var keys = Object.keys(responseOptions);
                    for (var l in keys) {
                        var percent = ((responseOptions[keys[l]] / repConst.FilteredVotesCount) * 100).toFixed(1);
                        dataObject.push({
                            "c": [
                                { "v": keys[l] },
                                { "v": percent },
                                makeTooltipForTotalsPercentDataObject(keys[l].toString(), responseOptions[keys[l]], percent)
                            ]
                        });

                        dataObject.push({
                            "name": keys[l],
                            "data": [percent],
                            "tooltipText": makeTooltipForTotalsPercentDataObjectHC(keys[l].toString(), responseOptions[keys[l]], percent)
                        });
                    }
                }
                return dataObject;
            }
            function dataFormat3() {
                return null;
            }
            //START NILESH-TSK21-4
            function dataFormat4() { // Distribution

                //FOR JOSTEN : LY-TY UNIT
                //START NILESH-TSK42 
                var returnAnswerQuestionId = StaticValues.JostenDataCollection.Ty.QuestionId;
                //END NILESH-TSK42

                var dataObject = [];
                var frequencyCount = 0;
                var voterResponseList = [];
                var arrCategory = [];
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesForJostenByAnswerId(returnAnswerQuestionId, answerList[i].OldAnswerID);
                    var arrValues = [];
                    for (var k in voterResults) {
                        if (!isNaN(voterResults[k].VoterSubAnswerValue)) {
                            arrValues.push(parseInt(voterResults[k].VoterSubAnswerValue))
                        }
                    }
                    var finalArr = GetBoxPlotData(arrValues);

                    // add it to the object
                    arrCategory.push(answerList[i].CleanAnswerText);
                    dataObject.push(finalArr.GetArray());
                }
                var returnValue = {};
                returnValue.data = dataObject;
                returnValue.categories = arrCategory;
                return returnValue;
            }
            //END NILESH-TSK21-4

			
			if (dataFormatInt === 0) {
                return dataFormat0();
            } else if (dataFormatInt === 1) {
                return dataFormat1();
            } else if (dataFormatInt === 2) {
                return dataFormat2();
            } else if (dataFormatInt === 3) {
                return dataFormat3();
            }
			//START NILESH-TSK21-4
            else if (dataFormatInt === 4) {
                return dataFormat4();
            }
            //END NILESH-TSK21-4
            return {};
        }
        //END NILESH-TSK21
				

        function getDataRows_Boolean(answerList, dataFormatInt, momentFunc, roundTrip) {
            function dataFormat0() { // totals
                var dataObject = [];
                var frequencyCount = 0;
                var voterResponseList = [];
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    var answerCount = 0;
                    for (var k in voterResults) {
                        if (voterResults[k].VoterAnswerValue === "true" ||
                            voterResults[k].VoterAnswerValue === "1") {
                            answerCount++;
                            frequencyCount++;
                            if (voterResponseList.indexOf(voterResults[k].VoterID) === -1) {
                                voterResponseList.push(voterResults[k].VoterID);
                            }
                        }
                    }
                    // add it to the object
                    dataObject.push({
                        "c": [
                            { "v": answerList[i].CleanAnswerText },
                            { "v": answerCount }
                        ]
                    });
                }
                var questionResponseCount = voterResponseList.length;
                for (var r in dataObject) {
                    dataObject[r].c.push(makeTooltipForTotalsObject(dataObject[r].c, frequencyCount, questionResponseCount));
                }
                return dataObject;
            }
            function dataFormat1() { // history
                var newColumns = [];
                var dataLists = [];
                var dataObject = [];
                var frequencyCount = 0;
                for (var s in answerList) {
                    var data = {};
                    var voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[s].OldAnswerID);
                    for (var j in voterResults_history) {
                        var dateVal = null;
                        var momentFormat = "";
                        if (voterResults_history[j].DateFromForm !== -1) {
                            dateVal = voterResults_history[j].DateFromForm;
                            momentFormat = "MM-DD-YYYY";
                        } else {
                            dateVal = voterResults_history[j].StartDate;
                            momentFormat = "YYYY-MM-DDTHH:mm:ss";
                        }
                        var voterMoment = moment(dateVal, momentFormat);
                        var abstractDateVal = 0;
                        if (momentFunc !== "year") {
                            if (repConst.StartDate.isSame(voterMoment, "year") === true) {
                                abstractDateVal = voterMoment[momentFunc]();
                            } else {
                                var abstractDuration = (voterMoment.year() - repConst.StartDate.year()) * roundTrip;
                                abstractDateVal = voterMoment[momentFunc]() + abstractDuration;
                            }
                        } else {
                            abstractDateVal = voterMoment[momentFunc]();
                        }
                        if (!data[abstractDateVal]) {
                            data[abstractDateVal] = 1;
                            frequencyCount++;
                        } else {
                            data[abstractDateVal]++;
                            frequencyCount++;
                        }
                    }
                    newColumns.push({
                        "id": answerList[s].OldAnswerID,
                        "label": answerList[s].CleanAnswerText,
                        "type": "number"
                    });
                    dataLists.push(data);
                }
                return { NewColumns: newColumns, DataLists: dataLists, TotalFrequency: frequencyCount };
            }
            function dataFormat2() { // TotalsPercent
                var dataObject = [];
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    var answerCount = 0;
                    for (var k in voterResults) {
                        if (voterResults[k].VoterAnswerValue === "true" || voterResults[k].VoterAnswerValue === "1") {
                            answerCount++;
                        }
                    }
                    var percent = ((answerCount / repConst.FilteredVotesCount) * 100).toFixed(1);
                    dataObject.push({
                        "c": [
                            { "v": answerList[i].CleanAnswerText },
                            { "v": percent },
                            makeTooltipForTotalsPercentDataObject(answerList[i].CleanAnswerText, answerCount, percent)
                        ]
                    });
                }
                return dataObject;
            }
            function dataFormat3() { // TotalsHistory
                var dataObject = [];
                var dataLists = [];
                var newColumns = [];
                for (var s in answerList) {
                    var data = {};
                    var voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[s].OldAnswerID);
                    //console.log(voterResults_history);
                    for (var j in voterResults_history) {
                        var dateVal = null;
                        var momentFormat = "";
                        if (voterResults_history[j].DateFromForm !== -1) {
                            dateVal = voterResults_history[j].DateFromForm;
                            momentFormat = "MM-DD-YYYY";
                        } else {
                            dateVal = voterResults_history[j].StartDate;
                            momentFormat = "YYYY-MM-DDTHH:mm:ss";
                        }
                        var voterMoment = moment(dateVal, momentFormat);
                        var abstractDateVal = 0;
                        if (momentFunc !== "year") {
                            if (repConst.StartDate.isSame(voterMoment, "year") === true) {
                                abstractDateVal = voterMoment[momentFunc]();
                            } else {
                                var abstractDuration = (voterMoment.year() - repConst.StartDate.year()) * roundTrip;
                                abstractDateVal = voterMoment[momentFunc]() + abstractDuration;
                            }
                        } else {
                            abstractDateVal = voterMoment[momentFunc]();
                        }
                        //var abstractTime = moment(dateVal, momentFormat)[momentFunc]();
                        //console.log(dateVal, momentFormat, momentFunc, abstractTime);
                        if (!data[abstractDateVal]) {
                            data[abstractDateVal] = 1;
                        } else {
                            data[abstractDateVal]++;
                        }
                    }
                    newColumns.push({
                        "id": answerList[s].OldAnswerID,
                        "label": answerList[s].CleanAnswerText,
                        "type": "number"
                    });
                    dataLists.push(data);
                }
                return { NewColumns: newColumns, DataLists: dataLists };
            }
            if (dataFormatInt === 0) {
                return dataFormat0();
            } else if (dataFormatInt === 1) {
                return dataFormat1();
            } else if (dataFormatInt === 2) {
                return dataFormat2();
            } else if (dataFormatInt === 3) {
                return dataFormat3();
            }
            return {};
        }
        function getDataRows_BooleanOther(answerList, dataFormatInt, momentFunc, roundTrip) {
            function dataFormat0() {
                var dataObject = [];
                var frequencyCount = 0;
                var voterResponseList = [];
                for (var i in answerList) {
                    var responses = [];
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    var questionWasAnswered = false;
                    for (var k in voterResults) {
                        var textValue = voterResults[k].VoterAnswerValue;
                        if (textValue && textValue !== "") {
                            var wasFound = false;
                            for (var l in responses) {
                                if (responses[l].TextValue === textValue) {
                                    wasFound = true;
                                    responses[l].Count++;
                                    frequencyCount++;
                                    if (voterResponseList.indexOf(voterResults[k].VoterID) === -1) {
                                        voterResponseList.push(voterResults[k].VoterID);
                                    }
                                    break;
                                }
                            }
                            if (wasFound === false) {
                                responses.push({
                                    TextValue: textValue,
                                    Count: 1
                                });
                                frequencyCount++;
                                if (voterResponseList.indexOf(voterResults[k].VoterID) === -1) {
                                    voterResponseList.push(voterResults[k].VoterID);
                                }
                            }
                        }
                    }
                    // add it to the object
                    for (var j in responses) {
                        dataObject.push({
                            "c": [
                                { "v": responses[j].TextValue },
                                { "v": responses[j].Count }
                            ]
                        });
                    }
                }
                var questionResponseCount = voterResponseList.length;
                for (var r in dataObject) {
                    dataObject[r].c.push(makeTooltipForTotalsObject(dataObject[r].c, frequencyCount, questionResponseCount));
                }
                return dataObject;
            }
            function dataFormat1() {
                var dataObject = [];
                var frequencyCount = 0;
                var newColumns = [];
                var dataLists = [];
                for (var s in answerList) {
                    var responses_history = [];
                    var voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[s].OldAnswerID);
                    for (var m in voterResults_history) {
                        var textValue_history = voterResults_history[m].VoterAnswerValue;
                        if (textValue_history && textValue_history !== "") {
                            var wasFound_history = false;
                            var dateVal = null;
                            var momentFormat = "";
                            if (voterResults_history[m].DateFromForm !== -1) {
                                dateVal = voterResults_history[m].DateFromForm;
                                momentFormat = "MM-DD-YYYY";
                            } else {
                                dateVal = voterResults_history[m].StartDate;
                                momentFormat = "YYYY-MM-DDTHH:mm:ss";
                            }
                            var voterMoment = moment(dateVal, momentFormat);
                            var abstractDateVal = 0;
                            if (momentFunc !== "year") {
                                if (repConst.StartDate.isSame(voterMoment, "year") === true) {
                                    abstractDateVal = voterMoment[momentFunc]();
                                } else {
                                    var abstractDuration = (voterMoment.year() - repConst.StartDate.year()) * roundTrip;
                                    abstractDateVal = voterMoment[momentFunc]() + abstractDuration;
                                }
                            } else {
                                abstractDateVal = voterMoment[momentFunc]();
                            }
                            for (var n in responses_history) {
                                if (responses_history[n].TextValue === textValue_history) {
                                    wasFound_history = true;
                                    responses_history[n].DataList[abstractDateVal]++;
                                    frequencyCount++;
                                    break;
                                }
                            }
                            if (wasFound_history === false) {
                                var ob = {
                                    TextValue: textValue_history,
                                    DataList: {}
                                };
                                ob.DataList[abstractDateVal] = 1;
                                frequencyCount++;
                                responses_history.push(ob);
                            }
                        }
                    }
                    // loop through responses and set up columns and data lists
                    for (var q in responses_history) {
                        newColumns.push({
                            "id": responses_history[q].TextValue.toLowerCase(),
                            "label": responses_history[q].TextValue,
                            "type": "number"
                        });
                        dataLists.push(responses_history[q].DataList);
                    }
                }
                return { NewColumns: newColumns, DataLists: dataLists, TotalFrequency: frequencyCount };
            }
            function dataFormat2() {
                var dataObject = [];
                for (var i in answerList) {
                    var responses = [];
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    for (var k in voterResults) {
                        var textValue = voterResults[k].VoterAnswerValue;
                        if (textValue && textValue !== "") {
                            var wasFound = false;
                            for (var l in responses) {
                                if (responses[l].TextValue === textValue) {
                                    wasFound = true;
                                    responses[l].Count++;
                                    break;
                                }
                            }
                            if (wasFound === false) {
                                responses.push({
                                    TextValue: textValue,
                                    Count: 1
                                });
                            }
                        }
                    }
                    // add it to the object
                    for (var j in responses) {
                        var percent = ((responses[j].Count / repConst.FilteredVotesCount) * 100).toFixed(1);
                        dataObject.push({
                            "c": [
                                { "v": responses[j].TextValue },
                                { "v": percent },
                                makeTooltipForTotalsPercentDataObject(responses[j].TextValue, responses[j].Count, percent)
                            ]
                        });
                    }
                }
                return dataObject;
            }
            function dataFormat3() {
                var dataObject = [];
                var frequencyCount = 0;
                var newColumns = [];
                return dataObject;
            }

            if (dataFormatInt === 0) {
                return dataFormat0();
            } else if (dataFormatInt === 1) {
                return dataFormat1();
            } else if (dataFormatInt === 2) {
                return dataFormat2();
            } else if (dataFormatInt === 3) {
                return dataFormat3();
            }
            return {};
        }
        function getDataRows_TextEntry(answerList, dataFormatInt, momentFunc, roundTrip) {
            function dataFormat0() {
                var dataObject = [];
                var frequencyCount = 0;
                var voterResponseList = [];
								//START NILESH-TSK31
                var AnswerTotal = 0;
                //END NILESH-TSK31
                for (var i in answerList) {
                    var responses = [];
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    for (var k in voterResults) {
                        var textValue = voterResults[k].VoterAnswerValue;
                        if (textValue && textValue !== "") {
														//START NILESH-TSK31
                            //START NILESH-TSK35
                            if (GetAnswerIdForSumOfDuration_GoalSetting().indexOf(answerList[i].OldAnswerID) > -1) {
                                //END NILESH-TSK35
                                AnswerTotal += parseFloat(textValue);
                            }
                            else {
                                //END NILESH-TSK31
								var wasFound = false;
								for (var l in responses) {
									if (responses[l].TextValue === textValue) {
										wasFound = true;
										responses[l].Count++;
										frequencyCount++;
										if (voterResponseList.indexOf(voterResults[k].VoterID) === -1) {
											voterResponseList.push(voterResults[k].VoterID);
										}
										break;
									}
								}
								if (wasFound === false) {
									responses.push({
										TextValue: textValue,
										Count: 1
									});
									frequencyCount++;
									if (voterResponseList.indexOf(voterResults[k].VoterID) === -1) {
										voterResponseList.push(voterResults[k].VoterID);
									}
								}
								//START NILESH-TSK31
                            }
                            //END NILESH-TSK31
                        }
                    }
										//START NILESH-TSK31
                    //START NILESH-TSK35
                    if (GetAnswerIdForSumOfDuration_GoalSetting().indexOf(answerList[0].OldAnswerID ) > -1) {
                        //END NILESH-TSK35
                        dataObject.push({
                            "c": [
                                { "v": "Total" },
                                { "v": AnswerTotal }
                            ]
                        });
                    }
                    else {
                        //END NILESH-TSK31
						for (var q in responses) {
							dataObject.push({
								"c": [
									{ "v": responses[q].TextValue },
									{ "v": responses[q].Count }
								]
							});
						}
						//START NILESH-TSK31
                    }
                    //END NILESH-TSK31
                }
                var questionResponseCount = voterResponseList.length;
                for (var r in dataObject) {
										//START NILESH-TSK31
                    //START NILESH-TSK35
                    if (GetAnswerIdForSumOfDuration_GoalSetting().indexOf(answerList[0].OldAnswerID ) > -1) {
                       //END NILESH-TSK35
                       dataObject[r].c.push(makeTooltipForTotalsObject_TotalMinute(dataObject[r].c, frequencyCount, questionResponseCount));
                    }
                    else
                    {
                        dataObject[r].c.push(makeTooltipForTotalsObject(dataObject[r].c, frequencyCount, questionResponseCount));
                    }
                    //END NILESH-TSK31
                }
                return dataObject;
            }
            function dataFormat1() {
                var dataObject = [];
                var frequencyCount = 0;
                var newColumns = [];
                var dataLists = [];
                for (var j in answerList) {
                    var responses_history = [];
                    var voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[j].OldAnswerID);
                    for (var n in voterResults_history) {
                        var textValue_history = voterResults_history[n].VoterAnswerValue;
                        if (textValue_history && textValue_history !== "") {
                            var wasFound_history = false;
                            var dateVal = null;
                            var momentFormat = "";
                            if (voterResults_history[n].DateFromForm !== -1) {
                                dateVal = voterResults_history[n].DateFromForm;
                                momentFormat = "MM-DD-YYYY";
                            } else {
                                dateVal = voterResults_history[n].StartDate;
                                momentFormat = "YYYY-MM-DDTHH:mm:ss";
                            }
                            var voterMoment = moment(dateVal, momentFormat);
                            var abstractDateVal = 0;
                            if (repConst.StartDate.isSame(voterMoment, "year") === true) {
                                abstractDateVal = voterMoment[momentFunc]();
                            } else {
                                var abstractDuration = (voterMoment.year() - repConst.StartDate.year()) * roundTrip;
                                abstractDateVal = voterMoment[momentFunc]() + abstractDuration;
                            }
                            //START NILESH-TSK31
                            //START NILESH-TSK35
                            if (GetAnswerIdForSumOfDuration_GoalSetting().indexOf(answerList[j].OldAnswerID ) > -1) {
                                //START NILESH-TSK35
                                for (var qq in responses_history) {
                                    if (responses_history[qq].TextValue === "Total") {
                                        wasFound_history = true;
                                        responses_history[qq].DataList[abstractDateVal] += parseFloat(textValue_history);
                                        frequencyCount++;
                                        break;
                                    }
                                }
                                if (wasFound_history === false) {
                                    var ob = {
                                        TextValue: "Total",
                                        DataList: {}
                                    };
                                    ob.DataList[abstractDateVal] = parseFloat(textValue_history);
                                    frequencyCount++;
                                    responses_history.push(ob);
                                }
                            }
                            else {
                                //END NILESH-TSK31
                                for (var qq in responses_history) {
                                    if (responses_history[qq].TextValue === textValue_history) {
                                        wasFound_history = true;
                                        responses_history[qq].DataList[abstractDateVal]++;
                                        frequencyCount++;
                                        break;
                                    }
                                }
                                if (wasFound_history === false) {
                                    var ob = {
                                        TextValue: textValue_history,
                                        DataList: {}
                                    };
                                    ob.DataList[abstractDateVal] = 1;
                                    frequencyCount++;
                                    responses_history.push(ob);
                                }
                                //START NILESH-TSK31
                            }
                            //END NILESH-TSK31
                        }
                    }
                    // loop through responses and set up columns and data lists
                    for (var m in responses_history) {
                        newColumns.push({
                            "id": responses_history[m].TextValue.toLowerCase(),
                            "label": responses_history[m].TextValue,
                            "type": "number"
                        });
                        dataLists.push(responses_history[m].DataList);
                    }
                }
                return { NewColumns: newColumns, DataLists: dataLists, TotalFrequency: frequencyCount };
            }
            
						
						function dataFormat2() {
                var dataObject = [];
                for (var i in answerList) {
                    var responses = [];
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    for (var k in voterResults) {
                        var textValue = voterResults[k].VoterAnswerValue;
                        if (textValue && textValue !== "") {
                            var wasFound = false;
                            for (var l in responses) {
                                if (responses[l].TextValue === textValue) {
                                    wasFound = true;
                                    responses[l].Count++;
                                    break;
                                }
                            }
                            if (wasFound === false) {
                                responses.push({
                                    TextValue: textValue,
                                    Count: 1
                                });
                            }
                        }
                    }
                    for (var q in responses) {
                        var percent = ((responses[q].Count / repConst.FilteredVotesCount) * 100).toFixed(1);
                        dataObject.push({
                            "c": [
                                { "v": responses[q].TextValue },
                                { "v": percent },
                                makeTooltipForTotalsPercentDataObject(responses[q].TextValue, responses[q].Count, percent)
                            ]
                        });
                    }
                }
                return dataObject;
            }
            function dataFormat3() {
                var dataObject = [];
                var frequencyCount = 0;
                var newColumns = [];
                var dataLists = [];
                for (var j in answerList) {
                    var responses_history = [];
                    var voterResults_history = repLogic.GetVoterAnswerValuesByAnswerID(answerList[j].OldAnswerID);
                    for (var n in voterResults_history) {
                        var textValue_history = voterResults_history[n].VoterAnswerValue;
                        if (textValue_history && textValue_history !== "") {
                            var wasFound_history = false;
                            var dateVal = null;
                            var momentFormat = "";
                            if (voterResults_history[n].DateFromForm !== -1) {
                                dateVal = voterResults_history[n].DateFromForm;
                                momentFormat = "MM-DD-YYYY";
                            } else {
                                dateVal = voterResults_history[n].StartDate;
                                momentFormat = "YYYY-MM-DDTHH:mm:ss";
                            }
                            var voterMoment = moment(dateVal, momentFormat);
                            var abstractDateVal = 0;
                            if (repConst.StartDate.isSame(voterMoment, "year") === true) {
                                abstractDateVal = voterMoment[momentFunc]();
                            } else {
                                var abstractDuration = (voterMoment.year() - repConst.StartDate.year()) * roundTrip;
                                abstractDateVal = voterMoment[momentFunc]() + abstractDuration;
                            }
                            for (var qq in responses_history) {
                                if (responses_history[qq].TextValue === textValue_history) {
                                    wasFound_history = true;
                                    responses_history[qq].DataList[abstractDateVal]++;
                                    frequencyCount++;
                                    break;
                                }
                            }
                            if (wasFound_history === false) {
                                var ob = {
                                    TextValue: textValue_history,
                                    DataList: {}
                                };
                                ob.DataList[abstractDateVal] = 1;
                                frequencyCount++;
                                responses_history.push(ob);
                            }
                        }
                    }
                    // loop through responses and set up columns and data lists
                    for (var m in responses_history) {
                        newColumns.push({
                            "id": responses_history[m].TextValue.toLowerCase(),
                            "label": responses_history[m].TextValue,
                            "type": "number"
                        });
                        dataLists.push(responses_history[m].DataList);
                    }
                }
                return { NewColumns: newColumns, DataLists: dataLists, TotalFrequency: frequencyCount };
            }

            if (dataFormatInt === 0) {
                return dataFormat0();
            } else if (dataFormatInt === 1) {
                return dataFormat1();
            } else if (dataFormatInt === 2) {
                return dataFormat2();
            } else if (dataFormatInt === 3) {
                return dataFormat3();
            }
            return {};
        }
        function getDataRows_RangeAnswers(answerList, dataFormatInt, momentFunc, roundTrip) {
            function dataFormat0() {
                var dataObject = [];
                var frequencyCount = 0;
                for (var i in answerList) {
                    var responseOptions = {};
                    if (answerList[i].SliderStep === 0) answerList[i].SliderStep = 1;
                    for (var k = answerList[i].SliderMin; k <= answerList[i].SliderMax; k = k + answerList[i].SliderStep) {
                        responseOptions[k] = 0;
                    }
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    for (var j in voterResults) {
                        responseOptions[voterResults[j].VoterAnswerValue]++;
                        frequencyCount++;
                    }
                    var keys = Object.keys(responseOptions);
                    for (var l in keys) {
                        dataObject.push({
                            "c": [
                                { "v": keys[l] },
                                { "v": responseOptions[keys[l]] }
                            ]
                        });
                    }
                }
                for (var r in dataObject) {
                    dataObject[r].c.push(makeTooltipForTotalsObject(dataObject[r].c, frequencyCount));
                }
                return dataObject;
            }
            function dataFormat1() {
                return null;
            }
            function dataFormat2() {
                var dataObject = [];
                for (var i in answerList) {
                    var responseOptions = {};
                    if (answerList[i].SliderStep === 0) answerList[i].SliderStep = 1;
                    for (var k = answerList[i].SliderMin; k <= answerList[i].SliderMax; k = k + answerList[i].SliderStep) {
                        responseOptions[k] = 0;
                    }
                    var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                    for (var j in voterResults) {
                        responseOptions[voterResults[j].VoterAnswerValue]++;
                    }
                    var keys = Object.keys(responseOptions);
                    for (var l in keys) {
                        var percent = ((responseOptions[keys[l]] / repConst.FilteredVotesCount) * 100).toFixed(1);
                        dataObject.push({
                            "c": [
                                { "v": keys[l] },
                                { "v": percent },
                                makeTooltipForTotalsPercentDataObject(keys[l].toString(), responseOptions[keys[l]], percent)
                            ]
                        });
                    }
                }
                return dataObject;
            }
            function dataFormat3() {
                return null;
            }
            if (dataFormatInt === 0) {
                return dataFormat0();
            } else if (dataFormatInt === 1) {
                return dataFormat1();
            } else if (dataFormatInt === 2) {
                return dataFormat2();
            } else if (dataFormatInt === 3) {
                return dataFormat3();
            }
            return {};
        }
        function getDataRows_DropDownAnswers(answerList, dataFormatInt, momentFunc, roundTrip) {

        }
				
        function getDataRows_Comments(answerList) {
            var commentList = [];
            for (var i in answerList) {
                var voterResults = repLogic.GetVoterAnswerValuesByAnswerID(answerList[i].OldAnswerID);
                for (var k in voterResults) {
                    var dateVal = null;
                    if (voterResults[k].DateFromForm !== -1) {
                        dateVal = voterResults[k].DateFromForm;
                    } else {
                        dateVal = voterResults[k].StartDate;
                    }
                    var voterStartDate = moment(dateVal, "MM-DD-YYYY").utcOffset(moment().utcOffset());
                    //console.log((voterStartDate.isValid() ? voterStartDate.format("D MMM, YYYY") : ""));
                    var commentObject = {
                        //VoterStartDate: moment.utc(dateVal, "MM-DD-YYYY").utcOffset(moment().utcOffset()).format("D MMM, YYYY"),
                        //VoterStartDate: (voterStartDate.isValid() ? "" : voterStartDate.format("D MMM, YYYY")),
                        VoterStartDate: (voterStartDate.isValid() ? voterStartDate.format("D MMM, YYYY") : ""),
                        CommentText: voterResults[k].VoterAnswerValue
                    };
                    commentList.push(commentObject);
                }
            }
            return commentList;
        }

        function checkAnswerType_IsBooleanAnswerType(answer) {
            if (answer.AnswerTypeID === 1) return true; // SelectionTextType
            return false;
        }
        function checkAnswerType_IsOtherAnswerType(answer) {
            if (answer.AnswerTypeID === 2) return true; // field - other
            return false;
        }
        function checkAnswerType_IsRangeAnswerType(answer) {
            if (answer.AnswerTypeID === 56) return true; // field-slider
            return false;
        }
        function checkAnswerType_IsHiddenAnswerType(answer) {
            if (answer.AnswerTypeID === 27) return true; // FieldHiddenType
            if (answer.AnswerTypeID === 101) return true; // iAspire - hidden
            return false;
        }
        function checkAnswerType_IsDropDownAnswerType(answer) {
            return false;
        }
        function checkAnswerType_IsCommentAnswerType(answer) {
            if (answer.AnswerTypeID === 24) return true; // FieldLargeType
            return false;
        }
        function checkAnswerType_IsTextboxAnswerType(answer) {
            console.log(19);
            if (answer.AnswerTypeID === 3) return true; // field-basic
            if (answer.AnswerTypeID === 103) return true; // iAspire - Encrypted
            return false;
        }
        function checkAnswerType_IsCalendarAnswerType(answer) {
            if (answer.AnswerTypeID === 22) return true; // FieldCalendarType
            return false;
        }
        function checkAnswerType_IsFileUploadAnswerType(answer) {
            if (answer.AnswerTypeID === 30) return true; // ExtendedFileUploadType
            return false;
        }

        function getAbstractTimeValue(timeIntervalInt, dateVal) {
            var pointInTime = moment(dateVal);
            var returnValue = null;
            switch (timeIntervalInt) {
                case 0: // day
                    returnValue = pointInTime.dayOfYear();
                    break;
                case 1: // week
                    returnValue = pointInTime.week();
                    break;
                    //case 2: // bi-week
                    //    returnValue = Math.floor(pointInTime.week() / 2);
                    //    break;
                case 3: // month
                    returnValue = pointInTime.month();
                    break;
                    //case 4: // bi-month
                    //    returnValue = Math.floor(pointInTime.month() / 2);
                    //    break;
                case 5: // quarter
                    returnValue = pointInTime.quarter();
                    break;
                    //case 6: // half-year
                    //    returnValue = Math.floor(pointInTime.quarter() / 2);
                    //    break;
                case 7: // year
                    returnValue = pointInTime.year();
                    break;
                default: // shouldn't happen
                    break;
            }
            return returnValue;
        }
    }

    function reportingQuestionInterface($q, repConst) {
        var service = {};

        var images = [];
        var commentTables = [];
        //var imageIndexes = [];

        service.RegisterImage = registerImage;
        service.RegisterCommentOnlyQuestion = registerCommentOnlyQuestion;
        service.RenderSingleReport = renderSingleReport;
        service.RenderReport = renderPagedReport;
        service.PrepForNewSurvey = prepForNewSurvey;

        function prepForNewSurvey() {
            images = [];
            commentTables = [];
        }

        function getTableObjectFromHTML(domObject) {
            /// <param name="domObject" type="HTMLElement">html element to create table from</param>
            var cols = [];
            var rows = [];
            // for each cell in the header
            for (var i = 0, len = domObject.children[0].children[0].children.length; i < len; i++) {
                cols.push(domObject.children[0].children[0].children[i].textContent);
            }
            // for each row in the table-body
            for (var k = 0, lenk = domObject.children[1].children.length; k < lenk; k++) {
                var tr = domObject.children[1].children[k];
                var innerRow = [];
                for (var m = 0, lenm = tr.children.length; m < lenm; m++) {
                    innerRow.push(tr.children[m].textContent);
                }
                rows.push(innerRow);
            }
            return {
                columns: cols,
                rows: rows
            };
        }

        function registerImage(displayOrder, questionID, base64) {
            var index = -1;
            var imageObject = {
                displayOrder: displayOrder,
                questionID: questionID,
                base64: base64
            };
            if (images.filter(function (e, i) { if (e.questionID === questionID) { index = i; return true; } return false; }).length > 0) {
                images.splice(index, 1, imageObject);
            } else {
                images.push(imageObject);
            }
            images.sort(function (a, b) {
                return a.displayOrder == b.displayOrder;
            });
            //images[displayOrder] = base64;
            //if (imageIndexes.indexOf(displayOrder) === -1) {
            //    imageIndexes.push(displayOrder);
            //}
        }

        function registerCommentOnlyQuestion(questionID) {
            var domTable = document.getElementById("comments-" + questionID);
            var table = getTableObjectFromHTML(domTable.children[0]);
            if (table.rows.length > 0) {
                var index = commentTables.map(function (e) { return e.questionID; }).indexOf(questionID);
                if (index > -1) {
                    commentTables.splice(index, 1, {
                        questionID: questionID,
                        table: table
                    });
                } else {
                    commentTables.push({
                        questionID: questionID,
                        table: table
                    });
                }
            }
        }

        function renderSingleReport(questionID) {
            var singleImageHeight = 0;
            var singleImageWidth = 0;
            var scaleRatio = (72 / 96); // pixels to pt
            var initialImageLoadDeferred = $q.defer();

            var image = new Image();
            image.onload = function () {
                var imageAspectRatio = (this.width / this.height);
                singleImageHeight = (this.height) * scaleRatio;
                singleImageWidth = (this.width) * scaleRatio;
                if (singleImageWidth > 612 - 30) {
                    var additionalScale = (612 - 30) / singleImageWidth;
                    singleImageHeight *= additionalScale;
                    singleImageWidth *= additionalScale;
                }
                initialImageLoadDeferred.resolve();
            };
            image.src = images[0].base64;

            initialImageLoadDeferred.promise.then(function () {
                image = null;
                var doc = new jsPDF("p", "pt", "letter");
                doc.setFontSize(8);
                //var table = getTableObjectFromHTML(document.getElementById("VoteListWrapper").children[0]);
                //doc.autoTable(table.columns, table.rows, {
                //    styles: {
                //        fontSize: 10,
                //        overflow: 'linebreak'
                //    }
                //});
                //doc.addPage();
                var yIndex = 10;
                image = images.filter(function (e) { if (e.questionID == questionID) return true; return false; });
                if (image.length > 0) {
                    doc.addImage(image[0].base64, 0, 10, singleImageWidth, singleImageHeight);
                    yIndex += singleImageHeight;
                }
                var table2 = getTableObjectFromHTML(document.getElementById("comments-" + questionID).children[0]);
                if (table2.rows.length > 0) {
                    doc.autoTable(table2.columns, table2.rows, {
                        startY: yIndex + 20,
                        //margin: { top: singleImageHeight + 20 },
                        styles: {
                            fontSize: 10,
                            overflow: 'linebreak'
                        }
                    });
                }
                var string = repConst.SurveyTitle || "singleReport";
                doc.save(string + ".pdf");
            });
        }

        function renderPagedReport() {
            var returnValue = $q.defer();
            var singleImageHeight = 0;
            var singleImageWidth = 0;
            var scaleRatio = (72 / 96); // pixels to pt
            var initialImageLoadDeferred = $q.defer();

            var image = new Image();
            image.onload = function () {
                var imageAspectRatio = (this.width / this.height);
                singleImageHeight = (this.height) * scaleRatio;
                singleImageWidth = (this.width) * scaleRatio;
                if (singleImageWidth > 612 - 30) {
                    var additionalScale = (612 - 30) / singleImageWidth;
                    singleImageHeight *= additionalScale;
                    singleImageWidth *= additionalScale;
                }
                initialImageLoadDeferred.resolve();
            };
            image.src = images[0].base64;

            initialImageLoadDeferred.promise.then(function () {
                image = null;
                var doc = new jsPDF("p", "pt", "letter");
                doc.setFontSize(8);
                var tbl = getTableObjectFromHTML(document.getElementById("VoteListWrapper").children[0]);
                var temp = document.createElement("div");
                temp.id = "temp";
                temp.innerHTML = document.getElementById("VoteListWrapper");
                document.body.appendChild(temp);
                doc.autoTable(tbl.columns, tbl.rows, {
                    styles: {
                        fontSize: 10,
                        overflow: 'linebreak'
                    }
                });

                var table = null;
                var element = null;
                for (var i = 0, len = images.length; i < len; i++) {
                    doc.addPage();
                    doc.addImage(images[i].base64, 0, 10, singleImageWidth, singleImageHeight);
                    element = document.getElementById("comments-" + images[i].questionID);
                    if (element !== null) {
                        element = element.children[0];
                        table = getTableObjectFromHTML(element);
                    }
                    if (table !== null && table.rows.length > 0) {
                        doc.autoTable(table.columns, table.rows, {
                            startY: singleImageHeight + 20,
                            //margin: { top: singleImageHeight + 20 },
                            styles: {
                                fontSize: 10,
                                overflow: 'linebreak'
                            }
                        });
                    }
                    table = null;
                    element = null;
                }

                for (var k = 0, lenk = commentTables.length; k < lenk; k++) {
                    doc.addPage();
                    doc.autoTable(commentTables[k].table.columns, commentTables[k].table.rows, {
                        styles: {
                            fontSize: 10,
                            overflow: 'linebreak'
                        }
                    });
                }
                var string = repConst.SurveyTitle || "singleReport";
                doc.save(string + ".pdf");
            });
            return returnValue.promise;
        }

        function renderReport() {
            var returnValue = $q.defer();
            var singleImageHeight = 0;
            var singleImageWidth = 0;
            var scaleRatio = (72 / 96); // pixels to pt
            var initialImageLoadDeferred = $q.defer();

            imageIndexes.sort(function (a, b) {
                return a - b;
            });

            var image = new Image();
            image.onload = function () {
                var imageAspectRatio = (this.width / this.height);
                singleImageHeight = (this.height) * scaleRatio;
                singleImageWidth = (this.width) * scaleRatio;
                if (singleImageWidth > 612 - 30) {
                    var additionalScale = (612 - 30) / singleImageWidth;
                    singleImageHeight *= additionalScale;
                    singleImageWidth *= additionalScale;
                }
                initialImageLoadDeferred.resolve();
            };
            image.src = images[imageIndexes[0]];

            initialImageLoadDeferred.promise.then(function () {
                image = null;
                var imagesPerPage = Math.floor(792 / singleImageHeight); // 792 standard pt height of letter size paper
                var doc = new jsPDF("p", "pt", "letter");

                doc.fromHTML(document.getElementById("VoteListWrapper"), 15, 15, {
                    "width": 612
                });
                doc.addPage();

                var pageIndex = 0;
                var imagesOnThisPage = 0;

                for (var i = 0, len = imageIndexes.length; i < len; i++) {
                    if (imagesOnThisPage === imagesPerPage) {
                        doc.addPage();
                        pageIndex += 1;
                        imagesOnThisPage = 0;
                    }
                    //doc.addImage(images[imageIndexes[i]], 0, ((792 * pageIndex) + (imagesOnThisPage * singleImageHeight)), singleImageWidth, singleImageHeight);
                    doc.addImage(images[imageIndexes[i]], 0, (imagesOnThisPage * singleImageHeight) + 10, singleImageWidth, singleImageHeight);
                    imagesOnThisPage += 1;
                }
                var string = repConst.SurveyTitle || "singleReport";
                doc.save(string + ".pdf");
            });
            return returnValue.promise;
        }

        return service;
    }
    //START NILESH-TSK42
    function reportingQuestionController($scope, repCLogic, repQConstants, repQInterface, StaticValues) {
        //END NILESH-TSK42
	    //START NILESH-TSK21
        $scope.IsPremiumUser =  $scope.$parent.AppC.ActiveUser.IsPremium;
        localStorage.setItem("IsPremiumUser", $scope.IsPremiumUser);
        $scope.hiChartConfig = null;
        //END NILESH-TSK21

        var dataFormatEnum = {
            "Totals": 1,
            "History": 2,
			//START NILESH-TSK21-5
            "Distribution": 3
            //END NILESH-TSK21-5
        };
        var dataTypeEnum = {
            "Frequency": 4,
            "Percent": 8
        };
        var s1, s2;
        var reportingSettings_DataFormat = localStorage.getItem("ReportingSettings_DataFormat");
        var reportingSettings_DataType = localStorage.getItem("ReportingSettings_DataType");

        if (reportingSettings_DataFormat) {
            s1 = dataFormatEnum[reportingSettings_DataFormat];
        } else {
            s1 = dataFormatEnum.Totals;
        }
        if (reportingSettings_DataType) {
            s2 = dataTypeEnum[reportingSettings_DataType];
        } else {
            s2 = dataTypeEnum.Frequency;
        }

        //console.log(s1, s2);

        /*jshint validthis:true */
        var BrQC = this;

        BrQC.Question = $scope.passedQuestion;
        BrQC.ChartType = "ColumnChart";

        switch (s1 | s2) {
            case dataFormatEnum.Totals | dataTypeEnum.Frequency:
                BrQC.DataFormat = "Totals";
                break;
            case dataFormatEnum.Totals | dataTypeEnum.Percent:
                BrQC.DataFormat = "TotalsPercent";
                break;
            case dataFormatEnum.History | dataTypeEnum.Frequency:
                BrQC.DataFormat = "History";
                break;
            case dataFormatEnum.History | dataTypeEnum.Percent:
                BrQC.DataFormat = "HistoryPercent";
                break;
            default:
                //START NILESH-TSK21-5
                if (s1 = dataFormatEnum.Distribution) {
                    BrQC.DataFormat = "Distribution";
                }
                else {
                    BrQC.DataFormat = "Totals";
                }
                //END NILESH-TSK21-5
                break;
        }

        BrQC.TimeInterval = null;
        BrQC.TimeIntervals = [];
        BrQC.CommentList = [];
        BrQC.ShowComments = false;
        BrQC.Show = true;
        BrQC.GoogleChartsObjectList = [];
		//START NILESH-TSK21
        BrQC.HighChartObjectList = []
        //END NILESH-TSK21
        BrQC.ContainsOnlyComments = false;

        BrQC.ChangeChartType = changeChartType;
        BrQC.ChangeDataFormat = changeDataFormat;
        BrQC.DisplayComments = displayComments;
        BrQC.DrawImage = drawImage;
        BrQC.RenderSingleReport = renderSingleReport;
		//START NILESH-TSK31
        BrQC.GetQuestionIdForSumOfDuration_GoalSetting = getQuestionIdForSumOfDuration_GoalSetting;
        //END NILESH-TSK31
        //START NILESH-TSK42
        BrQC.HideHistoryPercentQuestionId = hideHistoryPercentQuestionId;
        BrQC.HideDistributionQuestionId = hideDistributionQuestionId;
        BrQC.HideTotalPercentQuestionId = hideTotalPercentQuestionId;
        //END NILESH-TSK42


        var timeInterval = localStorage.getItem("ReportingSettings_DateRangeType") || "Week";
        if (timeInterval && repQConstants.TimeIntervalEnum[timeInterval]) {
            BrQC.TimeInterval = timeInterval;
        } else {
            BrQC.TimeInterval = "Week";
        }

        for (var k in repQConstants.TimeIntervalEnum) {
            BrQC.TimeIntervals.push({
                string: k,
                value: repQConstants.TimeIntervalEnum[k]
            });
        }
        //BrQC.TimeInterval = "Month"; // month

        var chartTypeWatcherDestroyer = null;
        var dataFormatWatcherDestroyer = null;
        var timeIntervalWatcherDestroyer = null;
        setChartTypeWatcher();
        setDataFormatWatcher();
        setTimeIntervalWatcher();


        formatDataForCorrectReportType();

        return BrQC;

        function setChartTypeWatcher() {
            chartTypeWatcherDestroyer = $scope.$watch("BrQC.ChartType", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    BrQC.CommentList = [];
                    BrQC.GoogleChartsObjectList = [];
					//START NILESH-TSK21
                    BrQC.HighChartObjectList = [];
                    //START NILESH-TSK21
                    formatDataForCorrectReportType();
                }
            });
        }

        function setDataFormatWatcher() {
            dataFormatWatcherDestroyer = $scope.$watch("BrQC.DataFormat", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    BrQC.CommentList = [];
                    BrQC.GoogleChartsObjectList = [];
                    //START NILESH-TSK21
                    BrQC.HighChartObjectList = [];
                    //START NILESH-TSK21
                    formatDataForCorrectReportType();
                }
            });
        }

        function setTimeIntervalWatcher() {
            timeIntervalWatcherDestroyer = $scope.$watch("BrQC.TimeInterval", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    BrQC.CommentList = [];
                    BrQC.GoogleChartsObjectList = [];
                    //START NILESH-TSK21
                    BrQC.HighChartObjectList = [];
                    //START NILESH-TSK21
                    formatDataForCorrectReportType();
                }
            });
        }

        function changeDataFormat(newDataFormat) {
            chartTypeWatcherDestroyer(); // disable the chart type watcher for a moment
            //START NILESH-TSK31
            //START NILESH-TSK35
            if (getQuestionIdForSumOfDuration_GoalSetting().indexOf(BrQC.Question.OldQuestionID) > -1) {
                //END NILESH-TSK35
                if (newDataFormat === BrQC.DataFormat)
                {
                    return;
                }
            }
            //END NILESH-TSK31
            
						if (newDataFormat === "History") {
                if (BrQC.ChartType === "PieChart") {
                    BrQC.ChartType = "ColumnChart";
                }
            } else if (newDataFormat === "Totals") {
                if (BrQC.ChartType === "LineChart") {
                    BrQC.ChartType = "ColumnChart";
                } else if (BrQC.ChartType === "PieChart") {
                    BrQC.ChartType = "ColumnChart";
                }
            }
           
            setChartTypeWatcher();

            if (newDataFormat === BrQC.DataFormat) {
                if (newDataFormat === "History") {
                    newDataFormat = "HistoryPercent";
                } else if (newDataFormat === "HistoryPercent") {
                    newDataFormat = "History";
                } else if (newDataFormat === "Totals") {
                    newDataFormat = "TotalsPercent";
                } else if (newDataFormat === "TotalsPercent") {
                    newDataFormat = "Totals";
                }
            }
            BrQC.DataFormat = newDataFormat;
            formatDataForCorrectReportType();
        }

        function changeChartType(chartType) {
            if (repQConstants.ChartTypeEnum[chartType] > -1 && repQConstants.ChartTypeEnum[chartType] <= 3) {
                if (BrQC.ChartType === chartType) {
                    if (BrQC.ChartType === "PieChart") {
                        for (var i in BrQC.GoogleChartsObjectList) {
                            //console.log(BrQC.GoogleChartsObjectList[i]);
                            var minValue = 0;
                            var maxValue = 0;
                            var total = 0;
                            var slices = null;
                            if (!BrQC.GoogleChartsObjectList[i].options.slices) {
                                slices = {};
                                for (var k in BrQC.GoogleChartsObjectList[i].data.rows) {
                                    if (BrQC.GoogleChartsObjectList[i].data.rows[k].c[1]) {
                                        var val = BrQC.GoogleChartsObjectList[i].data.rows[k].c[1].v;
                                        total = total + val;
                                        if (val > maxValue) maxValue = val;
                                        if (val < minValue) minValue = val;
                                    }
                                }
                                if (total > 0) {
                                    for (var m in BrQC.GoogleChartsObjectList[i].data.rows) {
                                        if (BrQC.GoogleChartsObjectList[i].data.rows[m].c[1]) {
                                            var modVal = BrQC.GoogleChartsObjectList[i].data.rows[m].c[1].v;
                                            slices[m] = { offset: 0.5 - (((modVal - minValue) / maxValue) * 0.5) };
                                        }
                                    }
                                }
                            }
                            BrQC.GoogleChartsObjectList[i].options.slices = slices;
                        }
                    } else if (BrQC.ChartType === "ColumnChart" && BrQC.DataFormat !== "HistoryPercent") {
                        for (var aa in BrQC.GoogleChartsObjectList) {
                            BrQC.GoogleChartsObjectList[aa].options.isStacked = !BrQC.GoogleChartsObjectList[aa].options.isStacked;
                        }
                    } else if (BrQC.ChartType === "LineChart") {
                        for (var bb in BrQC.GoogleChartsObjectList) {
                            var curveType = null;
                            if (!BrQC.GoogleChartsObjectList[bb].options.curveType) {
                                curveType = "function";
                            }
                            BrQC.GoogleChartsObjectList[bb].options.curveType = curveType;
                        }
                    }
                } else {
                    BrQC.ChartType = chartType;
                }
            }
        }

        function displayComments(bit) {
            BrQC.ShowComments = repCLogic.DisplayComments(bit);
        }

        function formatDataForCorrectReportType() {
            //START NILESH-TSK42
            StaticValues.InitStaticValues(BrQC.Question);
            //END NILESH-TSK42

            var returnObject = repCLogic.FormatDataForCorrectReportType(BrQC.Question, BrQC.ChartType, BrQC.DataFormat, BrQC.TimeInterval);
            //console.log(JSON.stringify(returnObject));
            //console.log(returnObject);
            var containsData = false;
						
			//START NILESH-TSK21
            if (localStorage.getItem("IsPremiumUser") == "true") {
                for (var i in returnObject.HighChartObjectList) {
                    outerLoop:
                        for (var k in returnObject.HighChartObjectList[i].series) {
                            if (returnObject.HighChartObjectList[i].series[k].data) { // kek
                                for (var m in returnObject.HighChartObjectList[i].series[k].data) {
                                    //START NILESH-TSK21-4
									if (returnObject.HighChartObjectList[i].series[k].data[m] ) {
                                        containsData = true;
                                    }
                                    else if (typeof (returnObject.HighChartObjectList[i].series[k].data[m]) == "object"){
                                        containsData = true;
                                    }
                                    else if (returnObject.HighChartObjectList[i].series[k].data[m] && returnObject.HighChartObjectList[i].series[k].data[m] > "0.0") {
                                        containsData = true;
                                    }
                                    if (containsData)
                                    {
                                        BrQC.HighChartObjectList.push(returnObject.HighChartObjectList[i]);
                                        break outerLoop;
                                    }
									//END NILESH-TSK21-4
                                }
                            }
                        }
                }
            }
            else {
              //END NILESH-TSK21
			    for (var i in returnObject.GoogleChartsObjectList) {
					    for (var k in returnObject.GoogleChartsObjectList[i].data.rows) {
							    if (returnObject.GoogleChartsObjectList[i].data.rows[k].c[1] && returnObject.GoogleChartsObjectList[i].data.rows[k].c[1].v > 0) { // kek
									    containsData = true;
									    BrQC.GoogleChartsObjectList.push(returnObject.GoogleChartsObjectList[i]);
									    break;
							    }
					    }
					    if (containsData === false) {
							    outerLoop:
									    for (k in returnObject.GoogleChartsObjectList[i].data.rows) {
											    if (returnObject.GoogleChartsObjectList[i].data.rows[k].c) {
													    for (var m = 1, len = returnObject.GoogleChartsObjectList[i].data.rows[k].c.length; m < len; m = m + 2) {
															    if (returnObject.GoogleChartsObjectList[i].data.rows[k].c[m].v > "0.0") {
																	    containsData = true;
																	    BrQC.GoogleChartsObjectList.push(returnObject.GoogleChartsObjectList[i]);
																	    break outerLoop;
															    }
													    }
											    }
									    }
					    }
			    }
				//START NILESH-TSK21
			}
			//END NILESH-TSK21
			if (containsData === false && returnObject.CommentList.length > 0) {
                BrQC.ContainsOnlyComments = true;
                BrQC.ShowComments = true;
                var reportingSettings_CollapseComments = localStorage.getItem("ReportingSettings_CollapseComments");
                //console.log(reportingSettings_CollapseComments);
                if (reportingSettings_CollapseComments && JSON.parse(reportingSettings_CollapseComments) === "true") {
                    //console.log(reportingSettings_CollapseComments);
                    BrQC.Show = false;
                }
                setTimeout(function () {
                    repQInterface.RegisterCommentOnlyQuestion(BrQC.Question.QuestionID);
                    $scope.$apply();
                }, 1);
            }
            BrQC.CommentList = returnObject.CommentList;
            //console.log(BrQC);
            //console.log(JSON.stringify(BrQC));
        }

        function drawImage(chartWrapper) {
            repQInterface.RegisterImage(BrQC.Question.DisplayOrder, BrQC.Question.QuestionID, chartWrapper.visualization.getImageURI());
        }

        function renderSingleReport() {
            repQInterface.RenderSingleReport(BrQC.Question.QuestionID);
        }
    }
	//START NILESH-TSK21-4
    function GetBoxPlotData(arr)
    {
        var arrSorted = arr.sort(function(e1,e2){ return e1-e2 });
        console.log(arrSorted);
	
        var returnVallue = [];
	
        returnVallue.Q1 = arrSorted[0];
	
        var Q2Value = percentile(arrSorted,0.25);
        returnVallue.Q2 = Q2Value;
	
        var Q3Value = percentile(arrSorted,0.50);
        returnVallue.Q3 = Q3Value;
	
        var Q4Value = percentile(arrSorted,0.75);
        returnVallue.Q4 = Q4Value;
	
        returnVallue.Q5 = arrSorted[arrSorted.length-1];
	
        returnVallue.GetArray = function () {
            return [
                parseFloat(this.Q1) + "" == "NaN" ? 0 : this.Q1,
                this.Q2,
                this.Q3,
                this.Q4,
                parseFloat(this.Q5) + "" == "NaN" ? 0 : this.Q5
            ];
        }
        return returnVallue;
    }
	
	function percentile(arr, p) {
        if (arr.length === 0) return 0;
        if (typeof p !== 'number') throw new TypeError('p must be a number');
        if (p <= 0) return arr[0];
        if (p >= 1) return arr[arr.length - 1];

        arr.sort(function (a, b) { return a - b; });
        var index = (arr.length - 1) * p,
        lower = Math.floor(index),
        upper = lower + 1,
        weight = index % 1;

        if (upper >= arr.length) return arr[lower];
        return arr[lower] * (1 - weight) + arr[upper] * weight;
    }
	
		function GetJostenCalculatedUnitQuestionId()
		{
			//Question Id for Ty
			return "15561";
		}
		//END NILESH-TSK21-4
		
		//START NILESH-TSK31
    function GetAnswerIdForSumOfDuration_GoalSetting()
    {
        // Duration of Sessions/Discussion  - AnswerID
        return [39003,39676,39691,39692]; 
				//SELECT * FROM vts_tbAnswer WHERE QuestionId = 16403
		
    }
    function getQuestionIdForSumOfDuration_GoalSetting() {
        // Duration of Sessions/Discussion  - AnswerID
        return [16669, 16403, 16670, 16671];
    }
    //function GetSurveyIdForSumOfDuration_GoalSetting()
    //{
    //    //IDEXX - Customer Support Quality Goal Settings 
    //    return 2278; 
    //}
    //END NILESH-TSK31

    //START NILESH-TSK42
    function hideHistoryPercentQuestionId() {
        // Duration of Sessions/Discussion  - AnswerID
        //Jostens DataCollection Qids : Ty = 15561, Ly = 15562, +-Unit = 15563 ,AspTy = 15566, AspLy = 15567, AspCalcu. = 15568
        return [16669, 16403, 16670, 16671, 15561, 15562, 15563, 15566, 15567, 15568];
    }
    function hideDistributionQuestionId() {
        //Jostens DataCollection Qids : Ty = 15561, Ly = 15562, +-Unit = 15563 ,AspTy = 15566, AspLy = 15567, AspCalcu. = 15568
        return [15561, 15562, 15563, 15566, 15567, 15568];
    }

    function hideTotalPercentQuestionId() {
        // Duration of Sessions/Discussion  - AnswerID
        //Jostens DataCollection Qids : Ty = 15561, Ly = 15562, +-Unit = 15563 ,AspTy = 15566, AspLy = 15567, AspCalcu. = 15568
        return [16669, 16403, 16670, 16671, 15561, 15562, 15563, 15566, 15567, 15568];
    }
    //END NILESH-TSK42
})();