(function () {

    "use strict";

    angular
        .module("iAspireApp")
        //START NILESH_TSK10 - Add "$window", in Parameter
        .controller("OpenSavedDocController", ["DataService", "$scope", "$rootScope", "$window", "$timeout", "SMAAlertFactory", "ProjectConstants", openSavedDocController]);
   
    function openSavedDocController(DataService, $scope, $rootScope, $window, $timeout, SMAAlertFactory, ProjectConstants) {
        
        $scope.AppC.ShowHeader = true;
        $scope.AppC.ShowFooter = true;
        $scope.AppC.ActivePageName = "Forms";
        //console.log($scope);
        
        /*jshint validthis:true */
        var oSD = this;
        oSD.MerchantData = '';
        getListOfAllSurvey();        
        oSD.isActive = true;
        oSD.dataLoaded = false;
        //oSD.SurveyList = [];
        oSD.responseResult = "";
        oSD.BackButtonText = "HOME";
        oSD.TESurveyList = [];
        oSD.SESurveyList = [];
        oSD.SurveyList = [];
        oSD.SurveyData = [];
        oSD.surveyIsLoaded = false;
        oSD.resumeiFrameLoadedCallback = iFrameLoaded;
        oSD.setVoterToOpen = setVoterToOpen;
        oSD.deActivateVote = deActivateVote
        oSD.FilterbyData = FilterbyData
        //START NILESH_TSK10
        oSD.openPrintPage = openPrintPage;
        //END NILESH_TSK10
        oSD.loadPrintableSurvey = loadPrintableSurvey;
        oSD.ShowOverallSpinner = null;
        //oSD.setVoterToClosed = setVoterToClosed;
        oSD.submtby = [];
        oSD.departmentlst = [];
        oSD.Subjctlst = [];
        oSD.Gradelst = [];
        oSD.FilterSettings = function () { };
        oSD.FilterSettings.EarliestDateString = null;
        oSD.FilterSettings.LatestDateString = null;
        oSD.FilterSettings.ReCalculateDateRange = reCalculateDateRange;
        //START NILESH-TSK16        
        oSD.FilterSettings.SelectedEmployee = null;
        oSD.FilterSettings.SelectedSubject = null;
        oSD.FilterSettings.SelectedGrade = null;
        oSD.FilterSettings.SelectedDept = null;
        oSD.FilterSettings.SelectedObserver = null;
        oSD.FilterSettings.SearchEmployee = null;
        oSD.FilterSettings.SearchEmployeeByName = searchEmployeeByName;
        oSD.FilterSettings.SerachData = [];
        oSD.FilterSettings.FilterData = null;
        oSD.Spinner = false;
        oSD.setSpinner = setSpinner;        
        oSD.getVotBySurveyID = getVotBySurveyID       
        //END NILESH-TSK16
        oSD.DisplayButton = DisplayButton;//M0014
        oSD.showhide = showhide;
        oSD.show = null;
        oSD.BackButton = false;
        oSD.SearchData = {
            searchTerm: '',
            startDate: '',
            endDate: ''
        }

        oSD.FilterOptions = {
            surveyID: -1,
            columnName: '',
            descending: false
        };

        //START NILESH-TSK68
        oSD.ShowMailStatusColumn = true;
        setMailColumnVisibility();
        //END NILESH-TSK68

        CheckGroupAdmin();

        //START NILESH-TSK68
        function setMailColumnVisibility() {
            var HideMerchantIdList = ["38c24807-99e1-41ff-a7a6-87822fd66f31"];
            var merchantData = localStorage.getItem("MerchantData");
            if (merchantData != undefined || merchantData != null) {
                try {
                    merchantData = JSON.parse(merchantData);
                    if (merchantData && merchantData.MerchantID && HideMerchantIdList.indexOf(merchantData.MerchantID) > -1) {
                        oSD.ShowMailStatusColumn = false;
                    }
                } catch (e) { }
            }
        }
        //END NILESH-TSK68

        var vote = [];
        oSD.CustomFilter = function (item) {

            var filter = oSD.FilterOptions.columnName.toLowerCase();
            if (filter === 'grade') {
                var int = parseInt(item[oSD.FilterOptions.columnName]);
                if (isNaN(int)) {
                    return item[oSD.FilterOptions.columnName];
                } else {
                    return int;
                }
            } else if (filter === 'lastsubmitted') {

                vote.push(item.VoterID);
                // turn the date of format DD/MM/YYYY into an array and reverse it
                var chk = item[oSD.FilterOptions.columnName];
                if (typeof chk != "undefined") {
                    //var dateArray = item[oSD.FilterOptions.columnName].split("-").reverse();
                    if (chk.indexOf("/") >= 1) {
                        var dateArray = item[oSD.FilterOptions.columnName].split("/").reverse();
                    }
                    else {
                        var dateArray = item[oSD.FilterOptions.columnName].split("-").reverse();
                    }

                    //console.log(dateArray);
                    // swap month and day
                    dateArray[3] = dateArray[1];
                    dateArray[1] = dateArray[2];
                    dateArray[2] = dateArray[3];
                    // add leading zeros into everything (note: Array(1).join("0") returns an empty string because there's nothing to join)
                    dateArray[0] = Array(5 - dateArray[0].length).join("0") + dateArray[0];
                    dateArray[1] = Array(3 - dateArray[1].length).join("0") + dateArray[1];
                    dateArray[2] = Array(3 - dateArray[2].length).join("0") + dateArray[2];
                    //console.log(dateArray.join(""));
                    // format to a string of YYYYMMDD and return
                    return dateArray.join("");
                }

            }
            else if (filter === '') {
                return item["SubmittedBy"];
            }
            return item[oSD.FilterOptions.columnName];
        };

        oSD.ChangeFilterSettings = function (columnName, surveyID) {
            oSD.FilterOptions.surveyID = surveyID;
            if (oSD.FilterOptions.columnName === columnName.replace(' ', '').replace('&', '')) {
                oSD.FilterOptions.descending = !oSD.FilterOptions.descending;
            } else {
                oSD.FilterOptions.columnName = columnName.replace(' ', '').replace('&', '');
                oSD.FilterOptions.descending = true;
            }
            console.log(oSD.FilterOptions);
        };

        var clearEarlyDateWatch = $scope.$watch('oSD.FilterSettings.EarliestDateString', function (newValue, oldValue) {
            reCalculateDateRange();
        });
        var clearLateDateWatch = $scope.$watch('oSD.FilterSettings.LatestDateString', function (newValue, oldValue) {
            reCalculateDateRange();
        });


        $scope.$on("$destroy", function () {
            //console.log("destroying");
            $('#FromDate').datetimepicker("destroy");
            $('#ToDate').datetimepicker("destroy");
            clearEarlyDateWatch();
            clearLateDateWatch();
        });

        //setInterval(function () {
        //    console.log(oSD.FilterSettings.EarliestDate, oSD.FilterSettings.LatestDate);
        //}, 2500);

        oSD.activeVoterOpen = 0;

        oSD.backToSelectionPage = backToSelectionPage;

        window.document.getElementsByTagName('iframe')[0].addEventListener(ProjectConstants.Events.SurveyComplete, function () {
            var iframe = document.getElementById("surveyResumeIFrame");
            setTimeout(function () {
                oSD.surveyIsLoaded = false;
                setActiveVoterToClosed(true);
                iframe.setAttribute("src", "");
            }, 3000);
        });

        setTimeout(function () {
            if (oSD.ShowOverallSpinner !== false) {
                oSD.ShowOverallSpinner = true;
            }
            $scope.$apply();
        }, ProjectConstants.Integers.LoadDelayTime);

        var retryCount = 0;
        
        return oSD;

        function SortByTitle(x, y) {//M0022
            return ((x.Title == y.Title) ? 0 : ((x.Title > y.Title) ? 1 : -1));
        }
        function getListOfAllSurvey(survey) {
            $scope.spinner = SMAAlertFactory.CreateSpinnerAlert();
            oSD.MerchantData = JSON.parse(localStorage.getItem("MainUserData"))
            DataService.GetSureyListByFormType(oSD.MerchantData.MerchantID)
                .success(function (data, status, headers, config) {
                    data.sort(SortByTitle);//M0022
                    for (var i in data) {
                        data[i].VoteList = [];
                        data[i].ShowVotes = false;
                        data[i].ShowSpinner = true;
                    }
                    oSD.SurveyList = data;
                    if (survey) {
                        var SurveyVal = data.filter(function (e) {
                            return e.SurveyID == survey.surveyID;
                        })

                        var SurveyData = {
                            surveydata: SurveyVal,
                            filterdata: oSD.SearchData
                        }
                        SurveyVal[0].ShowVotes = true;
                        SurveyVal[0].ShowSpinner = true;
                        getVoteListForUser(SurveyData);
                    }
                    else {
                        oSD.Spinner = false;
                    }
                    $scope.spinner.resolve();
                })
                .error(function (data, status, headers, config) {
                    $scope.spinner.resolve();
                });
        }
        function FilterbyData(DateInput) {            
            for (var i in oSD.SurveyList) {
                oSD.SurveyList[i].VoteList = [];
                oSD.SurveyList[i].ShowVotes = true;
                oSD.SurveyList[i].ShowSpinner = true;
            }

            var SurveyData = {
                surveydata: oSD.SurveyList,
                filterdata: {
                    searchTerm: oSD.FilterSettings.SelectedEmployee==null?"":oSD.FilterSettings.SelectedEmployee,
                    startDate: oSD.SearchData.startDate,
                    endDate: oSD.SearchData.endDate
                }
            }            
            getVoteListForUser(SurveyData);
        }

        function getVoteListForUser(SurveyData) {
            $scope.spinner = SMAAlertFactory.CreateSpinnerAlert();
            var Role = $scope.role ? "Viewer" : "Other";
            DataService.getVoterListAsync(SurveyData, 'OPSDOC')//M0014
                .success(function (data, status, headers, config) {
                    if (data != null && data != '') {
                        data = data.filter(function (e) {
                            return e.isActive == false;
                        })
                    } else {
                        oSD.responseResult = "No data!";
                    }                   
                    if (Role == "Viewer") {
                        var UserValue = $scope.AppC.ActiveUser;
                        data = data.filter(function (e, index) {
                            return e.VoterAnswerFilterValues.filter(function (f) {
                                f.VariableValue == (UserValue.FirstName + " " + UserValue.LastName) == true || f.VariableValue == (UserValue.LastName + ", " + UserValue.FirstName) == true
                            })                            
                        })
                    }
                    if (data.length && data.length > 0) {
                        formatVoteData(data);
                    }
                    else {//M0022
                        oSD.Spinner = false;
                    }

                    for (var k in oSD.surveylist) {
                        //if ($scope.role == true) {
                        //    var vote = osd.surveylist[k].votelist
                        //    osd.surveylist[k].votelist = vote.filter(function (e) {
                        //        return e.validated == true;
                        //    })
                        //}
                        oSD.surveylist[k].showspinner = false;
                    }                   
                    var v = oSD.SurveyList;
                    $scope.spinner.resolve();
                })
                .error(function (data, status, headers, config) {
                    if (status === 0) // timeout
                    {
                        if (retryCount < 2) {
                            retryCount += 1;
                            //getVoteListForUser();
                        } else {
                            SMAAlertFactory.CreateInfoAlert("Alert", "It seems iAspire is overloaded at the moment\n please try again later.");
                        }
                    }
                    oSD.responseResult = "Sorry something went wrong. Please try again.";
                    $scope.spinner.resolve();
                });
        }

        function formatVoteData(data) {
            //oSD.filtersumbit();
            var chkval = -1;// M0021
            for (var i in data) {
                var voteAlreadyExists = false;
                for (var k in oSD.SurveyList) {
                    for (var m in oSD.SurveyList[k].VoteList) {
                        if (oSD.SurveyList[k].VoteList[m].VoterID === data[i].VoterID) {
                            voteAlreadyExists = true;
                        }
                    }
                }

                if (voteAlreadyExists === false) {
                    data[i].IsInValidDateRange = false;
                    //START NILESH-TSK16
                    data[i].IsInvalidEmployee = false;
                    //END NILESH-TSK16
                    var dateToUse = null;
                    if (data[i].VoteDate) { dateToUse = data[i].VoteDate; } else { dateToUse = data[i].StartDate; }
                    data[i].StrFrmtLastEditDate = moment(dateToUse).format("ddd MMM Do YYYY hh:mm A");
                    if (data[i].VoterAnswerFilterValues && data[i].VoterAnswerFilterValues.length > 0) {
                        //for (var n in data[i].VoterAnswerFilterValues) {
                        //    if (data[i].VoterAnswerFilterValues[n].VariableName === 'Date & Time') {
                        //        data[i].VoterAnswerFilterValues[n].VariableValue = moment(parseInt(data[i].VoterAnswerFilterValues[n].VariableValue)).format("ddd MMM Do YYYY HH:mm A");
                        //    }
                        //}

                        for (var z = 0, len = data[i].VoterAnswerFilterValues.length; z < len; z++) {
                            data[i][data[i].VoterAnswerFilterValues[z].VariableName.replace(' ', '').replace('&', '')] = data[i].VoterAnswerFilterValues[z].VariableValue;
                        }

                        //For rearrange column only when summary column          M0021
                        //for (var j = 0; j < data[i].VoterAnswerFilterValues.length; j++) {
                        //    if (data[i].VoterAnswerFilterValues[j].VariableName == 'Free text synopsis') {
                        //        var synopsisvalue = data[i].VoterAnswerFilterValues[j];
                        //        var synopsisindex = j;
                        //        var sumbmitedvalue;
                        //        var sumbmitedindex = 0;
                        //        var chkflag = false;
                        //        for (var k = 0; k < data[i].VoterAnswerFilterValues.length; k++) {
                        //            if (data[i].VoterAnswerFilterValues[k].VariableName == 'Last Submitted') {
                        //                sumbmitedvalue = data[i].VoterAnswerFilterValues[k];
                        //                sumbmitedindex = k - 1;
                        //                chkflag = true;
                        //            }
                        //        }
                        //        if (chkflag && chkval != i) {
                        //            chkval = i;
                        //            data[i].VoterAnswerFilterValues.splice(synopsisindex, 1);
                        //            data[i].VoterAnswerFilterValues.splice(sumbmitedindex, 1);
                        //            data[i].VoterAnswerFilterValues.push(sumbmitedvalue);
                        //            data[i].VoterAnswerFilterValues.push(synopsisvalue);
                        //        }
                        //    }
                        //}
                    }
                    for (var l in oSD.SurveyList) {
                        if (oSD.SurveyList[l].SurveyID === data[i].SurveyID) {
                            oSD.SurveyList[l].VoteList.push(data[i]);
                        }
                    }
                }
            }
            //console.log(oSD.SurveyList);
        }

        //MP -- Comment Changes --
        function setVoterToOpen(event, voterID, surveyGuid, resumeGuid, vote) {
            oSD.Spinner = true;//M0034
            var siteName = "";
            var employeeName = "";

            if (vote.VoterAnswerFilterValues[1] != null) {
                siteName = vote.VoterAnswerFilterValues[1].VariableValue;
                siteName = vote.VoterAnswerFilterValues[1].VariableValue;
            }

            DataService.setVoterToOpen(voterID)
                .success(function (data, status, headers, config) {
                    oSD.activeVoterOpen = voterID;
                    loadSurvey(surveyGuid, resumeGuid, siteName, employeeName, vote.ResumeUID);
                    oSD.BackButton = true;
                })
                .error(function (data, status, headers, config) {
                    oSD.Spinner = false;//M0034
                    if (status === 403) SMAAlertFactory.CreateInfoAlert("Alert", "You may not edit this form.");
                });
        }

        //function setVoterToOpen(event, voterID, surveyGuid, resumeGuid, vote) {
        //    console.log(vote.VoterAnswerFilterValues);
        //    DataService.setVoterToOpen(voterID)
        //        .success(function (data, status, headers, config) {
        //            oSD.activeVoterOpen = voterID;
        //            loadSurvey(surveyGuid, resumeGuid);
        //        })
        //        .error(function (data, status, headers, config) {
        //            if (status === 403) SMAAlertFactory.CreateInfoAlert("Alert", "You may not edit this form.");
        //        });
        //}

        //MP print changes start
        function openPrintPage(event, voterID, surveyGuid, resumeGuid, vote) {

            var siteName = "";
            var employeeName = "";

            if (vote.VoterAnswerFilterValues[1] != null) {
                siteName = vote.VoterAnswerFilterValues[1].VariableValue;
                siteName = vote.VoterAnswerFilterValues[1].VariableValue;
            }

            DataService.getViewVoteGuid(voterID)
                .success(function (data, status, headers, config) {
                    var url = DataService.getPrintVoteURL(data, $scope.AppC.ActiveUser.UserName)
                    url = url + "&sitename=" + siteName + "&employeeName=" + employeeName + "&ResumeUID=" + vote.ResumeUID + "&FromUsername=" + $scope.AppC.ActiveUser.LastName + " " + $scope.AppC.ActiveUser.FirstName;
                    if (!$window.device) {
                        $window.device = { platform: 'Browser' };
                    }
                    if ($window.device.platform.toUpperCase() === 'ANDROID') {
                        navigator.app.loadUrl(url, { openExternal: true });
                        e.preventDefault();
                    }
                    else if (device.platform.toUpperCase() === 'IOS') {
                        $window.open(url, '_system');
                        e.preventDefault();
                    }
                    else {
                        $window.open(url, '_blank');
                    }
                });
        }

        ////START NILESH_TSK10
        //function openPrintPage(event, voterID, surveyGuid, resumeGuid) {
        //        DataService.getViewVoteGuid(voterID)
        //		.success(function (data, status, headers, config) {
        //var url = DataService.getPrintVoteURL(data, $scope.AppC.ActiveUser.UserName)
        //            $window.open(url, '_blank');
        //		});
        //    }
        ////END NILESH_TSK10

        //MP changes print start      

        function setActiveVoterToClosed(removeFromListBool) {
            if (removeFromListBool === true) {//M0032
                DataService.setVoterToClosed(oSD.activeVoterOpen)
                    .success(function (data, status, headers, config) {
                        for (var i in oSD.SurveyList) {
                            for (var k in oSD.SurveyList[i].VoteList) {
                                if (oSD.SurveyList[i].VoteList[k].VoterID === oSD.activeVoterOpen) {
                                    //oSD.SurveyList[i].VoteList.splice(k, 1);
                                    break;
                                }
                            }
                        }
                        getListOfAllSurvey();//M0032
                    })
                    .error(function (data, status, headers, config) {

                    });
            }
        }

        function loadSurvey(surveyGuid, resumeGuid, siteName, employeeName, ResumeUID) {
            var resumeString = "&" + ProjectConstants.QWRYSTR.ResumeID + "=" + resumeGuid;
            var userString = "&" + ProjectConstants.QWRYSTR.iAspireUserName + "=" + $scope.AppC.ActiveUser.UserName
                + "&sitename=" + siteName + "&employeeName=" + employeeName + "&ResumeUID=" + ResumeUID + "&FromUsername=" + $scope.AppC.ActiveUser.LastName + " " + $scope.AppC.ActiveUser.FirstName;
            var iFrame = document.getElementById("surveyResumeIFrame");
            iFrame.setAttribute("src", DataService.getAdminPanelSurveyURL(surveyGuid, $scope.AppC.UserID, $scope.AppC.ActiveUser.SessionID) + resumeString + userString);
        }

        //function loadSurvey(surveyGuid, resumeGuid) {
        //    //var resumeString = "&resumeid=" + resumeGuid;
        //    var resumeString = "&" + ProjectConstants.QWRYSTR.ResumeID + "=" + resumeGuid;
        //    var iFrame = document.getElementById("surveyResumeIFrame");

        //    iFrame.setAttribute("src", DataService.getAdminPanelSurveyURL(surveyGuid, $scope.AppC.UserID, $scope.AppC.ActiveUser.SessionID) + resumeString);
        //    console.log(iFrame);
        //}

        //MP changes print end

        function loadPrintableSurvey(event, voterID, surveyGuid, resumeGuid, vote) {
            oSD.Spinner = true;
            var incomplete = true;
            for (var i in oSD.SurveyList) {
                for (var k in oSD.SurveyList[i].VoteList) {
                    if (oSD.SurveyList[i].VoteList[k].VoterID === voterID) {
                        if (oSD.SurveyList[i].VoteList[k].Validated === true && oSD.SurveyList[i].VoteList[k].VoteDate !== null) {
                            incomplete = false;
                            break;
                        }
                    }
                }
            }
            if (incomplete === false) {
                DataService.getViewVoteGuid(voterID)
                    .success(function (data, status, headers, config) {
                        if (status === 204) {
                            setVoterToOpen(event, voterID, surveyGuid, resumeGuid, vote);
                            //SMAAlertFactory.CreateInfoAlert("Alert", "Please select the Resume\n\n" + "button to edit the document.");
                            //SMAAlertFactory.CreateInfoAlert("Alert", "This form is incomplete.\n\n" + "Please select Edit to resume.");
                        } else {
                            var iFrame = document.getElementById("surveyResumeIFrame");
                            //START NILESH-TSK18 - Add Queerystring Parameter iaspireusername and it's value
                            iFrame.setAttribute("src", DataService.getViewVoteURL(data) + "&iaspireusername=" + $scope.$parent.AppC.ActiveUser.UserName);
                            //END NILESH-TSK18
                            oSD.activeVoterOpen = voterID;
                        }
                    })
                    .error(function (data, status, headers, config) {

                    });
            } else {
                setVoterToOpen(event, voterID, surveyGuid, resumeGuid, vote);
                //SMAAlertFactory.CreateInfoAlert("Alert", "Please select the Resume\n\n" + "button to edit the document.");
                //SMAAlertFactory.CreateInfoAlert("Alert", "This form is incomplete.\n\n" + "Please select Edit to resume.");
            }
        }

        function iFrameLoaded() {
            function resize() {
                if (typeof (func) == "function") {
                    func();
                }
                setTimeout(function () {
                    if (iframe) {
                        //iframe.style.display = "block";
                        //var minHeight = "calc(100% - 40px)";
                        //if (window.innerWidth >= 481 && window.innerWidth < 761) {
                        //    minHeight = "calc(100% - 45px)";
                        //} else if (window.innerWidth >= 761) {
                        //    minHeight = "calc(100% - 50px)";
                        //}
                        //iframe.style.minHeight = minHeight;
                        //iframe.style.height = "";
                        //setTimeout(function () {
                        //    //iframe.style.height = iframe.contentWindow.document.body.clientHeight + "px";
                        //});

                        //iframe.style.display = "block";
                        //iframe.style.height = "0px";
                        //setTimeout(function () {
                        //    iframe.style.height = "" + iframe.parentElement.offsetHeight + "px";
                        //}, 1);

                        var minHeight = ($(window).height() - 50 - 40) + "px";
                        if (window.innerWidth >= 481 && window.innerWidth < 761) {
                            minHeight = ($(window).height() - 55 - 45) + "px";
                        } else if (window.innerWidth >= 761) {
                            minHeight = ($(window).height() - 60 - 50) + "px";
                        }
                        iframe.style.minHeight = minHeight;
                        iframe.style.border = "0";
                        iframe.style.width = "100%";
                        iframe.style.display = "block";
                        iframe.style.position = "relative";
                        setTimeout(function () {
                            if (iframe.src.indexOf("surveymobilereport.aspx") > -1) {
                                iframe.style.height = $(iframe).contents().find("#Panel").height() + "px";
                            } else if (iframe.src.indexOf("iAspireSurveyMobile.aspx") > -1) {
                                iframe.style.height = $(iframe).contents().find("body").height() + "px";
                            }
                        }, 500);

                        var win = document.getElementsByTagName('iframe')[0].contentWindow;//M0033
                        win.postMessage(JSON.stringify({ key: 'AccessID', data: localStorage.getItem('AccessID') }), "*");
                    }
                }, 1);
            }
            var iframe = document.getElementById("surveyResumeIFrame");
            if (iframe.getAttribute("src") && (
                iframe.getAttribute("src").indexOf("iAspireSurveyMobile") > -1 ||
                iframe.getAttribute("src").indexOf("surveymobilereport") > -1)) { // the iFrameOnLoad event is still thrown after setting the src to an empty string
                oSD.surveyIsLoaded = true;
                oSD.Spinner = false;//M0034
                oSD.BackButtonText = "BACK";
                var iFrameWrapper = document.getElementsByClassName("iFrameWrapper")[0];
                var func = window.resize;
                setTimeout(function () {
                    resize();
                }, 1);
                window.onhashchange = function () {
                    window.onresize = null;
                    window.onresize = func;
                };
            } else {
                oSD.BackButtonText = "HOME";
            }
            $scope.$apply();
            oSD.Spinner = false;
        }

        function backToSelectionPage(event) {
            if (oSD.surveyIsLoaded === true) {
                oSD.BackButton = false;
                oSD.surveyIsLoaded = false;
                var iframe = document.getElementById("surveyResumeIFrame");
                if (iframe.getAttribute("src").indexOf("iAspireSurveyMobile") > -1) {
                    setActiveVoterToClosed();//M0032
                } else {
                    setActiveVoterToClosed();
                }
                iframe.setAttribute("src", "");
            } else {
                window.location.hash = "#/selection";
            }            
        }

        //START NILESH-TSK16
        function searchEmployeeByName() {
            var SearchTerm = oSD.FilterSettings.SelectedEmployee;
            var SerchEvent = null;
            var chksrch = $('.comonsrch').data('srch');            
            SerchEvent = $("#SearchEmployeebs");            
            $(SerchEvent).autocomplete({
                minLength: 1,
                source: function (request, response) {
                    var AutoFilterobj = SearchTerm;                  
                        autocompleteajaxbs(request, response, AutoFilterobj)
                },
                select: function (event, ui) {
                    oSD.SearchData.searchTerm = ui.item.value;                           
                },
                messages: {
                    noResults: '',
                    results: function () { }
                }
            })
        }
        function autocompleteajaxbs(request, response, AutoFilterobj) {
            DataService.searchSchoolTeacherbyName(AutoFilterobj)
            .success(function (data, status, headers, config) {
                var names = [];
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        names.push(data[i].Name)
                    }
                    response(names);
                }
            })
        }
       
           
        function reCalculateDateRange() {
            //var votes = [];
            var date = null;
            for (var i in oSD.SurveyList) {
                for (var k in oSD.SurveyList[i].VoteList) {
                    date = moment(oSD.SurveyList[i].VoteList[k].VoteDate);
                    if (date.isValid() === false) {
                        date = moment(oSD.SurveyList[i].VoteList[k].StartDate);
                    }
                    for (var m in oSD.SurveyList[i].VoteList[k].VoterAnswerFilterValues) {
                        if (oSD.SurveyList[i].VoteList[k].VoterAnswerFilterValues[m].VariableName === 'Date & Time') {
                            if (moment(oSD.SurveyList[i].VoteList[k].VoterAnswerFilterValues[m].VariableValue, "M/D/YYYY").isValid() === true) {
                                date = moment(oSD.SurveyList[i].VoteList[k].VoterAnswerFilterValues[m].VariableValue, "M/D/YYYY");
                            }
                        }
                    }
                    var earlyDate = null;
                    if (oSD.FilterSettings.EarliestDateString) {
                        earlyDate = moment(oSD.FilterSettings.EarliestDateString, "YYYY-MM-DD");
                    }
                    var lateDate = null;
                    if (oSD.FilterSettings.LatestDateString) {
                        lateDate = moment(oSD.FilterSettings.LatestDateString, "YYYY-MM-DD").endOf("day");
                    }
                    if (earlyDate && earlyDate.isValid() === true && lateDate && lateDate.isValid() === true) {
                        if (date.isBetween(earlyDate, lateDate) === true) {
                            oSD.SurveyList[i].VoteList[k].IsInValidDateRange = false;
                        } else {
                            oSD.SurveyList[i].VoteList[k].IsInValidDateRange = true;
                        }
                    } else if (earlyDate && earlyDate.isValid() === true) {
                        if (date.isAfter(earlyDate) === true) {
                            oSD.SurveyList[i].VoteList[k].IsInValidDateRange = false;
                        } else {
                            oSD.SurveyList[i].VoteList[k].IsInValidDateRange = true;
                        }
                    } else if (lateDate && lateDate.isValid() === true) {
                        if (date.isBefore(lateDate) === true) {
                            oSD.SurveyList[i].VoteList[k].IsInValidDateRange = false;
                        } else {
                            oSD.SurveyList[i].VoteList[k].IsInValidDateRange = true;
                        }
                    }
                    //votes.push(oSD.SurveyList[i].VoteList[k]);
                }
            }
            //console.table(votes);
        }
        
        //----------------------------XX----------------------------------
        function deActivateVote(voteID, surveyID) {
            SMAAlertFactory.CreateConfirmAlert("Are you sure<br>you want to delete this document?", null, null, null, confirmCallback);
            function confirmCallback(val) {
                if (val == true) {
                    // $scope.spinner = SMAAlertFactory.CreateSpinnerAlert();
                    var voterdata = {
                        VoterID: voteID,
                        SurveyID: surveyID
                    }
                    DataService.DeActivateVoter(voterdata).success(function () {
                        //$scope.spinner.resolve();
                        $('#' + voteID).hide();
                        oSD.isActive = false;
                        SMAAlertFactory.CreateInfoAlert("Document has been deleted successfully!");
                        var searchdata = localStorage.getItem("SrchData");
                        var strtdt = localStorage.getItem("StrtDt");
                        var endt = localStorage.getItem("EndDt");
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        SMAAlertFactory.CreateInfoAlert("Document failed to deleted!");
                    })
                }
            }
        }

        function DisplayButton(value, coloumnname) {//M0014
            //event.stopPropagation();
            if (coloumnname == 'Free text synopsis' && value.length >= 51) {//M0021
                return true;
            }
            else return false;

        }
        function setSpinner(chk) {
            oSD.Spinner = false;
        }
       
        function getVotBySurveyID(survey, chk,index) {
            if (chk == 'divtag') {
                survey.ShowVotes = survey.ShowVotes == false ? true : false;
            }
            var SurveyData = null;
            var Survey = oSD.SurveyList.filter(function (e) { return e.SurveyID == survey.SurveyID });
            if (survey.ShowVotes == true && (typeof $scope.serchData == "undefined" || $scope.serchData == null)) {
                $('#show' + index).text("Hide");
                SurveyData = {
                    surveydata: Survey,
                    filterdata: {
                        searchTerm: '',
                        startDate: '',
                        endDate: ''
                    }
                }
                getVoteListForUser(SurveyData);
            } 
            else {
                $('#show' + index).text("Show");
                var VoteData = oSD.SurveyList.filter(function (e) {
                    return e.SurveyID == survey.SurveyID;
                })
                VoteData[0].ShowVotes = false
            }
        }
        function CheckGroupAdmin() {

            var id = localStorage.getItem("USerID");

            if (id) {
                DataService.RolesGetListForUser(id)
                         .success(function (response3, status, header, config) {
                             var userRoles = response3;
                             $scope.isSelfReflectionRole = (userRoles.findIndex(function (e) { return (e.RoleName || "").toLowerCase() == "self reflection" }) != -1);
                             let chk = (userRoles.filter(function (e) {
                                 return e.RoleName == "Observer";
                             }))
                             if (chk.length > 0)
                                 chk = (chk[0].RoleName == "Observer");
                             let chk1 = (userRoles.filter(function (e) {
                                 return e.RoleName == "AccountAdmin";
                             }))
                             if (chk1.length > 0)
                                 chk1 = (chk1[0].RoleName == "AccountAdmin");

                             let chk2 = (userRoles.filter(function (e) {
                                 return e.RoleName == "GlobalAdmin";
                             }))
                             if (chk2.length > 0)
                                 chk2 = (chk2[0].RoleName == "GlobalAdmin")
                             let chk3 = (userRoles.filter(function (e) {
                                 return e.RoleName == "AccountManager";
                             }))
                             if (chk3.length > 0)
                                 chk3 = (chk3[0].RoleName == "AccountManager")
                             if (chk1 == false && chk2 == false && chk == false && chk3 == false) {
                                 $scope.role = true;
                             } else {
                                 $scope.role = false;
                             }
                         }).error(function (err) {

                         })
            }

        }

        function showhide(val, index) {
            if (val == 'show') {
                oSD.show = 'show' + index;
            }
            if (val == 'hide') {
                oSD.show = 'hide' + index;
            }
        }
    }

})();
