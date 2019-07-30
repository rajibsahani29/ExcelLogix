(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .factory("ReportsConstants", reportsConstants)
        .factory("ReportsControllerLogic", ["ReportsConstants", reportsControllerLogic])
        .controller("ReportsController", ["DataService", "$scope", "$interval", "ProjectConstants", "ReportsConstants", "SMAAlertFactory", "ActiveFilterLogic", "ReportingQuestionInterface", "ReportsControllerLogic", reportsController]);

    function reportsConstants() {
        /*jshint validthis:true */
        var repConst = this;

        repConst.SurveyID = -1;
        repConst.SurveyTitle = "";
        repConst.ActiveSurvey = null;
        repConst.OriginalVotes = null;
        repConst.OriginalSurvey = null;
        repConst.OriginalFilters = null;
        repConst.AllVotes = [];
        repConst.StartDate = null;
        repConst.EndDate = null;
        repConst.FilteredVotesCount = -1;
        repConst.CurrentDateTimeAnswerID = -1;
        repConst.DistrictIDAnswerID = -1;
        repConst.SchoolIDAnswerID = -1;
        repConst.TeacherIDAnswerID = -1;
        repConst.SubjectIDAnswerID = -1;
        repConst.GradeIDAnswerID = -1;
        repConst.ObserverIDAnswerID = -1;
        repConst.ObservverNameAnswerID = -1;
        repConst.ActiveVoters = [];

        repConst.SetSurveyID = setsurveyID;
        repConst.SetSurveyTitle = setSurveyTitle;
        repConst.SetFilteredVotesCount = setFilteredVotesCount;
        repConst.SetActiveSurvey = setActiveSurvey;
        repConst.SetOriginalVotes = setOriginalVotes;
        repConst.SetOriginalSurvey = setOriginalSurvey;
        repConst.SetOriginalFilters = setOriginalFilters;
        repConst.SetAllVotes = setAllVotes;
        repConst.SetCurrentDateTimeAnswerID = setCurrentDateTimeAnswerID;
        repConst.SetDistrictIDAnswerID = setDistrictIDAnswerID;
        repConst.SetSchoolIDAnswerID = setSchoolIDAnswerID;
        repConst.SetTeacherIDAnswerID = setTeacherIDAnswerID;
        repConst.SetSubjectIDAnswerID = setSubjectIDAnswerID;
        repConst.SetGradeIDAnswerID = setGradeIDAnswerID;
        repConst.SetObserverIDAnswerID = setObserverIDAnswerID;
        repConst.SetObserverNameAnswerID = setObserverNameAnswerID;
        repConst.SetStartDate = setStartDate;
        repConst.SetEndDate = setEndDate;
        repConst.SetActiveVoters = setActiveVoters;
        repConst.SetSessionTypeID = setSessionTypeID;//M006
        repConst.SetDiscussionTypeID = setDiscussionTypeID;//M008
        return repConst;

        function setsurveyID(surveyID) {
            repConst.SurveyID = surveyID;
        }

        function setSurveyTitle(surveyTitle) {
            repConst.SurveyTitle = surveyTitle.split(":").join(""); // remove invalid windows character, there might be more to remove
        }

        function setFilteredVotesCount(filteredCount) {
            repConst.FilteredVotesCount = filteredCount;
        }

        function setActiveSurvey(survey) {
            repConst.ActiveSurvey = survey;
        }

        function setOriginalVotes(originalVotes) {
            repConst.OriginalVotes = angular.copy(originalVotes);
        }

        function setOriginalSurvey(originalSurvey) {
            repConst.OriginalSurvey = angular.copy(originalSurvey);
        }

        function setOriginalFilters(originalFilters) {
            repConst.OriginalFilters = angular.copy(originalFilters);
        }

        function setAllVotes(allVotes) {
            repConst.AllVotes = allVotes;
        }

        function setCurrentDateTimeAnswerID(cdtAnswerID) {
            repConst.CurrentDateTimeAnswerID = cdtAnswerID;
        }

        function setDistrictIDAnswerID(districtIDAnswerID) {
            repConst.DistrictIDAnswerID = districtIDAnswerID;
        }

        function setSchoolIDAnswerID(schoolIDAnswerID) {
            repConst.SchoolIDAnswerID = schoolIDAnswerID;
        }

        function setTeacherIDAnswerID(teacherIDAnswerID) {
            repConst.TeacherIDAnswerID = teacherIDAnswerID;
        }

        function setSubjectIDAnswerID(subjectIDAnswerID) {
            repConst.SubjectIDAnswerID = subjectIDAnswerID;
        }

        function setGradeIDAnswerID(gradeIDAnswerID) {
            repConst.GradeIDAnswerID = gradeIDAnswerID;
        }

        function setObserverIDAnswerID(observerIDAnswerID) {
            repConst.ObserverIDAnswerID = observerIDAnswerID;
        }

        function setObserverNameAnswerID(observerNameAnswerID) {
            repConst.ObserverNameAnswerID = observerNameAnswerID;
        }
        function setSessionTypeID(sessionTypeID) {//M006
            repConst.SessionTypeID = sessionTypeID;
        }
        function setDiscussionTypeID(discussionTypeID) {//M008
            repConst.DiscussionTypeID = discussionTypeID;
        }
        function setStartDate(startDate) {
            repConst.StartDate = startDate;
        }

        function setEndDate(endDate) {
            repConst.EndDate = endDate;
        }

        function setActiveVoters(voters) {
            repConst.ActiveVoters = voters;
        }
    }

    function reportsControllerLogic(repConst) {
        /*jshint validthis:true */
        var repLogic = this;

        var cachedVoterCountByDateRange = {};
        var cachedVoterCountByDateRangeByQuestionResponseRate = {};
        var cachedVoterAnswerValuesByAnswerID = {};

        repLogic.GetVoterAnswerValuesByAnswerID = getVoterAnswerValuesByAnswerID;
        repLogic.GetVoterCountByDateRange = getVoterCountByDateRange;
        repLogic.GetVoterCountByDateRangeIfQuestionWasAnswered = getVoterCountByDateRangeIfQuestionWasAnswered;
        repLogic.ClearCache = clearCache;

        return repLogic;

        function clearCache() {
            cachedVoterCountByDateRange = {};
            cachedVoterCountByDateRangeByQuestionResponseRate = {};
            cachedVoterAnswerValuesByAnswerID = {};
        }

        function getVoterAnswerToReturnObject(answerID, voterID, startDate) {
            return angular.copy({
                AnswerID: answerID,
                VoterID: voterID,
                StartDate: startDate,
                DateFromForm: null,
                VoterAnswerValue: null
            });
        }

        function getVoterAnswerValuesByAnswerID(answerID) {
            if (cachedVoterAnswerValuesByAnswerID[repConst.SurveyID] && cachedVoterAnswerValuesByAnswerID[repConst.SurveyID][answerID]) {
                return cachedVoterAnswerValuesByAnswerID[repConst.SurveyID][answerID];
            } else {
                var returnValue = [];
                for (var i in repConst.AllVotes) {
                    var voterAnswersToReturn = getVoterAnswerToReturnObject(answerID, repConst.AllVotes[i].VoterID, repConst.AllVotes[i].StartDate);
                    var voterAnswerValue = null;
                    var dateFromForm = null;
                    if (repConst.CurrentDateTimeAnswerID === -1) {
                        dateFromForm = -1;
                    }
                    var keys = Object.keys(repConst.AllVotes[i]);
                    for (var k in keys) {
                        if (!voterAnswerValue) {
                            if (keys[k].indexOf("_" + answerID) > -1) {
                                voterAnswerValue = repConst.AllVotes[i][keys[k]];
                            }
                        }
                        if (!dateFromForm) {
                            if (keys[k].indexOf("_" + repConst.CurrentDateTimeAnswerID) > -1) {
                                dateFromForm = repConst.AllVotes[i][keys[k]];
                            }
                        }
                        if (voterAnswerValue && dateFromForm) {
                            break;
                        }
                    }
                    if (voterAnswerValue && voterAnswerValue !== "") {
                        voterAnswersToReturn.VoterAnswerValue = voterAnswerValue;
                        voterAnswersToReturn.DateFromForm = dateFromForm;
                        returnValue.push(voterAnswersToReturn);
                    }
                }
                if (cachedVoterAnswerValuesByAnswerID[repConst.SurveyID] === undefined) {
                    cachedVoterAnswerValuesByAnswerID[repConst.SurveyID] = {};
                }
                cachedVoterAnswerValuesByAnswerID[repConst.SurveyID][answerID] = returnValue;
                return returnValue;
            }
        }

        function getVoterCountByDateRange(momentFunc, abstractTimeNumber) {
            if (cachedVoterCountByDateRange[repConst.SurveyID] && cachedVoterCountByDateRange[repConst.SurveyID][momentFunc] && cachedVoterCountByDateRange[repConst.SurveyID][momentFunc][abstractTimeNumber]) {
                return cachedVoterCountByDateRange[repConst.SurveyID][momentFunc][abstractTimeNumber];
            } else {

                var returnValue = 0;
                var startDate = moment(angular.copy(repConst.StartDate).year(), "YYYY");
                var endDate = moment(angular.copy(repConst.StartDate).year(), "YYYY");

                switch (momentFunc) {
                    case "dayOfYear":
                        startDate[momentFunc](abstractTimeNumber).startOf("day").subtract(1, "millisecond");
                        endDate[momentFunc](abstractTimeNumber).endOf("day").add(1, "millisecond");
                        break;
                    default:
                        ////startDate[momentFunc](abstractTimeNumber).startOf(momentFunc).subtract(1, "millisecond");
                        //startDate.startOf("day");
                        //startDate[momentFunc](abstractTimeNumber);
                        //startDate.subtract(1, "millisecond");
                        ////endDate[momentFunc](abstractTimeNumber).endOf(momentFunc).add(1, "millisecond");
                        //endDate.endOf("day");
                        //endDate[momentFunc](abstractTimeNumber);
                        //endDate.add(1, "millisecond");
                        //break;
                        //startDate[momentFunc](abstractTimeNumber).startOf(momentFunc).subtract(1, "millisecond");
                        startDate[momentFunc](abstractTimeNumber);
                        startDate.startOf(momentFunc);
                        startDate.subtract(1, "millisecond");
                        //endDate[momentFunc](abstractTimeNumber).endOf(momentFunc).add(1, "millisecond");
                        endDate[momentFunc](abstractTimeNumber);
                        endDate.endOf(momentFunc);
                        endDate.add(1, "millisecond");
                        break;
                }

                for (var i in repConst.AllVotes) {
                    var dateFromForm = null;
                    if (repConst.CurrentDateTimeAnswerID > -1) {
                        var keys = Object.keys(repConst.AllVotes[i]);
                        for (var k in keys) {
                            if (keys[k].indexOf("_" + repConst.CurrentDateTimeAnswerID) > -1) {
                                dateFromForm = moment(repConst.AllVotes[i][keys[k]], "MM-DD-YYYY");
                                break;
                            }
                        }
                    } else {
                        dateFromForm = moment(repConst.AllVotes[i].StartDate, "YYYY-MM-DDTHH:mm:ss");
                    }
                    //console.log([dateFromForm, startDate, endDate]);
                    if (dateFromForm.isBetween(startDate, endDate)) {
                        returnValue++;
                    }
                }
                //console.log("From Form: " + dateFromFormCount, "Invalid: " + dateFromFormInvalidCount);
                if (cachedVoterCountByDateRange[repConst.SurveyID] === void 0) {
                    cachedVoterCountByDateRange[repConst.SurveyID] = {};
                }
                if (cachedVoterCountByDateRange[repConst.SurveyID][momentFunc] === void 0) {
                    cachedVoterCountByDateRange[repConst.SurveyID][momentFunc] = {};
                }
                cachedVoterCountByDateRange[repConst.SurveyID][momentFunc][abstractTimeNumber] = returnValue;
                return returnValue;
            }
        }

        function getVoterCountByDateRangeIfQuestionWasAnswered(momentFunc, abstractTimeNumber, questionID) {
            if (cachedVoterCountByDateRangeByQuestionResponseRate[repConst.SurveyID] && cachedVoterCountByDateRangeByQuestionResponseRate[repConst.SurveyID][momentFunc] && cachedVoterCountByDateRangeByQuestionResponseRate[repConst.SurveyID][momentFunc][abstractTimeNumber]) {
                return cachedVoterCountByDateRangeByQuestionResponseRate[repConst.SurveyID][momentFunc][abstractTimeNumber];
            } else {
                var returnValue = 0;
                var startDate = moment(angular.copy(repConst.StartDate).year(), "YYYY");
                var endDate = moment(angular.copy(repConst.StartDate).year(), "YYYY");

                switch (momentFunc) {
                    case "dayOfYear":
                        startDate[momentFunc](abstractTimeNumber).startOf("day").subtract(1, "millisecond");
                        endDate[momentFunc](abstractTimeNumber).endOf("day").add(1, "millisecond");
                        break;
                    default:
                        //startDate[momentFunc](abstractTimeNumber).startOf(momentFunc).subtract(1, "millisecond");
                        startDate[momentFunc](abstractTimeNumber);
                        startDate.startOf(momentFunc);
                        startDate.subtract(1, "millisecond");
                        //endDate[momentFunc](abstractTimeNumber).endOf(momentFunc).add(1, "millisecond");
                        endDate[momentFunc](abstractTimeNumber);
                        endDate.endOf(momentFunc);
                        endDate.add(1, "millisecond");
                        break;
                }

                for (var i in repConst.AllVotes) { // for each voter
                    // figure out if the question was answered at all
                    var wasAnswered = false;
                    var keys2 = Object.keys(repConst.AllVotes[i]);
                    for (var m in keys2) { // find the correct question
                        if (keys2[m].indexOf(questionID + "_") === 0) {
                            if (repConst.AllVotes[i][keys2[m]] !== "") {
                                wasAnswered = true;
                                break;
                            }
                        }
                    }
                    if (wasAnswered === true) {
                        var dateFromForm = null;
                        if (repConst.CurrentDateTimeAnswerID > -1) {
                            var keys = Object.keys(repConst.AllVotes[i]);
                            for (var k in keys) {
                                if (keys[k].indexOf("_" + repConst.CurrentDateTimeAnswerID) > -1) {
                                    dateFromForm = moment(repConst.AllVotes[i][keys[k]], "MM-DD-YYYY");
                                    break;
                                }
                            }
                        } else {
                            dateFromForm = moment(repConst.AllVotes[i].StartDate, "YYYY-MM-DDTHH:mm:ss");
                        }
                        //console.log([dateFromForm, startDate, endDate]);
                        if (dateFromForm.isBetween(startDate, endDate)) {
                            returnValue++;
                        }
                    }
                }
                //console.log("From Form: " + dateFromFormCount, "Invalid: " + dateFromFormInvalidCount);
                if (cachedVoterCountByDateRangeByQuestionResponseRate[repConst.SurveyID] === undefined) {
                    cachedVoterCountByDateRangeByQuestionResponseRate[repConst.SurveyID] = {};
                }
                if (cachedVoterCountByDateRangeByQuestionResponseRate[repConst.SurveyID][momentFunc] === undefined) {
                    cachedVoterCountByDateRangeByQuestionResponseRate[repConst.SurveyID][momentFunc] = {};
                }
                cachedVoterCountByDateRangeByQuestionResponseRate[repConst.SurveyID][momentFunc][abstractTimeNumber] = returnValue;
                return returnValue;
            }
        }

    }

    function reportsController(DataService, $scope, $interval, ProjectConstants, repConst, SMAAlertFactory, ActiveFilterLogic, repQInterface, repLogic) {

        var startDate = null;
        var rC = this;
        rC.momentFormat = "YYYY-MM-DD";
        var ReportingSettings_DateRangeDate = localStorage.getItem("ReportingSettings_DateRangeDate");//M0029
        if (ReportingSettings_DateRangeDate) {//M0029                
            startDate = moment(ReportingSettings_DateRangeDate);//M0035
            setTimeout(function () { rC.StartDateString = startDate.format(rC.momentFormat); }, 500);
        } else {
            GetFromDateUserSettings();//M0035
        }
        //var endDate = moment().hour(23).minute(59).second(59).millisecond(0);
        var endDate = moment().endOf("day");
        //repConst.SetStartDate(startDate);
        repConst.SetEndDate(endDate);
        //console.log(startDate, endDate);

        $scope.AppC.ShowHeader = true;
        $scope.AppC.ShowFooter = true;
        $scope.AppC.ActivePageName = "Reports - Sample";

        /*jshint validthis:true */


        rC.AreReportsReady = ProjectConstants.App.AreReportsReady;

        rC.SurveyList = [];
        rC.SurveyID = -1;
        rC.SurveyTitle = null;
        //if (Modernizr.inputtypes["date"]) {
        //    rC.momentFormat = "YYYY-MM-DDTHH:mm:ss";
        //    rC.StartDateString = startDate.format(rC.momentFormat);
        //    rC.EndDateString = endDate.format(rC.momentFormat);
        //}
        //else {
        //    rC.momentFormat = "MM/DD/YYYY h:mm a";
        //    rC.StartDateString = startDate.format(rC.momentFormat);
        //    rC.EndDateString = endDate.format(rC.momentFormat);
        //}
        //rC.StartDateString = startDate.format(rC.momentFormat);

        setTimeout(function () { rC.EndDateString = endDate.format(rC.momentFormat); }, 500)
        console.log(rC.StartDateString);
        console.log(rC.EndDateString);
        rC.NeedNewDataObject = {}; // object becuase child controller REASONS
        rC.NeedNewDataObject.NeedNewData = false;
        //START NILESH-TSK28
        rC.NeedNewServerData = true;
        rC.oldStartDateString = "";
        rC.oldEndDateString = "";
        //END NILESH-TSK28
        rC.GetNewData = getNewData;
        rC.AddFilter = addFilter;
        //rC.RemoveFilter = removeFilter;

        rC.SurveysListIsLoading = false;
        rC.DownloadSpinner = false;
        rC.DownloadButtonDisabled = false;
        rC.DownloadCsvDownloadButtonText = "Download CSV";
        rC.DownloadPdfDownloadButtonText = "Download PDF";
        rC.ReportDataIsLoading = false;
        rC.ActiveSurvey = null;
        rC.FilterOptions = []; // pre-survey survey questions
        rC.ActiveFilters = [];
        rC.AllVotes = []; // the votes themselves
        rC.RemovedVotes = [];
        rC.QuestionGroups = []; // list of categories each with a list of questions each with a list of answers
        rC.ReportingQuestions = [];
        rC.HeaderDataTable = { // first row is the table columns, everything else will be rendered as data
            Headers: [],
            Rows: []
        };

        rC.RenderReport = renderReport;
        //START NILESH-TSK65
        rC.RenderCSV = renderCSV;
        //END NILESH-TSK65		
        var didLoadStart = false;

        if ($scope.AppC.IsTrialVersion === false && rC.AreReportsReady === true) {
            didLoadStart = true;
            rC.SurveysListIsLoading = true;
            $scope.AppC.ActivePageName = "Reports";
            getSurveyList();
        }

        // this seems to work with the interval -- this might be a problem for trial accounts
        var interval = $interval(function () {
            if (didLoadStart === false) {
                if ($scope.AppC.isUserAuthorized === true) {
                    didLoadStart = true;
                    if ($scope.AppC.IsTrialVersion === false && rC.AreReportsReady === true) {
                        rC.SurveysListIsLoading = true;
                        $scope.AppC.ActivePageName = "Reports";
                        getSurveyList();
                    }
                }
            } else {
                $interval.cancel(interval);
            }
        }, 500);

        $scope.$on("$destroy", function () {
            $interval.cancel(interval);
        });

        $scope.$watch("repC.StartDateString", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                //START NILESH-TSK-Report Filter Frequency Issue
                repLogic.ClearCache();
                //END NILESH-TSK

                rC.NeedNewDataObject.NeedNewData = true;
                SetFromDateUserSettings();//M0035
                //START NILESH-TSK28
                if (needDataFromServer()) {
                    rC.NeedNewServerData = true;
                }
                //END NILESH-TSK28
            }
        });

        $scope.$watch("repC.EndDateString", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                //START NILESH-TSK-Report Filter Frequency Issue
                repLogic.ClearCache();
                //END NILESH-TSK
                rC.NeedNewDataObject.NeedNewData = true;
                //START NILESH-TSK28
                if (needDataFromServer()) {
                    rC.NeedNewServerData = true;
                }
                //END NILESH-TSK28
            }
        });

        $scope.$watchCollection("repC.ActiveFilters", function (newValue, oldValue) {
            //console.log(newValue, oldValue);
            if (newValue && newValue.length !== oldValue.length) {
                rC.NeedNewDataObject.NeedNewData = true;
            }
        });

        $scope.$watch("repC.SurveyID", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                if (newValue !== -1) {
                    //START NILESH-TSK28
                    getSurveyData();
                    //END NILESH-TSK28
                }
            }
        });

        return rC;
        //START NILESH-TSK28
        function getSurveyData() {
            if (moment(rC.StartDateString, rC.momentFormat).isBefore(moment(rC.EndDateString, rC.momentFormat).endOf("day")) === true) {
                rC.NeedNewServerData = false;
                rC.NeedNewDataObject.NeedNewData = false;
                rC.ReportDataIsLoading = true;
                rC.ReportingQuestions = [];
                rC.FilterOptions = [];
                rC.ActiveFilters = [];
                rC.AllVotes = [];
                rC.RemovedVotes = [];
                rC.QuestionGroups = [];
                rC.HeaderDataTable.Headers = [];
                rC.HeaderDataTable.Rows = [];
                //START NILESH-TSK21-8
                rC.FooterDataTable = [];
                //END NILESH-TSK21-8
                repConst.SetActiveSurvey(null);
                repConst.SetAllVotes([]);
                repConst.SetSurveyID(rC.SurveyID);
                repConst.SetSurveyTitle(rC.SurveyList.filter(function (e) { if (e.SurveyID === rC.SurveyID) return true; return false; })[0].Title);
                repConst.SetStartDate(moment(rC.StartDateString, rC.momentFormat));
                repConst.SetEndDate(moment(rC.EndDateString, rC.momentFormat).endOf("day"));
                getReportData(rC.SurveyID, moment(rC.StartDateString, rC.momentFormat).format(), moment(rC.EndDateString, rC.momentFormat).endOf("day").format());
            }
            else {
                SMAAlertFactory.CreateInfoAlert("Alert", "Please enter a valid date range");
                rC.SurveyID = -1;
                repConst.SetSurveyID(-1);
                repConst.SetSurveyTitle("");
            }
        }
        //END NILESH-TSK28

        function getNewData() {
            $('#mnpspinner').fadeIn(100);
            //START NIELSH-TSK28
            if (rC.NeedNewServerData) {
                getSurveyData();
                return;
            }
            //END NIELSH-TSK28
            // verify we're ready for new data (all filtering options populated)
            var areFiltersValid = true;
            for (var i in rC.ActiveFilters) {
                if (!rC.ActiveFilters[i].FilterType || !rC.ActiveFilters[i].SelectedOption) {
                    areFiltersValid = false;
                    break;
                }
            }
            if (areFiltersValid === true) {
                setTimeout(function () {
                    repLogic.ClearCache(); // <= filtering changes the data we should have cached
                    repQInterface.PrepForNewSurvey(); // <= clears the cached report images and comment-only tables
                    rC.ReportingQuestions = [];
                    repConst.SetActiveSurvey(null);
                    repConst.SetAllVotes([]);
                    rC.ReportDataIsLoading = true;
                    rC.QuestionGroups = [];
                    rC.HeaderDataTable.Headers = [];
                    rC.HeaderDataTable.Rows = [];
                    repConst.SetStartDate(moment(rC.StartDateString, rC.momentFormat));
                    repConst.SetEndDate(moment(rC.EndDateString, rC.momentFormat));
                    rC.FilterOptions = angular.copy(repConst.OriginalFilters);
                    rC.AllVotes = angular.copy(repConst.OriginalVotes);
                    rC.ActiveSurvey = angular.copy(repConst.OriginalSurvey);
                    dataLoadedHandler(true, true, true);
                    rC.NeedNewDataObject.NeedNewData = false;
                    $scope.$apply();
                }, 100);
            } else {
                SMAAlertFactory.CreateInfoAlert("Alert", "Please enter valid criteria for filtering");
            }
            $('#mnpspinner').fadeOut(4000);
        }

        function getSurveyList() {
            // why am i adding a fake one? ... oh, maybe this was so it would say "select" instead of just being a blank dropdown
            rC.SurveyList.push( // add a fake empty one
                {
                    SurveyID: -1,
                    Title: "Select Form"
                });

            // START NILESH
            //var TEsurveysLoaded = false;
            //var SEsurveysLoaded = false;
            //  var arrSurveyTypeList = ["IBS-EmployeeEvaluationForms","IBS-SafetyForms","IBS-Coaching"];

            //START NILESH-TSK45            
            var merchantData = JSON.parse(localStorage.getItem("MerchantData"));
            //DataService.surveyTypeGetList(merchantData.MerchantID).then(function (res) {
            //    var arrSurveyTypeList = res.data;
                
            //});
            getSurveyByType(merchantData);
        }
        function getSurveyByType(merchantData) {
            var currentIndex = 0;
            DataService.CheckCustomPageRights("report")
                .success(function (data, status1, headers, config) {
                    if (status1 == 200) {
                        //END NILESH-TSK45
                        DataService.GetSureyListByFormType(merchantData.MerchantID)
                            .success(function (data, status, headers, config) {
                                data = data.filter(function (e) {
                                    return e.Archive == false;
                                })
                                function getSurveyCountFromList(surveyID, list) {
                                    return list.filter(function (e) {
                                        return e.SurveyID === surveyID;
                                    }).length;
                                }
                                for (var j in data) {
                                    if (getSurveyCountFromList(data[j].SurveyID, rC.SurveyList) === 0) rC.SurveyList.push(data[j]);
                                }
                                currentIndex++;
                                //if (currentIndex == arrSurveyTypeList.length) {
                                //    rC.SurveysListIsLoading = false;
                                //    //getSurveyCountFromList.sort();
                                //}
                            })
                            .error(function (data, status, headers, config) {
                                currentIndex++;
                                //if (currentIndex == arrSurveyTypeList.length) {
                                //    rC.SurveysListIsLoading = false;
                                //}
                            });
                        //START NILESH-TSK45
                    }
                })
                .error(function (data, status, headers, config) {
                    if (status === 403) {
                        SMAAlertFactory.CreateInfoAlert("Alert", "You do not have access to this page.", function () {
                            window.location.hash = "#/selection";
                        });
                    }
                });
        }

        function surveysLoaded(TEsurveysLoaded, SEsurveysLoaded) {
            if (TEsurveysLoaded === true && SEsurveysLoaded === true) {
                rC.SurveysListIsLoading = false;
            }
        }

        function getReportData(surveyID, startDate, endDate) {
            var gotVariables = false;
            var gotVotes = false;
            var gotSurvey = false;

            //START NILESH-TSK28
            rC.oldStartDateString = rC.StartDateString;
            rC.oldEndDateString = rC.EndDateString;
            //END NILESH-TSK28

            // get survey variables for filtering options
            DataService.getSurveyVariables(surveyID, 'REPORT')//M0014
                .success(function (data, status, headers, config) {
                    for (var i in data) {
                        rC.FilterOptions.push(data[i]);
                    }
                    repConst.SetOriginalFilters(angular.copy(rC.FilterOptions));
                    gotVariables = true;
                    dataLoadedHandler(gotVariables, gotVotes, gotSurvey);
                })
                .error(function (data, status, headers, config) {
                    //console.error(data, status, headers, config);
                    gotVariables = true;
                    dataLoadedHandler(gotVariables, gotVotes, gotSurvey);
                });

            // get the votes
            DataService.getVotesForSurveyBetweenRange(surveyID, startDate, endDate)
                .success(function (data, status, headers, config) {
                    // reformat votes before adding
                    data = fixVoterObjectFormat(data);
                    data = data.filter(function (e) {
                        return e.isActive == false;
                    })
                    rC.SurveyTitle = rC.SurveyList.filter(function (e) { return e.SurveyID == surveyID })[0].Title;
                    //console.table(data);
                    for (var i in data) {
                        rC.AllVotes.push(data[i]);
                    }
                    repConst.SetOriginalVotes(angular.copy(rC.AllVotes));
                    gotVotes = true;
                    dataLoadedHandler(gotVariables, gotVotes, gotSurvey);
                })
                .error(function (data, status, headers, config) {
                    //.error(data, status, headers, config);
                    gotVotes = true;
                    dataLoadedHandler(gotVariables, gotVotes, gotSurvey);
                });

            // get survey data
            DataService.getFullSurveyDetails(surveyID)
                .success(function (data, status, headers, config) {
                    rC.ActiveSurvey = data;
                    gotSurvey = true;
                    repConst.SetOriginalSurvey(angular.copy(rC.ActiveSurvey));
                    dataLoadedHandler(gotVariables, gotVotes, gotSurvey);
                })
                .error(function (data, status, headers, config) {
                    //console.error(data, status, headers, config);
                    gotSurvey = true;
                    dataLoadedHandler(gotVariables, gotVotes, gotSurvey);
                });
        }

        function fixVoterObjectFormat(voters) {
            // change the list of voterAnswers to be part of the voter object instead
            // example : instead of voter.VoterAnswers[x].Value, we would have voter[name] for the same thing
            //  with this data, [name] is "QuestionID_AnswerID"
            if (voters.length && voters.length > 0) {
                var newVoters = [];
                for (var i in voters) {
                    for (var k in voters[i].PivotAnswers) {
                        voters[i][voters[i].PivotAnswers[k].Name] = voters[i].PivotAnswers[k].Value;
                    }
                    voters[i].PivotAnswers = null;
                    newVoters.push(voters[i]);
                }
                //if (console.table) {
                //    console.table(newVoters);
                //} else {
                //    console.log(newVoters);
                //}
                return newVoters;
            }
            return [];
        }

        function dataLoadedHandler(variablesLoaded, votesLoaded, surveyLoaded) {
            function valueNotFound(list, value) {
                return (list.filter(function (e) { if (e.Value === value) return true; return false; }).length === 0);
            }
            if (variablesLoaded === true && votesLoaded === true && surveyLoaded === true) {
                formatDataForQuestionController();
                repConst.SetActiveSurvey(rC.ActiveSurvey);
                repConst.SetAllVotes(rC.AllVotes);
                var obsIDList = repLogic.GetVoterAnswerValuesByAnswerID(repConst.ObserverIDAnswerID);
                var obsNameList = repLogic.GetVoterAnswerValuesByAnswerID(repConst.ObserverNameAnswerID);
                var structuredList = [];
                for (var k in obsIDList) {
                    for (var i in obsNameList) {
                        if (obsIDList[k].VoterID === obsNameList[i].VoterID) {
                            //if (structuredList.filter(function (e) { if (e.Value === obsIDList[k].VoterAnswerValue) return true; return false; }).length === 0) {
                            if (valueNotFound(structuredList, obsIDList[k].VoterAnswerValue)) {
                                structuredList.push({
                                    Value: obsIDList[k].VoterAnswerValue,
                                    Name: obsNameList[i].VoterAnswerValue
                                });
                            }
                        }
                    }
                }
                var observerFilterOption = {
                    DisplayOrder: -1,
                    InputType: null,
                    IsRequired: true,
                    Options: structuredList,
                    PlaceholderVariableName: "iaspireusername",
                    RequestText: "Observer",
                    SurveyID: rC.SurveyID,
                    SurveyVariableTypeID: "00000000-0000-0000-0000-000000000000",
                    UpdateURL: null,
                    UsePlaceholderAsUniqueVoteName: false,
                    ValueVariableName: "iaspireuserid"
                };
                if (structuredList.length > 0) {
                    rC.FilterOptions.unshift(observerFilterOption);
                }
                rC.ReportDataIsLoading = false;
            }
        }

        function formatDataForQuestionController() {
            function getAnswersListByQuestionID(questionID, list) {
                return list.filter(function (e) {
                    return e.QuestionID === questionID;
                });
            }
            // create a list of questions based on the survey data
            var SurveyQuestions = [];
            var QuestionsForHeaderTable = [];
            // add the answers to the questions ... question.Answers = []
            for (var i in rC.ActiveSurvey.Questions) {
                //for (var i = rC.ActiveSurvey.Questions.length - 1; i > -1; i--)
                //{
                var answers = getAnswersListByQuestionID(rC.ActiveSurvey.Questions[i].QuestionID, rC.ActiveSurvey.Answers);
                //var answers = rC.ActiveSurvey.Answers.filter(function (e) {
                //    return e.QuestionID === rC.ActiveSurvey.Questions[i].QuestionID;
                //});
                if (answers.length > 0) {
                    SurveyQuestions.push(rC.ActiveSurvey.Questions[i]);
                    SurveyQuestions[SurveyQuestions.length - 1].Answers = answers;
                }
            }
            var nbspRemover = new RegExp(String.fromCharCode(160), "g");
            // loop through the questions
            // go backwards so that we can easily remove if we need to
            for (var j = SurveyQuestions.length - 1; j > -1; j--) {
                var cleanQuestionText = SurveyQuestions[j].QuestionText.replace(/(<[^>]*>)/g, '').replace(/((&lt;)(?:(?!&gt;).)*(&gt;))/g, '').replace(/(\r\n?|\n)/g, ' ').replace(nbspRemover, '').replace("&nbsp;", '');
                SurveyQuestions[j].CleanQuestionText = cleanQuestionText || "";
                // collect all VoterAnswers relevant to the given answers attached to the question
                //SurveyQuestions[i].VoterAnswerList = {};
                //for (var k in rC.AllVotes) {
                //    // get the keys for the given vote
                //    var keys = Object.keys(rC.AllVotes[k]);
                //    // loop through the keys and look for voterAnswers for the given question
                //    for (var m in keys) {
                //        if (keys[m].indexOf("" + SurveyQuestions[i].OldQuestionID + "_") > -1) {
                //            SurveyQuestions[i].VoterAnswerList["Voter" + rC.AllVotes[k].VoterID + "ID" + keys[m]] = rC.AllVotes[k][keys[m]];
                //        }
                //    }
                //}
                for (var k in SurveyQuestions[j].Answers) {
                    var cleanAnswerText = SurveyQuestions[j].Answers[k].AnswerText.replace(/(<[^>]*>)/g, '').replace(/((&lt;)(?:(?!&gt;).)*(&gt;))/g, '').replace(/(\r\n?|\n)/g, ' ').replace(nbspRemover, '').replace("&nbsp;", '');
                    cleanAnswerText = cleanAnswerText || "No Answer Text " + SurveyQuestions[j].Answers[k].AnswerID;
                    SurveyQuestions[j].Answers[k].CleanAnswerText = cleanAnswerText;
                }
                // check to see if the question is part of the top
                var isPartOfTopTable = false;
                for (var m in SurveyQuestions[j].Answers) {
                    if (isPSSQMatch(SurveyQuestions[j].Answers[m].DefaultText, SurveyQuestions[j].Answers[m].AnswerID) === true) {
                        isPartOfTopTable = true;
                    }
                }
                if (isPartOfTopTable === true) {
                    QuestionsForHeaderTable.push(SurveyQuestions[j]);
                    SurveyQuestions.splice(j, 1);
                }
            }
            var headers = []; // { HeaderText: '', DisplayOrder: 0, AnswerID: 0 }
            var rows = [];
            // handle the questions for the top section
            // first we need to build what headers are available
            for (var q in QuestionsForHeaderTable) {
                for (var y in QuestionsForHeaderTable[q].Answers) {
                    var defaultTextLowercase = "";
                    if (QuestionsForHeaderTable[q].Answers[y].DefaultText && QuestionsForHeaderTable[q].Answers[y].DefaultText !== "") {
                        defaultTextLowercase = QuestionsForHeaderTable[q].Answers[y].DefaultText.toLowerCase();
                    }
                    //var defaultTextLowercase = QuestionsForHeaderTable[q].Answers[y].DefaultText.toLowerCase();
                    // check if it's the observer column
                    if (defaultTextLowercase === "##iaspireusername##" && rC.SurveyTitle != "High Five a Teammate!") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 0,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the date column
                    if (defaultTextLowercase === "##currentdatetime##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 1,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the teacher column
                    if (defaultTextLowercase === "##teachername##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 2,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the employee column
                    if (defaultTextLowercase === "##employeename##" && rC.SurveyTitle == "High Five a Teammate!") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 2,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the district column
                    if (defaultTextLowercase === "##districtname##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 3,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the school column
                    if (defaultTextLowercase === "##schoolname##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 4,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the school column
                    if (defaultTextLowercase === "##sitename##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 5,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the grade column
                    if (defaultTextLowercase === "##gradename##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 6,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the class/subject column
                    if (defaultTextLowercase === "##classname##" || defaultTextLowercase === "##subjectname##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 7,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                }
            }

            // throw out votes that aren't in the right date range
            if (repConst.CurrentDateTimeAnswerID !== -1) {
                for (var z = rC.AllVotes.length - 1; z > -1; z--) {
                    var keys = Object.keys(rC.AllVotes[z]);
                    for (var t in keys) {
                        if (keys[t].indexOf("_" + repConst.CurrentDateTimeAnswerID) > -1) {
                            var voteMoment = moment(rC.AllVotes[z][keys[t]], "MM-DD-YYYY");
                            //console.log(voteMoment.year());
                            //console.log(repConst.StartDate)
                            //if (!voteMoment.isValid()) {

                            //}
                            if (!voteMoment.isValid()) {
                                voteMoment = moment(rC.AllVotes[z].StartDate, "YYYY-MM-DDTHH:mm:ss");
                            }
                            //if (voteMoment.isBefore(repConst.StartDate)) {
                            //    //console.log(voteMoment, repConst.StartDate);
                            //    rC.RemovedVotes.push(rC.AllVotes[z]);
                            //    rC.AllVotes.splice(z, 1);
                            //}
                            if (!voteMoment.isBetween(repConst.StartDate.subtract(1, "millisecond"), repConst.EndDate.add(1, "millisecond"))) {
                                rC.RemovedVotes.push(rC.AllVotes[z]);
                                rC.AllVotes.splice(z, 1);
                            }
                            break;
                        }
                    }
                }
            }

            var votesSurvived = ActiveFilterLogic.ApplyFiltersToVotes(rC.AllVotes, rC.ActiveFilters);
            if (votesSurvived && votesSurvived.length && votesSurvived.length > 0) {
                repConst.SetFilteredVotesCount(votesSurvived.length);
                for (var aa = rC.AllVotes.length - 1; aa > -1; aa--) {
                    var wasFound = false;
                    for (var bb in votesSurvived) {
                        if (votesSurvived[bb] === rC.AllVotes[aa].VoterID) {
                            wasFound = true;
                            break;
                        }
                    }
                    if (wasFound === false) {
                        rC.AllVotes.splice(aa, 1);
                    }
                }
            } else {
                rC.AllVotes = [];
            }

            headers.sort(sortQuestionsByDisplayOrder);
            QuestionsForHeaderTable.sort(sortQuestionsByDisplayOrder);

            for (var s = 0; s < rC.AllVotes.length; s++) {
                var row = [];
                for (var v = 0; v < headers.length; v++) {
                    var voteKeys = Object.keys(rC.AllVotes[s]);
                    for (var l in voteKeys) {
                        if (voteKeys[l].indexOf("_" + headers[v].AnswerID) > -1) {
                            row.push(rC.AllVotes[s][voteKeys[l]]);
                            break;
                        }
                    }
                }
                rows.push(row);
            }

            for (var ii = 0; ii < headers.length; ii++) {
                rC.HeaderDataTable.Headers.push(headers[ii].HeaderText);
            }
            for (var x = 0; x < rows.length; x++) {
                rC.HeaderDataTable.Rows.push(rows[x]);
            }

            SurveyQuestions.sort(sortQuestionsByDisplayOrder);

            //console.log(SurveyQuestions);

            //var questionIndex = 0;
            //var appendQuestionsInterval = $interval(function () {
            //    if (questionIndex !== SurveyQuestions.length - 1) {
            //        rC.ReportingQuestions.push(SurveyQuestions[questionIndex]);
            //        questionIndex++;
            //    } else {
            //        $interval.cancel(appendQuestionsInterval);
            //    }
            //}, 0);
            for (var o = 0; o < SurveyQuestions.length; o++) {
                rC.ReportingQuestions.push(SurveyQuestions[o]);
            }
            //rC.ReportingQuestions = SurveyQuestions;
        }

        function sortQuestionsByDisplayOrder(question1, question2) {
            return question1.DisplayOrder - question2.DisplayOrder;
        }


        function isPSSQMatch(defaultText, answerID) {
            if (defaultText && defaultText !== "") {
                switch (defaultText.toLowerCase()) {
                    case "##districtid##":
                        repConst.SetDistrictIDAnswerID(answerID);
                        return true;
                    case "##schoolid##":
                        repConst.SetSchoolIDAnswerID(answerID);
                        return true;
                    case "##teacherid##":
                        repConst.SetTeacherIDAnswerID(answerID);
                        return true;
                    case "##gradeid##":
                        repConst.SetGradeIDAnswerID(answerID);
                        return true;
                    case "##classid##":
                    case "##subjectid##":
                        repConst.SetSubjectIDAnswerID(answerID);
                        return true;
                    case "##currentdatetime##":
                        repConst.SetCurrentDateTimeAnswerID(answerID);
                        return true;
                    case "##iaspireuserid##":
                        repConst.SetObserverIDAnswerID(answerID);
                        return true;
                    case "##iaspireusername##":
                        repConst.SetObserverNameAnswerID(answerID);
                        return true;
                    case "##typeofsession##"://M006
                        repConst.SetSessionTypeID(answerID);
                        return false;
                    case "##typeofdiscussion##":
                        repConst.SetDiscussionTypeID(answerID);
                        return false;//M008
                    case "##currenttime##":
                    case "##districtname##":
                    case "##schoolname##":
                    case "##teachername##":
                    case "##gradename##":
                    case "##classname##":
                    case "##subjectname##":
                    case "##sitename##":
                        return true;
                    default:
                        return false;
                }
            }
            return false;
        }

        function getActiveFilterObject(filterOption) {
            var answerID = -1;
            if (filterOption.ValueVariableName === "districtid") {
                answerID = repConst.DistrictIDAnswerID;
            } else if (filterOption.ValueVariableName === "schoolid") {
                answerID = repConst.SchoolIDAnswerID;
            } else if (filterOption.ValueVariableName === "teacherid") {
                answerID = repConst.TeacherIDAnswerID;
            } else if (filterOption.ValueVariableName === "classid" || filterOption.ValueVariableName === "subjectid") {
                answerID = repConst.SubjectIDAnswerID;
            } else if (filterOption.ValueVariableName === "gradeid") {
                answerID = repConst.GradeIDAnswerID;
            } else if (filterOption.ValueVariableName === "iaspireuserid") {
                answerID = repConst.ObserverIDAnswerID;
            }
            else if (filterOption.ValueVariableName === "typeofsession") {//M006 //M0014
                answerID = repConst.SessionTypeID;
            }
            else if (filterOption.ValueVariableName === "typeofdiscussion") {//M008 M0014
                answerID = repConst.DiscussionTypeID;
            }
            var result = angular.copy(filterOption);
            result.AnswerID = answerID;
            return result;
        }

        function addFilter(filterOption) {
            rC.ActiveFilters.push(getActiveFilterObject(filterOption));
        }

        function renderReport() {
            repQInterface.RenderReport();
        }


        //START NILESH-TSK65
        function renderCSV() {
            //G00088
            if (rC.HeaderDataTable.Rows.length > 0) {
                rC.DownloadSpinner = true;
                rC.DownloadButtonDisabled = true;
                rC.DownloadCsvDownloadButtonText = "Downloading CSV";
                var objSurveyVariables = [];
                $.each(rC.ActiveFilters, function (index, value) {
                    objSurveyVariables.push({
                        FilterType: value.FilterType,
                        ValueVariableName: value.ValueVariableName,
                        SelectedOption: value.SelectedOption
                    });
                });
                var CsvExportFilter = {
                    surveyID: rC.SurveyID,
                    startDate: moment(rC.StartDateString, rC.momentFormat).format(),
                    endDate: moment(rC.EndDateString, rC.momentFormat).format(),
                    ListCsvExportSurveyVariable: objSurveyVariables
                };

                //DataService.GetReportCSVData(rC.SurveyID, moment(rC.StartDateString, rC.momentFormat).format(), moment(rC.EndDateString, rC.momentFormat).format())
                DataService.GetReportCSVData(CsvExportFilter)
                    .success(function (data, status1, headers, config) {

                        var a = document.createElement("a");
                        var blob = new Blob([data], { type: "octet/stream" }),
                            url = window.URL.createObjectURL(blob);


                        if (typeof Windows !== 'undefined') {
                            writeBlobToFile(blob);
                        } else {
                            a.href = url;
                            a.download = "dataexport.csv";
                            a.click();
                        }
                        window.URL.revokeObjectURL(url);
                        rC.DownloadSpinner = false;
                        rC.DownloadButtonDisabled = false;
                        rC.DownloadCsvDownloadButtonText = "Download CSV";
                        //console.log(data);
                    })
                    .error(function (data, status, headers, config) {
                        rC.DownloadSpinner = false;
                        rC.DownloadButtonDisabled = false;
                        rC.DownloadCsvDownloadButtonText = "Download CSV";
                        if (status === 403) {
                            SMAAlertFactory.CreateInfoAlert("Alert", "You do not have access to this page.", function () {
                                window.location.hash = "#/selection";
                            });
                        }
                    });
            }
        }
        //END NILESH-TSK65

        //For Windows Download
        function writeBlobToFile(blob) {
            var filename = "dataexport.csv";
            // Open the picker to create a file to save the blob
            Windows.Storage.DownloadsFolder.createFileAsync(filename, Windows.Storage.CreationCollisionOption.generateUniqueName).then(function (file) {
                // Open the returned file in order to copy the data
                file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {

                    // Get the IInputStream stream from the blob object
                    var input = blob.msDetachStream();

                    // Copy the stream from the blob to the File stream
                    Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                        output.flushAsync().done(function () {
                            input.close();
                            output.close();
                            var dialog = new Windows.UI.Popups.MessageDialog("File '" + file.name + "' saved successfully to the Downloads folder!");
                            dialog.showAsync();
                            //WinJS.log && WinJS.log("File '" + file.name + "' saved successfully to the Pictures Library!", "sample", "status");
                        });
                    });
                });
            });
        }

        //START NILESH-TSK28
        function needDataFromServer() {
            var oldStartDate = moment(rC.oldStartDateString, rC.momentFormat).subtract(1, "millisecond");
            var oldEndDate = moment(rC.oldEndDateString, rC.momentFormat).add(1, "millisecond");

            var newStartDate = moment(rC.StartDateString, rC.momentFormat);
            var newEndDate = moment(rC.EndDateString, rC.momentFormat);

            if (newStartDate.isBetween(oldStartDate, oldEndDate) && newEndDate.isBetween(oldStartDate, oldEndDate)) {
                return false;
            }
            return true;
        }

        //END NILESH-TSK28
        //M0035 Start
        function GetFromDateUserSettings() {
            var userid = null;
            if ($scope.AppC.ActiveUser != null) {
                userid = $scope.AppC.ActiveUser.UserID;
                localStorage.setItem("userID", userid);
            }
            else {
                userid = localStorage.getItem("userID")
            }

            DataService.GetUserSettings(userid).success(function (data) {
                if (data != null && data.UserID > 0) {
                    rC.StartDateString = moment(data.FromDate).format('YYYY-MM-DD');
                    localStorage.setItem("ReportingSettings_DateRangeDate", JSON.stringify(rC.StartDateString).replace(/"/g, ""));
                }
                else {
                    rC.StartDateString = moment().endOf('day').format('YYYY-MM-DD');
                    localStorage.setItem("ReportingSettings_DateRangeDate", JSON.stringify(rC.StartDateString).replace(/"/g, ""));
                }
            }).error(function (err) {

            })
        }

        function SetFromDateUserSettings() {
            var objSurveyUserSettings = {
                UserID: $scope.AppC.ActiveUser.UserID,
                MerchantID: $scope.AppC.Merchant.MerchantID,
                FromDate: rC.StartDateString
            }
            DataService.SetUserSettings(objSurveyUserSettings).success(function (response) {
                var v = response;
            }).error(function (err) {
            })
        }
        //M0035 End
    }

})();