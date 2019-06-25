(function () {

    "use strict";

    angular
        .module("iAspireApp")
         //START NILESH-TSK48
        .factory("StaticReportValues", [staticReportValues])
        //END NILESH-TSK48
        .factory("ReportsConstants", reportsConstants)
        .factory("ReportsControllerLogic", ["ReportsConstants", reportsControllerLogic])
        .controller("BusinessReportController", ["DataService", "$scope", "$rootScope", "$interval", "ProjectConstants", "ReportsConstants", "SMAAlertFactory", "ActiveFilterLogic", "ReportingQuestionInterface", "ReportsControllerLogic", "StaticReportValues", "$filter", reportsController]);

    //M0029                        08/03/2018           Gimesh        Added Default From Date on Settings form.
	//M0035                        28/03/2018           Gimesh       Remove Last week.. And days 9 from Settings Add "From Date" from database level
    //START NILESH-TSK48
    function staticReportValues() {
        var staticVal = this;
        SetSurveyInformation();
        return staticVal;

        function SetSurveyInformation() {
            staticVal.JostenDataCollection = {
                SurveyId: 2296,
            }
        }
    }
    //END NILESH-TSK48
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
        repConst.SetSessionTypeID = setSessionTypeID;//M006
        repConst.SetDiscussionTypeID = setDiscussionTypeID;//M008
        repConst.SetStartDate = setStartDate;
        repConst.SetEndDate = setEndDate;
        repConst.SetActiveVoters = setActiveVoters;

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
		//START NILESH-TSK21-4
        var cachedVoterBoxPlotData = {};
        //END NILESH-TSK21-4
        $('#klo').hide();
		
        repLogic.GetVoterAnswerValuesByAnswerID = getVoterAnswerValuesByAnswerID;
		//START NILESH-TSK21-4
        repLogic.GetVoterAnswerValuesForJostenByAnswerId = getVoterAnswerValuesForJostenByAnswerId
        //END NILESH-TSK21-4
        repLogic.GetVoterCountByDateRange = getVoterCountByDateRange;
        repLogic.GetVoterCountByDateRangeIfQuestionWasAnswered = getVoterCountByDateRangeIfQuestionWasAnswered;
        repLogic.ClearCache = clearCache;

        return repLogic;

        function clearCache() {
            cachedVoterCountByDateRange = {};
            cachedVoterCountByDateRangeByQuestionResponseRate = {};
            cachedVoterAnswerValuesByAnswerID = {};
			//START NILESH-TSK21-4
            cachedVoterBoxPlotData = {};
            //END NILESH-TSK21-4
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

		 //START NILESH-TSK21-4
        function getVoterAnswerValuesForJostenByAnswerId(questionID, answerID)
        {
            if (cachedVoterBoxPlotData[repConst.SurveyID] && cachedVoterBoxPlotData[repConst.SurveyID][answerID]) {
                return cachedVoterBoxPlotData[repConst.SurveyID][answerID];
            } else {
                var returnValue = [];
                for (var i in repConst.AllVotes) {
                    var voterAnswerValue = null;
                    var voterSubAnswerValue = null;
                    var dateFromForm = null;
                    if (repConst.CurrentDateTimeAnswerID === -1) {
                        dateFromForm = -1;
                    }
                    var keys = Object.keys(repConst.AllVotes[i]);
                    for (var k in keys) {
                        if (!voterAnswerValue) {
                            if (keys[k].indexOf("_" + answerID) > -1) {
                                voterAnswerValue = repConst.AllVotes[i][keys[k]];
                                var voterAnswerKey = keys.filter(function (e) { return e.indexOf(questionID + "_") > -1; });
                                if (voterAnswerValue != "" && voterAnswerKey[0] && repConst.AllVotes[i][voterAnswerKey[0]] !== "") {
                                    voterSubAnswerValue = repConst.AllVotes[i][voterAnswerKey[0]];
                                }
                                //if (voterAnswerValue != "" && voterAnswerKey[0]) {
                                //    voterSubAnswerValue = repConst.AllVotes[i][voterAnswerKey[0]] == "" ? "0" : repConst.AllVotes[i][voterAnswerKey[0]];
                                //}

                            }
                        }
                        if (!dateFromForm) {
                            if (keys[k].indexOf("_" + repConst.CurrentDateTimeAnswerID) > -1) {
                                dateFromForm = repConst.AllVotes[i][keys[k]];
                            }
                        }
                        if (voterAnswerValue && dateFromForm && voterSubAnswerValue) {
                            break;
                        }
                    }
                    if (voterSubAnswerValue && voterSubAnswerValue !== "") {
                        var voterAnswersToReturn = getVoterAnswerToReturnObject(answerID, repConst.AllVotes[i].VoterID, repConst.AllVotes[i].StartDate);
                        voterAnswersToReturn.VoterAnswerValue = voterAnswerValue;
                        voterAnswersToReturn.VoterSubAnswerValue = voterSubAnswerValue;
                        voterAnswersToReturn.DateFromForm = dateFromForm;
                        returnValue.push(voterAnswersToReturn);
                    }
                }

                //console.log(returnValue);
                if (cachedVoterBoxPlotData[repConst.SurveyID] === undefined) {
                    cachedVoterBoxPlotData[repConst.SurveyID] = {};
                }
                cachedVoterBoxPlotData[repConst.SurveyID][answerID] = returnValue;
                return returnValue;
            }
        }
        //END NILESH-TSK21-4

		
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

    function reportsController(DataService, $scope, $rootScope, $interval, ProjectConstants, repConst, SMAAlertFactory, ActiveFilterLogic, repQInterface, repLogic, StaticReportValues, $filter) {
        //START NILESH-TSK21-3
        if ($scope.AppC.ActiveUser)
            $scope.IsPremiumUser = $scope.AppC.ActiveUser.IsPremium;
        else
            $scope.IsPremiumUser = false;
        //START NILESH-TSK21-3

		 //START NILESH-TSK21-6
        $scope.RUValue = 0;
        //END NILESH-TSK21-6
		var rC = this; //M0035
		rC.momentFormat = "YYYY-MM-DD";
		
		rC.SurveyTitle = null;
        var startDate = null;
        var endDate = null;//M0029
        var ReportingSettings_DateRangeDate = localStorage.getItem("ReportingSettings_DateRangeDate");//M0029
		endDate = moment().endOf("day");
         if (ReportingSettings_DateRangeDate) {//M0029                
            startDate = moment(ReportingSettings_DateRangeDate);//M0035
            rC.StartDateString = startDate.format(rC.momentFormat);
        } else {
            //startDate = moment().subtract(9, "week").hour(0).minute(0).second(0).millisecond(0);   
            GetFromDateUserSettings();//M0035
        }

       // repConst.SetStartDate(startDate);
        repConst.SetEndDate(endDate);
        //console.log(startDate, endDate);

        $scope.AppC.ShowHeader = true;
        $scope.AppC.ShowFooter = true;
        $scope.AppC.ActivePageName = "Reports - Sample";

        /*jshint validthis:true */
		//START NIELSH-TSK21-9
        rC.HCQuestionGroupChart = null;
        //END NIELSH-TSK21-9
        
		
        rC.AreReportsReady = ProjectConstants.App.AreReportsReady;

        rC.SurveyList = [];
        rC.SurveyID = -1;
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
        //rC.StartDateString = startDate.format(rC.momentFormat);M0035
        rC.EndDateString = endDate.format(rC.momentFormat);
				//START NILESH-TSK33
        rC.TmpStartDateString = startDate;
        rC.TmpEndDateString = endDate;
        //END NILESH-TSK33
        
        //console.log(rC.StartDateString);
        //console.log(rC.EndDateString);
        rC.NeedNewDataObject = {}; // object becuase child controller REASONS
        rC.NeedNewDataObject.NeedNewData = false;
        //START NILESH-TSK28
        rC.NeedNewServerData = true;
        rC.oldStartDateString = "";
        rC.oldEndDateString = "";
        //END NILESH-TSK28
        rC.GetNewData = getNewData;
        rC.AddFilter = addFilter;
        //START NILESH-TSK21-3
        rC.RemoveVoterFilter = removeVoterFilter;
        //START NILESH-TSK21-3
        //rC.RemoveFilter = removeFilter;
        //rC.showspinner = true;m007
        rC.SurveysListIsLoading = false;
        rC.ReportDataIsLoading = false;
        rC.ActiveSurvey = null;
        rC.FilterOptions = []; // pre-survey survey questions
        rC.ActiveFilters = [];
        //START NILESH-TSK21-3
        rC.FilteredVoters = [];
        //END NILESH-TSK21-3
        rC.AllVotes = []; // the votes themselves
        rC.RemovedVotes = [];
        rC.QuestionGroups = []; // list of categories each with a list of questions each with a list of answers
        rC.ReportingQuestions = [];
        rC.HeaderDataTable = { // first row is the table columns, everything else will be rendered as data
            Headers: [],
            Rows: []
        };
		//START NILESH-TSK21-8
        rC.FooterTableData = [];
        //END NILESH-TSK21-8
		
        rC.RenderReport = renderReport;
		
		//START NILESH-TSK65
        rC.RenderCSV = renderCSV;
        //END NILESH-TSK65		
		
		
       	//MP
        $scope.AppC.IsTrialVersion = false;
		
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
						//START NILESH-TSK33
            $(".bootstrap-datetimepicker-widget").remove();
            //END NILESH-TSK33
        });
				
				//START NILESH-TSK33
        $scope.$watch("repC.TmpStartDateString", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                rC.StartDateString = moment(newValue).format(rC.momentFormat);
            }
        });
        $scope.$watch("repC.TmpEndDateString", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                rC.EndDateString = moment(newValue).format(rC.momentFormat);
            }
        });
        //END NILESH-TSK33
        
        $scope.$watch("repC.StartDateString", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                //START NILESH-TSK-Report Filter Frequency Issue
                repLogic.ClearCache();
                //END NILESH-TSK
                rC.NeedNewDataObject.NeedNewData = true;
                SetFromDateUserSettings();
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
            // verify we're ready for new data (all filtering options populated)
            $('#mnpspinner').fadeIn(100);
            //START NIELSH-TSK28
            if (rC.NeedNewServerData) {
                getSurveyData();
                return;
            }
            //END NIELSH-TSK28
            var areFiltersValid = true;
            for (var i in rC.ActiveFilters) {
                //START NILESH-TSK21-7
                if (rC.ActiveFilters[i].CustomFilter.id == 1) {
                    if (!rC.ActiveFilters[i].CustomFilter.FilterType || !rC.ActiveFilters[i].CustomFilter.FilterValue) {
                        areFiltersValid = false;
                        break;
                    }
                }
                else {
                    //END NILESH-TSK21-7
                    if (!rC.ActiveFilters[i].FilterType || !rC.ActiveFilters[i].SelectedOption) {
                        areFiltersValid = false;
                        break;
                    }
                    //START NILESH-TSK21-7
                }
                //END NILESH-TSK21-7
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
                    //START NILESH-TSK21-8
                    rC.FooterDataTable = [];
                    //END NILESH-TSK21-8
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
            DataService.surveyTypeGetList(merchantData.MerchantID).then(function (res) {
                var arrSurveyTypeList = res.data;
                getSurveyByType(arrSurveyTypeList);
            })
        }
		
		function getSurveyByType(arrSurveyTypeList) {
            var currentIndex = 0;
            DataService.CheckCustomPageRights("report")
                .success(function (data, status1, headers, config) {
                    if (status1 == 200) {
                        //END NILESH-TSK45
                        for (var i = 0; i < arrSurveyTypeList.length; i++) {
                            DataService.getSurveyListByListName(arrSurveyTypeList[i].SurveyTypeID)
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
                                    if (currentIndex == arrSurveyTypeList.length) {
                                        rC.SurveysListIsLoading = false;
                                        //getSurveyCountFromList.sort();
                                    }
                                })
                                .error(function (data, status, headers, config) {
                                    currentIndex++;
                                    if (currentIndex == arrSurveyTypeList.length) {
                                        rC.SurveysListIsLoading = false;
                                    }
                                });
                        }
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

        // START NILESH
				//function surveysLoaded(TEsurveysLoaded, SEsurveysLoaded) {
        //    if (TEsurveysLoaded === true && SEsurveysLoaded === true) {
        //        rC.SurveysListIsLoading = false;
        //    }
        //}
				// END NILESH

        function getReportData(surveyID, startDate, endDate) {
            var gotVariables = false;
            var gotVotes = false;
            var gotSurvey = false;

            //START NILESH-TSK28
            rC.oldStartDateString = rC.StartDateString;
            rC.oldEndDateString = rC.EndDateString;
            //END NILESH-TSK28
            // get survey variables for filtering options
            DataService.getSurveyVariables(surveyID,'REPORT')//M0014
            .success(function (data, status, headers, config) {
                for (var i in data) {
					//START NILESH-TSK21-7
                    data[i].CustomFilter = { id: 0 }
                    //END NILESH-TSK21-7
                    rC.FilterOptions.push(data[i]);
                }
				//START NILESH-TSK21-7
                if ($scope.IsPremiumUser)
                {
                    var CustomFilterID = getCustomFilterID(surveyID);
                    if (CustomFilterID == 1)
                    {
                        rC.FilterOptions.push({
                            "SurveyID": surveyID,
                            "DisplayOrder": data.length,
                            "RequestText": "RUV",
                            "ValueVariableName": "+-lyty",
                            "PlaceholderVariableName": "RUV",
                            "InputType": null,
                            "UpdateURL": null,
                            "IsRequired": false,
                            "UsePlaceholderAsUniqueVoteName": false,
                            "Options": [],
                            "SurveyVariableTypeID": "00000000-0000-0000-0000-000000000000",
                            "CustomFilter": { id: CustomFilterID}
                        });
                    }
                }
				//END NILESH-TSK21-7
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
	    //START NILESH-TSK21-7
            function getCustomFilterID(surveyid) {
                return surveyid == 2296 ? 1 : 0;
            }
            //END NILESH-TSK21-7
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
                    CustomFilter : { id: 0 },
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
                    //START NILESH-TSK48
                    if (rC.SurveyID == StaticReportValues.JostenDataCollection.SurveyId) {
                        observerFilterOption.RequestText = "Sales Rep";
                    }
                    //END NILESH-TSK48
                    rC.FilterOptions.unshift(observerFilterOption);
                }
                //START NILESH-TSK48
                if (rC.SurveyID == StaticReportValues.JostenDataCollection.SurveyId) {
                    var items = $filter('filter')(rC.FilterOptions, { 'PlaceholderVariableName': 'employeename' });
                    for (var i = 0; i < items.length; i++) {
                        var index = rC.FilterOptions.indexOf(items[i]);
                        rC.FilterOptions.splice(index, 1);
                    }
                }
                //END NILESH-TSK48
				//START NILESH-TSK21-8
                if ($scope.IsPremiumUser == true) {
                    rC.FooterTableData = [];
                    for (var k in rC.ReportingQuestions) {
                        var objRow = getFooterTableData(rC.ReportingQuestions[k]);
                        if (objRow.answer != "" && objRow.median != 0) {
                            rC.FooterTableData.push(objRow);
                        }
                    }
                    //END NILESH-TSK21-8

                    //START NILESH-TSK21-9
                    var objGroupChartData = {
                        Demographics: [],
                        Meeting: [],
                        Marketing: []
                    }
                    var DemographicsQueIds = [15523, 15524];
                    var MeetingQueIds = [15526, 15527, 15528, 15529, 15530, 15531, 15532, 15533, 15534, 15535, 15536, 15537, 15538, 15539, 15540, 15541];
                    var MarketingQueIds = [15543, 15544, 15545, 15546, 15547, 15549, 15550, 15551, 15553, 15554, 15555, 15556, 15557, 15558];

                    var FinalValDemographics = 0, FinalValMeeting = 0, FinalValMarketing = 0;

                    for (var z in rC.FooterTableData) {
                        if (DemographicsQueIds.indexOf(rC.FooterTableData[z].questionid) > -1) {
                            objGroupChartData.Demographics.push(rC.FooterTableData[z].meanOfMedian);
                            FinalValDemographics += rC.FooterTableData[z].meanOfMedian;
                        }
                        if (MeetingQueIds.indexOf(rC.FooterTableData[z].questionid) > -1) {
                            objGroupChartData.Meeting.push(rC.FooterTableData[z].meanOfMedian);
                            FinalValMeeting += rC.FooterTableData[z].meanOfMedian;
                        }
                        if (MarketingQueIds.indexOf(rC.FooterTableData[z].questionid) > -1) {
                            objGroupChartData.Marketing.push(rC.FooterTableData[z].meanOfMedian);
                            FinalValMarketing += rC.FooterTableData[z].meanOfMedian;
                        }
                    }

                    FinalValDemographics = (FinalValDemographics / objGroupChartData.Demographics.length);
                    FinalValMeeting = (FinalValMeeting / objGroupChartData.Meeting.length);
                    FinalValMarketing = (FinalValMarketing / objGroupChartData.Marketing.length);

                    //FinalValDemographics = objGroupChartData.Demographics.reduce((a, b) => (parseFloat(a) + parseFloat(b)), 0) / objGroupChartData.Demographics.length;
                    //FinalValMeeting = objGroupChartData.Meeting.reduce((a, b) => (parseFloat(a) + parseFloat(b)), 0) / objGroupChartData.Meeting.length;
                    //FinalValMarketing = objGroupChartData.Marketing.reduce((a, b) => (parseFloat(a) + parseFloat(b)), 0) / objGroupChartData.Marketing.length;
                    
                    if ((isNaN(FinalValDemographics) || FinalValDemographics == 0) && (isNaN(FinalValMeeting) || FinalValMeeting == 0) && (isNaN(FinalValMarketing) || FinalValMarketing == 0)) {
                        rC.HCQuestionGroupChart = null;
                    }
                    else
                    {
                        rC.HCQuestionGroupChart = {
                            options: {
                                chart: { type: 'column' },
                                tooltip: {
                                    shared: false,
                                    formatter: function () {
                                        var tooltip;
                                        tooltip = '<span>' + this.series.name + ': <b>' + this.y + '</b></span>';

                                        return tooltip;
                                    }
                                },
                            },
                            "title": { text: 'Demographics / Meeting / Marketing' },
                            "legend": { enabled: true },
                            "xAxis": {
                                visible: false,
                                categories: [],
                                title: {
                                    text: ''
                                }
                            },
                            "yAxis": {},
                            "credits": { enabled: false },
                            "series": [
                                { name: 'Demographics', data: [parseFloat(FinalValDemographics.toFixed(2))] },
                                { name: 'The Meeting', data: [parseFloat(FinalValMeeting.toFixed(2))] },
                                { name: 'Marketing', data: [parseFloat(FinalValMarketing.toFixed(2))] }
                            ]
                        }
                    }

                    //END NILESH-TSK21-9
                }
                rC.ReportDataIsLoading = false;
                //END NILESH-TSK21-8
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
                    if (defaultTextLowercase === "##teachername##" || defaultTextLowercase === "##employeename##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 2,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the district column
                    if (defaultTextLowercase === "##districtname##" || defaultTextLowercase === "##merchantname##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 3,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the school column
                    if (defaultTextLowercase === "##schoolname##" || defaultTextLowercase === "##sitename##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 4,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the grade column
                    if (defaultTextLowercase === "##gradename##" || defaultTextLowercase === "##groupname##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 5,
                            AnswerID: QuestionsForHeaderTable[q].Answers[y].AnswerID
                        });
                    }
                    // check if it's the class/subject column
                    if (defaultTextLowercase === "##classname##" || defaultTextLowercase === "##subjectname##" || defaultTextLowercase === "##departmentname##") {
                        headers.push({
                            HeaderText: QuestionsForHeaderTable[q].CleanQuestionText,
                            DisplayOrder: 6,
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
                            //START NILESH-TSK44
                            var dtMakeCorrect = moment(rC.AllVotes[z][keys[t]], "MM/DD/YYYY");
                            if (dtMakeCorrect._d.toString() == "Invalid Date")
                            {
                                dtMakeCorrect = moment(rC.AllVotes[z][keys[t]], "DD/MM/YYYY");
                            }
                            rC.AllVotes[z][keys[t]] = dtMakeCorrect.format("MM/DD/YYYY");
                            //END NILESH-TSK44

							var voteMoment = moment(rC.AllVotes[z][keys[t]], "MM/DD/YYYY");
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
            //START NILESH-TSK21-3
            //console.log("Filtered rC.Filtered  ", rC.FilteredVoters)
            if (rC.FilteredVoters && rC.FilteredVoters.length > 0) {
                for (var z = rC.AllVotes.length - 1; z > -1; z--) {

                    if (rC.FilteredVoters.indexOf(rC.AllVotes[z].VoterID) > -1) {
                        rC.RemovedVotes.push(rC.AllVotes[z]);
                        rC.AllVotes.splice(z, 1);
                    }
                }
            }
            //END NILESH-TSK21-3

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
			//START NILESH-TSK21-3
            var voterIds = [];
            //END NILESH-TSK21-3
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
                //START NILESH-TSK21-3
                voterIds.push(rC.AllVotes[s].VoterID);
                //END NILESH-TSK21-3
            }

            for (var ii = 0; ii < headers.length; ii++) {
                rC.HeaderDataTable.Headers.push(headers[ii].HeaderText);
            }
            for (var x = 0; x < rows.length; x++) {
                //START NILESH-TSK21-3
                //rC.HeaderDataTable.Rows.push(rows[x]);
                var objRow = rows[x];
                objRow.VoterId = voterIds[x];
                rC.HeaderDataTable.Rows.push(objRow);
                //END NILESH-TSK21-3
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
			
			//START NILESH-TSK21-6
            var TyLyPlusMinusUnitQid = GetRUVQuestionId(),TotalAnswerTyLy=0;
            for (var i in rC.AllVotes) {
                var voterAnswerValueTyLy = null;
                var dateFromForm = null;
                var keys = Object.keys(rC.AllVotes[i]);
                for (var k in keys) {
                    if (!voterAnswerValueTyLy) {
                        if (keys[k].indexOf(TyLyPlusMinusUnitQid + "_") > -1) {
                            voterAnswerValueTyLy = rC.AllVotes[i][keys[k]];
                            var voterAnswerKey = keys.filter(function (e) { return e.indexOf(TyLyPlusMinusUnitQid + "_") > -1; });
                            if (voterAnswerValueTyLy != "" && voterAnswerKey[0] && rC.AllVotes[i][voterAnswerKey[0]] !== "" && !isNaN(rC.AllVotes[i][voterAnswerKey[0]])) {
                                TotalAnswerTyLy += parseFloat(rC.AllVotes[i][voterAnswerKey[0]]);
                            }
                        }
                    }
                    if (voterAnswerValueTyLy) {
                        break; 
                    }
                }
            }
            if (TotalAnswerTyLy == 0)
                $scope.RUValue = 0;
            else
                $scope.RUValue = TotalAnswerTyLy / rC.AllVotes.length;
            //END NILESH-TSK21-6
        }

        function sortQuestionsByDisplayOrder(question1, question2) {
            return question1.DisplayOrder - question2.DisplayOrder;
        }


        function isPSSQMatch(defaultText, answerID) {
            if (defaultText && defaultText !== "") {
                switch (defaultText.toLowerCase()) {
                    case "##districtid##":
                    case "##merchantid##":
                        repConst.SetDistrictIDAnswerID(answerID);
                        return true;
                    case "##schoolid##":
                    case "##siteid##":
                        repConst.SetSchoolIDAnswerID(answerID);
                        return true;
                    case "##teacherid##":
                    case "##employeeid##":
                        repConst.SetTeacherIDAnswerID(answerID);
                        return true;
                    case "##gradeid##":
                    case "##groupid##":
                        repConst.SetGradeIDAnswerID(answerID);
                        return true;
                    case "##classid##":
                    case "##subjectid##":
                    case "##departmentid##":
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
                    case "##merchantname##":
                    case "##schoolname##":
                    case "##sitename##":
                    case "##teachername##":
                    case "##employeename##":
                    case "##gradename##":
                    case "##groupname##":
                    case "##classname##":
                    case "##subjectname##":
                    case "##departmentname##":
                        return true;
                    default:
                        return false;
                }
            }
            return false;
        }

        function getActiveFilterObject(filterOption) {
            var answerID = -1;
            if (filterOption.ValueVariableName === "districtid" || filterOption.ValueVariableName === "merchantid") {
                answerID = repConst.DistrictIDAnswerID;
            } else if (filterOption.ValueVariableName === "schoolid" || filterOption.ValueVariableName === "siteid") {
                answerID = repConst.SchoolIDAnswerID;
            } else if (filterOption.ValueVariableName === "teacherid" || filterOption.ValueVariableName === "employeeid") {
                answerID = repConst.TeacherIDAnswerID;
            } else if (filterOption.ValueVariableName === "classid" || filterOption.ValueVariableName === "subjectid" || filterOption.ValueVariableName === "departmentid") {
                answerID = repConst.SubjectIDAnswerID;
            } else if (filterOption.ValueVariableName === "gradeid" || filterOption.ValueVariableName === "groupid") {
                answerID = repConst.GradeIDAnswerID;
            } else if (filterOption.ValueVariableName === "iaspireuserid") {
                answerID = repConst.ObserverIDAnswerID;
            }
            else if (filterOption.ValueVariableName === "typeofsession") {//M006 M0014
                answerID = repConst.SessionTypeID;
            }
            else if (filterOption.ValueVariableName === "typeofdiscussion") {//M008 M0014
                answerID = repConst.DiscussionTypeID;
            }
                //START NILESH-TSK21-7
            else if (filterOption.ValueVariableName === "+-lyty") {
                answerID = GetAnswerIdForLyTyCalc();
            }
            //END NILESH-TSK21-7
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
        function renderCSV()
        { 
            DataService.GetReportCSVData(rC.SurveyID, moment(rC.StartDateString, rC.momentFormat).format(), moment(rC.EndDateString, rC.momentFormat).format())
            .success(function (data, status1, headers, config) {

                var a = document.createElement("a");
                var blob = new Blob([data], { type: "octet/stream" }),
                  url = window.URL.createObjectURL(blob);

                a.href = url;
                a.download = "dataexport.csv";
                a.click();
                window.URL.revokeObjectURL(url);
                 
                //console.log(data);
            })
            .error(function (data, status, headers, config) {
                if (status === 403) {
                    SMAAlertFactory.CreateInfoAlert("Alert", "You do not have access to this page.", function () {
                        window.location.hash = "#/selection";
                    });
                }
            });
        }
        //END NILESH-TSK65
		
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
		
        //START NIELSH-TSK21-3
        function removeVoterFilter(voteRow) {
            voteRow.IsLoading = true;
            //console.log("voteRow", voteRow);
            rC.FilteredVoters.push(voteRow.VoterId);
            //console.log(rC.FilteredVoters);
            rC.GetNewData();
        }
        //END NIELSH-TSK21-3

        //function removeFilter(index) {
        //    console.log(index);
        //    if (index > -1) {
        //        rC.ActiveFilters.splice(index, 1);
        //    } else {
        //        console.log("unknown activeFilter");
        //    }
        //}



        //function resetVoteFilters() {
        //    rC.QuestionGroups = rC.ActiveSurvey.QuestionGroups;

        //    // look for the QustionGroup
        //    for (var i in rC.ActiveSurvey.QuestionGroups) { // loop question groups
        //        if (rC.ReformattedFormByCategory.filter(function (e) { e.ID === rC.ActiveSurvey.QuestionGroups[i].ID }).length < 1) {
        //            rC.ReformattedFormByCategory.push(rC.ActiveSurvey.QuestionGroups[i]); // add it if it doesn't exist in the list
        //        }
        //    }
        //    // set up categories
        //    for (var i in rC.ReformattedFormByCategory) {
        //        // add questions to categories
        //        rC.ReformattedFormByCategory[i].QuestionList = rc.ActiveSurvey.Questions.filter(function (question) {
        //            question.QuestionGroupID && question.QuestionGroupID === rC.ReformattedFormByCategory[i].ID
        //        });
        //        // add answers to questions
        //        for (var k in rC.ReformattedFormByCategory[i].QuestionList) {
        //            rC.ReformattedFormByCategory[i].QuestionList[k].AnswerList = rc.ActiveSurvey.Answers.filter(function (answer) {
        //                answer.QuestionID === rC.ReformattedFormByCategory[i].QuestionList[k].QuestionID;
        //            });
        //        }
        //        for (var k in rC.AllVotes) {
        //            if (rC.ReformattedFormByCategory[i].VotesList.filter(function (e) { e.VoterID === rC.AllVotes[k].VoterID; }) > 0) {

        //            }
        //        }

        //    }
        //}

        //function isStaticTextQuestionType(question) {
        //    if (question.LayoutModeID === 1) return true; // static text
        //    return false;
        //}




        // removed from formatDataForGoogleCharts
        // destroy all google charts for redrawing ?????
        // set up new data
        //rC.QuestionGroups = rC.ActiveSurvey.QuestionGroups;
        //for (var i in rC.QuestionGroups) {
        //    rC.QuestionGroups[i].QuestionList = rC.ActiveSurvey.Questions.filter(function (question) {
        //        question.QuestionGroupID === rC.QuestionGroups[i].ID
        //    });
        //    for (var k in rC.QuestionGroups[i].QuestionList) {
        //        rC.QuestionGroups[i].QuestionList[k].AnswerList = rC.ActiveSurvey.Answers.filter(function (answer) {
        //            answer.QuestionID === rC.QuestionGroups[i].QuestionList[k].QuestionID
        //        });
        //    }
        //}
        // set up google chart data
        //for (var i in rC.QuestionGroups) { // loop groups
        //    rC.QuestionGroups[i].DataSet = [];
        //    for (var k in rC.QuestionGroups[i].QuestionList) { // loop questions
        //        var dataSet = {
        //            Title: rC.QuestionGroups[i].QuestionList[k].QuestionText.replace(/(<[^>]*>)/, '').replace(/((&lt;)(?:(?!&gt;).)*(&gt;))/, ''),
        //            Data: [["Answer", "SelectionCount"]]
        //        }
        //        for (var n in rC.QuestionGroups[i].QuestionList[k].AnswerList) { // loop answers
        //            dataSet.Data.push(
        //                [
        //                    rC.QuestionGroups[i].QuestionList[k].AnswerList[n].QuestionText.replace(/(<[^>]*>)/, '').replace(/((&lt;)(?:(?!&gt;).)*(&gt;))/, ''),
        //                    getVoteCount(rC.QuestionGroups[i].QuestionList[k].QuestionID, rC.QuestionGroups[i].QuestionList[k].AnswerList[n].AnswerID)
        //                ]
        //                );
        //        }
        //        rC.QuestionGroups[i].DataSet.push(dataSet);
        //    }
        //}
        // set charts to draw

        //function getVoteCount(questionID, answerID) {
        //    return rC.AllVotes.filter(function (votePivot) {
        //        if (votePivot.PivotAnswers.filter(function (pivotAnswer) {
        //            pivotAnswer.Name === questionID + "_" + answerID && pivotAnswer.Value
        //        }).length > 0 && survivesFilter(votePivot)) {
        //            return true;
        //        } else {
        //            return false;
        //        }
        //    }).length
        //}

        //function survivesFilter(vote) {
        //    if (rC.FilterOptions.filter(function (e) { e.Active === true }).length < 1) return true;
        //    for (var i in rC.FilterOptions) { // for each filter
        //        if (rC.FilterOptions[i].Active === true) { // check if it is active
        //            for (var k in rC.ActiveSurvey.Answers) { // if active, for each answer in the survey
        //                if (rC.FilterOptions[i].ValueVariableName.replace('#', '') === rC.ActiveSurvey.Answers[k].DefaultText.replace('#', '')) { // check for the correct answer from the list
        //                    var pivotID = rC.ActiveSurvey.Answers[k].QuestionID + "_" + rC.ActiveSurvey.Answers[k].AnswerID;
        //                    var pivotAnswers = vote.PivotAnswers.filter(function (pivotAnswers) { pivotAnswers.Name === pivotID })
        //                    if (pivotAnswers.length > 0) {
        //                        if (rC.FilterOptions[i].FilterValue !== pivotAnswers[0].Value) return false;
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    return false;
        //}

		
		//START NILESH-TSK21-6
        function GetRUVQuestionId()
        {
			// For  - Jostens - Data Collection Form
            //TyLy +-Unit QuestionId
            return 15563;
        }
        //END NILESH-TSK21-6
		//START NILESH-TSK21-7
        function GetAnswerIdForLyTyCalc() {
	    // For - Jostens - Data Collection Form
            var LyTyCalculationAnswerID = 36848; //13013_30482
            return LyTyCalculationAnswerID;
        }
        //END NILESH-TSK21-7
		
		 //START NILESH-TSK21-8
        function getFooterTableData(baseQuestion) {

            //if (baseQuestion.CleanQuestionText == 'Number of Days Between Class meeting and Order Day')
            //   var abc = "";

            var returnValue = {
                //START NILESH-TSK21-9
                questionid: baseQuestion.OldQuestionID,
                meanOfMedian : 0,
                //END NILESH-TSK21-9

                question: baseQuestion.CleanQuestionText,
                answer: "",
                median: 0
            };

            var booleanAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsBooleanAnswerType(e); }); // check boolean
            var booleanOtherAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsOtherAnswerType(e); }); // check for boolean-other
            var rangeAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsRangeAnswerType(e); }); // check range
            var dropDownAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsDropDownAnswerType(e); }); // check dropdown
            var commentAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsCommentAnswerType(e); }); // check comments
            var textEntryAnswers = baseQuestion.Answers.filter(function (e) { return checkAnswerType_IsTextboxAnswerType(e); }); // check for text box

            var dataObject = [];
            var returnAnswerQuestionId = GetJostenCalculatedUnitQuestionId();

            if (booleanAnswers.length > 0) {
                //FOR JOSTEN : LY-TY UNIT
                var answerList = booleanAnswers;
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesForJostenByAnswerId(returnAnswerQuestionId, answerList[i].OldAnswerID);
                    var arrValues = [];
                    for (var k in voterResults) {
                        if (!isNaN(voterResults[k].VoterSubAnswerValue)) {
                            arrValues.push(parseInt(voterResults[k].VoterSubAnswerValue))
                        }
                    }
                    var finalArr = GetBoxPlotData(arrValues);
                    var objAnswerData = {
                        answerText: '',
                        median: 0
                    };
                    objAnswerData.answerText = answerList[i].CleanAnswerText;
                    objAnswerData.median = finalArr.Q3;
                    dataObject.push(objAnswerData);
                }
            }
            if (booleanOtherAnswers.length > 0) {
                var answerList = booleanOtherAnswers;
                var arrCategory = [];
                var arrValues = [];
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesForJostenByAnswerId(returnAnswerQuestionId, answerList[i].OldAnswerID);
                    for (var k in voterResults) {
                        var textValue = answerList[i].CleanAnswerText;
                        if (textValue && textValue !== "") {
                            if (arrCategory.indexOf(textValue) == -1) {
                                arrCategory.push(textValue);
                                var arrSeries = [];
                                arrSeries.push(parseFloat(voterResults[k].VoterSubAnswerValue));
                                arrValues.push(arrSeries);
                            }
                            else {
                                var index = arrCategory.indexOf(textValue);
                                arrValues[index].push(parseFloat(voterResults[k].VoterSubAnswerValue));
                            }
                        }
                    }
                }
                for (var j in arrValues) {
                    var finalArr = GetBoxPlotData(arrValues[j]);
                    var objAnswerData = { answerText: '', median: 0 };
                    objAnswerData.answerText = arrCategory[j];
                    objAnswerData.median = finalArr.Q3;
                    dataObject.push(objAnswerData);
                }
            }
            if (textEntryAnswers.length > 0) {
                var answerList = textEntryAnswers;
                var arrCategory = [];
                var arrValues = [];
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesForJostenByAnswerId(returnAnswerQuestionId, answerList[i].OldAnswerID);
                    for (var k in voterResults) {
                        var textValue = voterResults[k].VoterAnswerValue;
                        if (textValue && textValue !== "") {
                            if (arrCategory.indexOf(textValue) == -1) {
                                arrCategory.push(textValue);
                                var arrSeries = [];
                                arrSeries.push(parseFloat(voterResults[k].VoterSubAnswerValue));
                                arrValues.push(arrSeries);
                            }
                            else {
                                var index = arrCategory.indexOf(textValue);
                                arrValues[index].push(parseFloat(voterResults[k].VoterSubAnswerValue));
                            }
                        }
                    }
                }
                for (var j in arrValues) {
                    var finalArr = GetBoxPlotData(arrValues[j]);
                    var objAnswerData = { answerText: '', median: 0 };
                    objAnswerData.answerText = arrCategory[j];
                    objAnswerData.median = finalArr.Q3;
                    dataObject.push(objAnswerData);
                }
            }
            if (rangeAnswers.length > 0) {
                var answerList = rangeAnswers;
                //FOR JOSTEN : LY-TY UNIT
                for (var i in answerList) {
                    var voterResults = repLogic.GetVoterAnswerValuesForJostenByAnswerId(returnAnswerQuestionId, answerList[i].OldAnswerID);
                    var arrValues = [];
                    for (var k in voterResults) {
                        if (!isNaN(voterResults[k].VoterSubAnswerValue)) {
                            arrValues.push(parseInt(voterResults[k].VoterSubAnswerValue))
                        }
                    }
                    var finalArr = GetBoxPlotData(arrValues);
                    var objAnswerData = {
                        answerText: '',
                        median: 0
                    };
                    objAnswerData.answerText = answerList[i].CleanAnswerText;
                    objAnswerData.median = finalArr.Q3;
                    dataObject.push(objAnswerData);
                }
            }

            if (dataObject.length > 0)
            {
                dataObject.sort(function (a, b) {
                    return b.median - a.median;
                });

                returnValue.answer = dataObject[0].answerText;
                returnValue.median = dataObject[0].median;
                //START NILESH-TSK21-9
                for (var x in dataObject)
                {
                    returnValue.meanOfMedian += dataObject[x].median;
                }
                returnValue.meanOfMedian = returnValue.meanOfMedian / dataObject.length;
                //END NILESH-TSK21-9
            }
            return returnValue;
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
        function GetBoxPlotData(arr) {
            var arrSorted = arr.sort(function (e1, e2) { return e1 - e2 });
            
            var returnVallue = [];

            returnVallue.Q1 = arrSorted[0];

            var Q2Value = percentile(arrSorted, 0.25);
            returnVallue.Q2 = Q2Value;

            var Q3Value = percentile(arrSorted, 0.50);
            returnVallue.Q3 = Q3Value;

            var Q4Value = percentile(arrSorted, 0.75);
            returnVallue.Q4 = Q4Value;

            returnVallue.Q5 = arrSorted[arrSorted.length - 1];

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
        function GetJostenCalculatedUnitQuestionId() {
            return "15563";
        }
        //END NILESH-TSK21-8
		
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
                    localStorage.setItem("ReportingSettings_DateRangeDate", JSON.stringify(rC.StartDateString));
                }
                else {
                    rC.StartDateString = moment().endOf('day').format('YYYY-MM-DD');
                    localStorage.setItem("ReportingSettings_DateRangeDate", JSON.stringify(rC.StartDateString));
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