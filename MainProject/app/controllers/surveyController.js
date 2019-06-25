(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .directive("iframeOnload", iframeOnload)
		//START NILESH-TSK67 - Added $window
        .controller("SurveyController", ["DataService", "$scope", "SMAAlertFactory", "$routeParams", "ProjectConstants", "$window", surveyController]);
    //END NILESH-TSK67
    function iframeOnload() {
        return {
            scope: {
                callBack: "&iframeOnload"
            },
            link: function (scope, element, attrs) {
                element.on("load", function () {
                    return scope.callBack();
                });
            }
        };
    }
    //START NILESH-TSK67 - Added $window
    function surveyController(DataService, $scope, SMAAlertFactory, $routeParams, ProjectConstants, $window) {
        //END NILESH-TSK67
        $scope.AppC.ShowHeader = true;
        $scope.AppC.ShowFooter = true;
        $scope.AppC.ActivePageName = "Form";

        /*jshint validthis:true */
        var survC = this;

        survC.AnimationClass = "pageTransitionAnimation";

        survC.SurveyID = $routeParams.SurveyID;
        survC.SurveyGuid = $routeParams.SurveyGuid;

        survC.isSurveyLoaded = false;
        survC.surveyHasPreSurveyQuestions = false;
        survC.displayLoadingSpinner = null;

        survC.preSurveySurveyQuestions = [];
        survC.getUpdatedSurveyData = getUpdatedSurveyData;
        survC.resetPreSurveySurveyQuestionAnswers = resetPreSurveySurveyQuestionAnswers;
        survC.isGettingNewData = false;

        survC.iframeLoadedCallback = setIFrameHeight;

        getSurveyData();
        getSurvey();//G001
        window.document.getElementsByTagName('iframe')[0].addEventListener(ProjectConstants.Events.SurveyComplete, function (e) {
            setTimeout(function () {
                window.location.hash = "#selectForm";
            }, 3000);
        });

        survC.getSurvey = checkForRequireds;

        survC.backToSelectionPage = backToSelectionPage;
        survC.toSettingsPage = toSettingsPage;

        setTimeout(function () {
            if (survC.displayLoadingSpinner !== false) {
                survC.displayLoadingSpinner = true;
            }
            $scope.$apply();
        }, ProjectConstants.Integers.LoadDelayTime);



        // this is set to whatever the current httprequest is based on
        // (last item changed, by pre-survey-survey-question display order)
        var activeQuestion = null;
        var lastPSSA = null;



        return survC;

        // backend

        function getSurveyData() {
            //START NILESH-TSK67
            function bindEvent(element, eventName, eventHandler) {
                if (element.addEventListener) {
                    element.addEventListener(eventName, eventHandler, false);
                } else if (element.attachEvent) {
                    element.attachEvent('on' + eventName, eventHandler);
                }
            }

            bindEvent($window, 'message', function (event) {
                console.log("parent", event.data);
                try {
                    var data = JSON.parse(event.data)
                    if (data.refreshFrame != undefined && data.refreshFrame == true) {
                        var iFrame = document.getElementById("surveyIFrame");
                        iFrame.src = data.framesrc;
                    }
                    //START NILESH-TSK72
                    else if (data.SurveyComplete != undefined) {
                        var event1 = null;
                        try { event1 = document.createEvent('HTMLEvents'); } catch (ex) { event1 = new Event('SurveyComplete'); }
                        event1.initEvent('SurveyComplete', false, false);
                        window.document.getElementsByTagName('iframe')[0].dispatchEvent(event1);
                    }
                    //END NILESH-TSK72
                } catch (ex) { console.log(ex); }
            });
            //END NILESH-TSK67

            var pssa = {
                UserID: $scope.AppC.ActiveUser.UserID || -1,
                SurveyID: survC.SurveyID || -1,
                MerchantID: -1,
                SchoolID: -1,
                ClassID: -1,
                GradeID: -1,
                TeacherID: -1,
                StudentID: -1
            };
            DataService.getUpdatedSurveyVariables(pssa, 'PRESURVEY')//M0014
            .success(function (data, status, headers, config) {
                //console.log(data);
                if (data.length && data.length > 0) {
                    survC.displayLoadingSpinner = false;
                    survC.surveyHasPreSurveyQuestions = true;
                    for (var i in data) {
                        if (data[i].InputType) {
                            if (data[i].InputType === "datepicker") {
                                //data[i].SelectedOption = new Date();
                                data[i].SelectedOption = null;
                            } else if (data[i].InputType === "time") {
                                data[i].SelectedOption = new Date();
                                //data[i].SelectedOption = null;
                            } else if (data[i].InputType === "datetime-local") {
                                var d = new Date();
                                d.setSeconds(0, 0);
                                data[i].SelectedOption = d;
                            } else {
                                data[i].SelectedOption = null;
                            }
                        } else {
                            data[i].SelectedOption = null;
                            if (data[i].Options.length === 0) {
                                var obj = {
                                    Name: "No Data Available.",
                                    Value: -1
                                };
                                data[i].Options.push(obj);
                            }
                        }
                    }
                    survC.preSurveySurveyQuestions = data;
                } else {
                    checkForRequireds();
                }
            })
            .error(function (data, status, headers, config) {
                if (status === 403) {
                    SMAAlertFactory.CreateInfoAlert("Alert", "You do not have access to this form.", function () {
                        window.location.hash = "#/selectForm";
                    });
                }
            });
        }


        function isPSSADifferent(oldPSSA, newPSSA) {
            if (oldPSSA && newPSSA) {
                for (var i in oldPSSA) {
                    for (var k in newPSSA) {
                        if (i === k) {
                            if (oldPSSA[i] !== newPSSA[k]) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                return true;
            }
            return false;
        }

        function getUpdatedSurveyData(question) {
            if (survC.isGettingNewData === true) { // make sure everything runs in order
                if (activeQuestion != question) { // skip the re-hit from the code below that clears all Options except 1
                    setTimeout(function () { // defer the next call
                        getUpdatedSurveyData(question); // recall the function
                        $scope.$apply(); // must apply because the setTimeout removes the code from the angular scope
                    });
                }
                return; // end this call here
            } else {
                activeQuestion = question; // sets the active question
            }
            //console.log(survC.preSurveySurveyQuestions);
            // remove all other options for current selection (to avoid bad data since you could still switch it to another value)
            for (var i = question.Options.length - 1; i > -1; i--) {
                if (question.Options[i].Value !== question.SelectedOption) {
                    question.Options.splice(i, 1);
                }
            }
            survC.isGettingNewData = true;
            var dynamicVariables = {};
            for (var k in survC.preSurveySurveyQuestions) {
                if (survC.preSurveySurveyQuestions[k].SelectedOption) {
                    dynamicVariables[survC.preSurveySurveyQuestions[k].ValueVariableName.toUpperCase()] = survC.preSurveySurveyQuestions[k].SelectedOption;
                }
            }
            //var pssa = {
            //    UserID: dynamicVariables["USERID"] || $scope.AppC.ActiveUser.UserID || -1,
            //    SurveyID: dynamicVariables["SURVEYID"] || survC.preSurveySurveyQuestions[0].SurveyID || -1,
            //    MerchantID: dynamicVariables["MERCHANTID"] || -1,
            //    SchoolID: dynamicVariables["SCHOOLID"] || -1,
            //    ClassID: dynamicVariables["CLASSID"] || dynamicVariables["SUBJECTID"] || -1,
            //    GradeID: dynamicVariables["GRADEID"] || -1,
            //    TeacherID: dynamicVariables["TEACHERID"] || -1,
            //    StudentID: dynamicVariables["STUDENTID"] || -1
            //};
            var pssa = {
                UserID: dynamicVariables.USERID || $scope.AppC.ActiveUser.UserID || -1,
                SurveyID: dynamicVariables.SURVEYID || survC.preSurveySurveyQuestions[0].SurveyID || -1,
                MerchantID: dynamicVariables.MERCHANTID || -1,
                SchoolID: dynamicVariables.SCHOOLID || -1,
                ClassID: dynamicVariables.CLASSID || dynamicVariables.SUBJECTID || -1,
                GradeID: dynamicVariables.GRADEID || -1,
                TeacherID: dynamicVariables.TEACHERID || -1,
                StudentID: dynamicVariables.STUDENTID || -1
            };
            // make sure we don't make the same request twice
            // this can happen when more than one question returns with only one Option in the same call
            if (isPSSADifferent(lastPSSA, pssa)) {
                lastPSSA = pssa;
                if (console.table) {
                    console.table([pssa]);
                }
                DataService.getUpdatedSurveyVariables(pssa, 'PRESURVEY')//M0014
                .success(function (data, status, headers, config) {
                    compareNewDataToExistingAndFilter(data);
                    survC.isGettingNewData = false;
                })
                .error(function (data, status, headers, config) {
                    survC.isGettingNewData = false;
                });
            } else { // no reason to do the same call again, ends here
                survC.isGettingNewData = false;
            }
        }

        function compareNewDataToExistingAndFilter(data) {
            // maintain data integrity by setting SelectedOption to be a variable
            for (var i in data) {
                data[i].SelectedOption = null;
            }
            // loop through existing data
            for (var j in survC.preSurveySurveyQuestions) {
                // we only care about the dropdowns, so ignore input types
                if (!survC.preSurveySurveyQuestions[j].InputType || survC.preSurveySurveyQuestions[j].InputType === "") {
                    // loop through new questions
                    for (var k in data) {
                        // find the right object
                        if (survC.preSurveySurveyQuestions[j].ValueVariableName === data[k].ValueVariableName) {
                            // set the selected answer
                            survC.preSurveySurveyQuestions[j].Options = [];
                            survC.preSurveySurveyQuestions[j].Options = data[k].Options;
                            if (survC.preSurveySurveyQuestions[j].Options.length === 0) {
                                var obj = {
                                    Name: "No Data Available.",
                                    Value: -1
                                };
                                survC.preSurveySurveyQuestions[j].Options.push(obj);
                            }
                        }
                    }
                }
            }
        }

        function resetPreSurveySurveyQuestionAnswers() {
            survC.preSurveySurveyQuestions = [];
            getSurveyData();
        }

        function checkForRequireds() {
            var allRequiredsSelected = true;
            //console.log(survC.preSurveySurveyQuestions);
            for (var i in survC.preSurveySurveyQuestions) {
                if (survC.preSurveySurveyQuestions[i].IsRequired === true) {
                    if (survC.preSurveySurveyQuestions[i].SelectedOption === null) {
                        allRequiredsSelected = false;
                        break;
                    }
                }
            }
            if (allRequiredsSelected === true) {
                getSurvey();
            } else {
                SMAAlertFactory.CreateInfoAlert("Alert", "You have required questions that\n" + "have not been answered");
            }
        }

        function getSurvey() {
            function getQueryString(object) {
                var returnValue = "";
                var obj1 = { // the ID or value we care about
                    Name: null,
                    Value: null
                };
                var obj2 = { // the placeholder to pass the name
                    Name: null,
                    Value: null
                };
                if (object.PlaceholderVariableName) { // check for placeholder name
                    obj2.Name = object.PlaceholderVariableName;
                    if (object.Options && object.Options.length > 0) { // ceck if we need to get the name from the original object by its value
                        for (var i in object.Options) { // loop to find the current option
                            if (object.Options[i].Value === object.SelectedOption) { // find the active option value
                                obj2.Value = encodeURIComponent(object.Options[i].Name); // get the name from the option
                                break; // all done
                            }
                        }
                    } else { // if there exists a placeholdervariablename, there should also exist options.
                        throw new Error("this should never happen."); // the only reason for placeholdervariablename is for items taht have IDs rather than text values (such as a date/time)
                    }
                }
                if (object.InputType === "datetimepicker") {
                    object.SelectedOption = new Date(object.SelectedOption).getTime(); // format the date in a better way
                }
                obj1.Name = object.ValueVariableName;
                if (object.SelectedOption || object.SelectedOption === false) { // make sure we actually have a value here
                    obj1.Value = encodeURIComponent(object.SelectedOption.toString());
                }
                if (obj1.Name && obj1.Value) {
                    returnValue = returnValue.concat("&" + obj1.Name + "=" + obj1.Value);
                }
                if (obj2.Name && obj2.Value) {
                    returnValue = returnValue.concat("&" + obj2.Name + "=" + obj2.Value);
                }
                //console.log(obj1);
                //console.log(obj2);
                //console.log(returnValue);
                if (returnValue && returnValue !== "") return returnValue;
                return null;
            }
            var strings = "";
            var s = "";
            for (var i in survC.preSurveySurveyQuestions) { // loop through each pre-survey question
                s = getQueryString(survC.preSurveySurveyQuestions[i]);
                //console.log(s);
                if (s && s !== "") {
                    strings = strings.concat(s);
                }
                s = "";
            }
            // add other default values
            var iFrameSourceString = DataService.getAdminPanelSurveyURL(survC.SurveyGuid, $scope.AppC.UserID, $scope.AppC.ActiveUser.SessionID);
            var otherValuesStrings = [];
            otherValuesStrings.push(strings);
            otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.CurrentDateTime + "=" + encodeURIComponent(ProjectConstants.QWRYSTRVal.CurrentDateTimeValue()));
            otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.CurrentTime + "=" + encodeURIComponent(ProjectConstants.QWRYSTRVal.CurrentTimeValue()));

            //START NILESH-TSK46
            if ($scope.AppC.ActiveUser.FirstName && $scope.AppC.ActiveUser.LastName) {
                otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.iAspireUserName + "=" + encodeURIComponent($scope.AppC.ActiveUser.FirstName + " " + $scope.AppC.ActiveUser.LastName));
            }
            //MP changes print start
            //if ($scope.AppC.ActiveUser.FirstName && $scope.AppC.ActiveUser.LastName) {
            //    otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.iAspireUserName + "=" + encodeURIComponent($scope.AppC.ActiveUser.UserName));
            //    otherValuesStrings.push("&FromUsername=" + encodeURIComponent($scope.AppC.ActiveUser.LastName + " " + $scope.AppC.ActiveUser.FirstName));
            //}
            //MP changes print end
            //START NILESH-TSK46

            //if ($scope.AppC.ActiveUser.FirstName && $scope.AppC.ActiveUser.LastName) {
            //    otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.iAspireUserName + "=" + encodeURIComponent($scope.AppC.ActiveUser.FirstName + " " + $scope.AppC.ActiveUser.LastName));
            //}
            iFrameSourceString += otherValuesStrings.join("");
            var iFrame = document.getElementById("surveyIFrame");
            iFrame.setAttribute("src", iFrameSourceString);
            // Spinner added in Continue button click - Rajib
            survC.continueClickedButton = true;
        }

        function setIFrameHeight() {
            survC.displayLoadingSpinner = false;
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
                            if (iframe.src.indexOf("ViewVote.aspx") > -1) {
                                iframe.style.height = $(iframe).contents().find("#Panel").height() + "px";
                            } else if (iframe.src.indexOf("iAspireSurveyMobile.aspx") > -1) {
                                iframe.style.height = $(iframe).contents().find("body").height() + "px";
                            }
                        }, 1);

                        var win = document.getElementsByTagName('iframe')[0].contentWindow;//G001

                        //START NIELSH-TSK67
                        //win.postMessage(JSON.stringify({ key: 'AccessID', data: localStorage.getItem('AccessID') }), "*");
                        win.postMessage(JSON.stringify({ key: 'AccessID', data: localStorage.getItem('AccessID'), frameurl: iframe.getAttribute("src") }), "*");
                        //END NIELSH-TSK67

                    }
                }, 1);
            }
            //function resize() {
            //    if (typeof (func) == "function") {
            //        func();
            //    }
            //    setTimeout(function () {
            //        if (iframe) {
            //            //iframe.style.display = "block";
            //            //var minHeight = "calc(100% - 40px)";
            //            //if (window.innerWidth >= 481 && window.innerWidth < 761) {
            //            //    minHeight = "calc(100% - 45px)";
            //            //} else if (window.innerWidth >= 761) {
            //            //    minHeight = "calc(100% - 50px)";
            //            //}
            //            //iframe.style.minHeight = minHeight;
            //            //iframe.style.height = "";
            //            //setTimeout(function () {
            //            //    iframe.style.height = iframe.contentWindow.document.body.clientHeight + "px";
            //            //});
            //            iframe.style.display = "block";
            //            setTimeout(function () {
            //                iframe.style.height = "" + iframe.parentElement.offsetHeight + "px";
            //            }, 1);
            //        }
            //    }, 1);
            //}
            var iframe = document.getElementById("surveyIFrame");
            if (iframe.getAttribute("src") !== "") {
                survC.isSurveyLoaded = true;
                survC.surveyHasPreSurveyQuestions = false;
                var func = window.onresize;
                window.onresize = resize;
                setTimeout(function () {
                    resize();
                }, 1);
                // add cleanup for when the user navigates away from the survey
                window.onhashchange = function () {
                    window.onresize = null;
                    window.onresize = func;
                };
                $scope.$apply();
            }
        }

        function toSettingsPage(event) {
            window.location.hash = "#/settings";
            //function confirmCallback(value) {
            //    if (value === true) {
            //        window.location.hash = "#/settings";
            //    }
            //    //else if (value === false) {

            //    //} else {

            //    //}
            //}
            //var iframe = document.getElementById("surveyIFrame");
            //if (!iframe.getAttribute("src") || iframe.getAttribute("src") === "") { //uhhh
            //    window.location.hash = "#/selectForm";
            //} else if (iframe.getAttribute("src").indexOf("iAspireSurveyMobile.aspx") > -1) {
            //    //function confirmCallback(value) {
            //    //    if (value === true) {
            //    //        window.location.hash = "#/settings";
            //    //    } else if (value === false) {

            //    //    } else {

            //    //    }
            //    //} //"\nAre you sure you wish to\n" + "exit this incomplete form?"
            //    SMAAlertFactory.CreateConfirmAlert("\nAre you sure you wish to\n" + "exit without saving or submitting?", null, null, null, confirmCallback);
            //}
        }

        function backToSelectionPage(event) {
            window.location.hash = "#/selectForm";
            //function confirmCallback(value) {
            //    if (value === true) {
            //        window.location.hash = "#/selectForm";
            //    }
            //    //else if (value === false) {

            //    //} else {

            //    //}
            //}
            //var iframe = document.getElementById("surveyIFrame");
            //if (!iframe.getAttribute("src") || iframe.getAttribute("src") === "") { //uhhh
            //    window.location.hash = "#/selectForm";
            //} else if (iframe.getAttribute("src").indexOf("iAspireSurveyMobile.aspx") > -1) {
            //    //function confirmCallback(value) {
            //    //    if (value === true) {
            //    //        window.location.hash = "#/selectForm";
            //    //    } else if (value === false) {

            //    //    } else {

            //    //    }
            //    //}
            //    SMAAlertFactory.CreateConfirmAlert("\nAre you sure you wish to\n" + "exit without saving or submitting?", null, null, null, confirmCallback);
            //}
        }
    }

})();