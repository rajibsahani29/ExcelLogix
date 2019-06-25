/// <reference path="C:\OneDrive\iAspire\www\trunk\www_iAspire\www_iAspire_App\Scripts/jspdf.debug.js" />

(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .directive("reportingquestion", reportingQuestion)
        .factory("ReportingQuestionConstants", reportingQuestionConstants)
        .factory("ReportingQuestionLogic", ["ReportingQuestionConstants", "ReportsControllerLogic", "ReportsConstants", reportingQuestionLogic])
        .factory("ReportingQuestionInterface", ["$q", "ReportsConstants", reportingQuestionInterface])
        .controller("AduReportingQuestionController", ["$scope", "ReportingQuestionLogic", "ReportingQuestionConstants", "ReportingQuestionInterface", reportingQuestionController]);

    function reportingQuestion() {
        return {
            restrict: "E",
            scope: {
                passedQuestion: "=question"
            },
            replace: true,
            templateUrl: 'app/views/AdureportingQuestionView.html',
            controller: "AduReportingQuestionController",
            controllerAs: "ErQC"
        };
    }

    function reportingQuestionConstants() {
        /*jshint validthis:true */
        var repQConstants = this;

        repQConstants.GetBaseGoogleChartsObject = getBaseGoogleChartsObject;

        repQConstants.DataFormatEnum = {
            "Totals": 0,
            "History": 1,
            "TotalsPercent": 2,
            "HistoryPercent": 3
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
    }

    function reportingQuestionLogic(repQConstants, repLogic, repConst) {
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
            return returnValue;
        }

        // totals - frequency
        function formatData_Totals(baseQuestion, chartType, dataFormat) {
            var dataFormatEnum = repQConstants.DataFormatEnum[dataFormat];
            var returnValue = {
                CommentList: [],
                GoogleChartsObjectList: []
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

            var booleanAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsBooleanAnswerType(e); }); // check boolean

            var booleanOtherAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsOtherAnswerType(e); }); // check for boolean-other

            var rangeAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsRangeAnswerType(e); }); // check range

            var dropDownAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsDropDownAnswerType(e); }); // check dropdown

            var commentAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsCommentAnswerType(e); }); // check comments

            var textEntryAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsTextboxAnswerType(e); }); // check for text box

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

            if (dropDownAnswers.length > 0) { // ignoring this for now
                getDataRows_DropDownAnswers(dropDownAnswers, dataFormatEnum);
            }

            // comments are completely separate, not going to do anything with google charts for these
            if (commentAnswers.length > 0) {
                returnValue.CommentList = getDataRows_Comments(commentAnswers);
            }

            //console.log(rQC.Question);
            //console.log(rQC.GoogleChartsObjectList);
            returnValue.GoogleChartsObjectList = [
                baseGoogleChartsObject,
                secondaryGCObject
            ];

            return returnValue;
        }

        // history - frequency
        function formatData_History(baseQuestion, chartType, dataFormat, timeInterval) {
            var dataFormatEnum = repQConstants.DataFormatEnum[dataFormat];
            var timeIntervalInt = repQConstants.TimeIntervalEnum[timeInterval];
            var returnValue = {
                CommentList: [],
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
                        baseGoogleChartsObject.data.rows[bb].c.splice(aa + 1, 0, makeTooltipForHistoryDataObject(baseGoogleChartsObject.data.rows[bb].c[aa].v, baseGoogleChartsObject.data.rows[bb].c[0].v, baseGoogleChartsObject.data.cols[aa].label, timeframeTotal, timeframeTotalResponseRate));
                    }
                }
            }

            //console.log(rQC.Question);
            returnValue.GoogleChartsObjectList = [
                baseGoogleChartsObject,
                secondaryGCObject
            ];

            return returnValue;
        }

        // totals  - percent
        function formatData_TotalsPercent(baseQuestion, chartType, dataFormat) {
            var dataFormatEnum = repQConstants.DataFormatEnum[dataFormat];
            var returnValue = {
                CommentList: [],
                GoogleChartsObjectList: []
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

            var booleanAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsBooleanAnswerType(e); }); // check boolean

            var booleanOtherAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsOtherAnswerType(e); }); // check for boolean-other

            var rangeAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsRangeAnswerType(e); }); // check range

            var dropDownAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsDropDownAnswerType(e); }); // check dropdown

            var commentAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsCommentAnswerType(e); }); // check comments

            var textEntryAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsTextboxAnswerType(e); }); // check for text box

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

            if (dropDownAnswers.length > 0) { // ignoring this for now
                getDataRows_DropDownAnswers(dropDownAnswers, dataFormatEnum);
            }

            // comments are completely separate, not going to do anything with google charts for these
            if (commentAnswers.length > 0) {
                returnValue.CommentList = getDataRows_Comments(commentAnswers);
            }

            //console.log(rQC.Question);
            //console.log(rQC.GoogleChartsObjectList);
            returnValue.GoogleChartsObjectList = [
                baseGoogleChartsObject,
                secondaryGCObject
            ];

            return returnValue;
        }

        // history - percent
        function formatData_HistoryPercent(baseQuestion, chartType, dataFormat, timeInterval) {
            var dataFormatEnum = repQConstants.DataFormatEnum[dataFormat];
            var timeIntervalInt = repQConstants.TimeIntervalEnum[timeInterval];
            var returnValue = {
                CommentList: [],
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
            for (var i = abstractTimeStartNumber; i <= abstractTimeEndNumber; i++) {
                rows.push({
                    "c": [
                        {
                            "id": i,
                            "v": moment(repConst.StartDate.year(), "YYYY")[momentFunc](i).format(textFormat)
                        }
                    ]
                });
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

            //console.log(rQC.Question);
            returnValue.GoogleChartsObjectList = [
                baseGoogleChartsObject,
                secondaryGCObject
            ];

            return returnValue;
        }

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
                    for (var q in responses) {
                        dataObject.push({
                            "c": [
                                { "v": responses[q].TextValue },
                                { "v": responses[q].Count }
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
            debugger
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

    function reportingQuestionController($scope, repCLogic, repQConstants, repQInterface) {

        var dataFormatEnum = {
            "Totals": 1,
            "History": 2
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
        var rQC = this;

        rQC.Question = $scope.passedQuestion;
        rQC.ChartType = "ColumnChart";

        switch (s1 | s2) {
            case dataFormatEnum.Totals | dataTypeEnum.Frequency:
                rQC.DataFormat = "Totals";
                break;
            case dataFormatEnum.Totals | dataTypeEnum.Percent:
                rQC.DataFormat = "TotalsPercent";
                break;
            case dataFormatEnum.History | dataTypeEnum.Frequency:
                rQC.DataFormat = "History";
                break;
            case dataFormatEnum.History | dataTypeEnum.Percent:
                rQC.DataFormat = "HistoryPercent";
                break;
            default:
                rQC.DataFormat = "Totals";
                break;
        }

        rQC.TimeInterval = null;
        rQC.TimeIntervals = [];
        rQC.CommentList = [];
        rQC.ShowComments = false;
        rQC.Show = true;
        rQC.GoogleChartsObjectList = [];
        rQC.ContainsOnlyComments = false;

        rQC.ChangeChartType = changeChartType;
        rQC.ChangeDataFormat = changeDataFormat;
        rQC.DisplayComments = displayComments;
        rQC.DrawImage = drawImage;
        rQC.RenderSingleReport = renderSingleReport;

        var timeInterval = localStorage.getItem("ReportingSettings_DateRangeType") || "Week";
        if (timeInterval && repQConstants.TimeIntervalEnum[timeInterval]) {
            rQC.TimeInterval = timeInterval;
        } else {
            rQC.TimeInterval = "Week";
        }

        for (var k in repQConstants.TimeIntervalEnum) {
            rQC.TimeIntervals.push({
                string: k,
                value: repQConstants.TimeIntervalEnum[k]
            });
        }
        //rQC.TimeInterval = "Month"; // month

        var chartTypeWatcherDestroyer = null;
        var dataFormatWatcherDestroyer = null;
        var timeIntervalWatcherDestroyer = null;
        setChartTypeWatcher();
        setDataFormatWatcher();
        setTimeIntervalWatcher();


        formatDataForCorrectReportType();

        return rQC;

        function setChartTypeWatcher() {
            chartTypeWatcherDestroyer = $scope.$watch("rQC.ChartType", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    rQC.CommentList = [];
                    rQC.GoogleChartsObjectList = [];
                    formatDataForCorrectReportType();
                }
            });
        }

        function setDataFormatWatcher() {
            dataFormatWatcherDestroyer = $scope.$watch("rQC.DataFormat", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    rQC.CommentList = [];
                    rQC.GoogleChartsObjectList = [];
                    formatDataForCorrectReportType();
                }
            });
        }

        function setTimeIntervalWatcher() {
            timeIntervalWatcherDestroyer = $scope.$watch("rQC.TimeInterval", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    rQC.CommentList = [];
                    rQC.GoogleChartsObjectList = [];
                    formatDataForCorrectReportType();
                }
            });
        }

        function changeDataFormat(newDataFormat) {
            chartTypeWatcherDestroyer(); // disable the chart type watcher for a moment
            if (newDataFormat === "History") {
                if (rQC.ChartType === "PieChart") {
                    rQC.ChartType = "ColumnChart";
                }
            } else if (newDataFormat === "Totals") {
                if (rQC.ChartType === "LineChart") {
                    rQC.ChartType = "ColumnChart";
                } else if (rQC.ChartType === "PieChart") {
                    rQC.ChartType = "ColumnChart";
                }
            }
            setChartTypeWatcher();

            if (newDataFormat === rQC.DataFormat) {
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
            rQC.DataFormat = newDataFormat;
        }

        function changeChartType(chartType) {
            if (repQConstants.ChartTypeEnum[chartType] > -1 && repQConstants.ChartTypeEnum[chartType] <= 3) {
                if (rQC.ChartType === chartType) {
                    if (rQC.ChartType === "PieChart") {
                        for (var i in rQC.GoogleChartsObjectList) {
                            //console.log(rQC.GoogleChartsObjectList[i]);
                            var minValue = 0;
                            var maxValue = 0;
                            var total = 0;
                            var slices = null;
                            if (!rQC.GoogleChartsObjectList[i].options.slices) {
                                slices = {};
                                for (var k in rQC.GoogleChartsObjectList[i].data.rows) {
                                    if (rQC.GoogleChartsObjectList[i].data.rows[k].c[1]) {
                                        var val = rQC.GoogleChartsObjectList[i].data.rows[k].c[1].v;
                                        total = total + val;
                                        if (val > maxValue) maxValue = val;
                                        if (val < minValue) minValue = val;
                                    }
                                }
                                if (total > 0) {
                                    for (var m in rQC.GoogleChartsObjectList[i].data.rows) {
                                        if (rQC.GoogleChartsObjectList[i].data.rows[m].c[1]) {
                                            var modVal = rQC.GoogleChartsObjectList[i].data.rows[m].c[1].v;
                                            slices[m] = { offset: 0.5 - (((modVal - minValue) / maxValue) * 0.5) };
                                        }
                                    }
                                }
                            }
                            rQC.GoogleChartsObjectList[i].options.slices = slices;
                        }
                    } else if (rQC.ChartType === "ColumnChart" && rQC.DataFormat !== "HistoryPercent") {
                        for (var aa in rQC.GoogleChartsObjectList) {
                            rQC.GoogleChartsObjectList[aa].options.isStacked = !rQC.GoogleChartsObjectList[aa].options.isStacked;
                        }
                    } else if (rQC.ChartType === "LineChart") {
                        for (var bb in rQC.GoogleChartsObjectList) {
                            var curveType = null;
                            if (!rQC.GoogleChartsObjectList[bb].options.curveType) {
                                curveType = "function";
                            }
                            rQC.GoogleChartsObjectList[bb].options.curveType = curveType;
                        }
                    }
                } else {
                    rQC.ChartType = chartType;
                }
            }
        }

        function displayComments(bit) {
            rQC.ShowComments = repCLogic.DisplayComments(bit);
        }

        function formatDataForCorrectReportType() {
            var returnObject = repCLogic.FormatDataForCorrectReportType(rQC.Question, rQC.ChartType, rQC.DataFormat, rQC.TimeInterval);
            //console.log(JSON.stringify(returnObject));
            //console.log(returnObject);
            var containsData = false;
            for (var i in returnObject.GoogleChartsObjectList) {
                for (var k in returnObject.GoogleChartsObjectList[i].data.rows) {
                    if (returnObject.GoogleChartsObjectList[i].data.rows[k].c[1] && returnObject.GoogleChartsObjectList[i].data.rows[k].c[1].v > 0) { // kek
                        containsData = true;
                        rQC.GoogleChartsObjectList.push(returnObject.GoogleChartsObjectList[i]);
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
                                        rQC.GoogleChartsObjectList.push(returnObject.GoogleChartsObjectList[i]);
                                        break outerLoop;
                                    }
                                }
                            }
                        }
                }
            }
            if (containsData === false && returnObject.CommentList.length > 0) {
                rQC.ContainsOnlyComments = true;
                rQC.ShowComments = true;
                var reportingSettings_CollapseComments = localStorage.getItem("ReportingSettings_CollapseComments");
                //console.log(reportingSettings_CollapseComments);
                if (reportingSettings_CollapseComments && JSON.parse(reportingSettings_CollapseComments) === "true") {
                    //console.log(reportingSettings_CollapseComments);
                    rQC.Show = false;
                }
                setTimeout(function () {
                    repQInterface.RegisterCommentOnlyQuestion(rQC.Question.QuestionID);
                    $scope.$apply();
                }, 1);
            }
            rQC.CommentList = returnObject.CommentList;
            //console.log(rQC);
            //console.log(JSON.stringify(rQC));
        }

        function drawImage(chartWrapper) {
            repQInterface.RegisterImage(rQC.Question.DisplayOrder, rQC.Question.QuestionID, chartWrapper.visualization.getImageURI());
        }

        function renderSingleReport() {
            repQInterface.RenderSingleReport(rQC.Question.QuestionID);
        }
    }

})();