(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .directive("iframeOnloaddash", iframeOnloaddash)
        .controller("DashboardSurveyController", ["DataService", "$scope", "SMAAlertFactory", "$routeParams", "ProjectConstants", DashboardSurveyController]);

    function iframeOnloaddash() {
        return {
            scope: {
                callBack: "&iframeOnloaddash"
            },
            link: function (scope, element, attrs) {
                element.on("load", function () {
                    return scope.callBack();
                });
            }
        };
    }

    function DashboardSurveyController(DataService, $scope, SMAAlertFactory, $routeParams, ProjectConstants) {

        $scope.AppC.ShowHeader = true;
        $scope.AppC.ShowFooter = true;
        $scope.AppC.ActivePageName = "Form";

        /*jshint validthis:true */
        var dashsC = this;

        dashsC.AnimationClass = "pageTransitionAnimation";

        dashsC.SurveyID = $routeParams.SurveyID;
        dashsC.SurveyGuid = $routeParams.SurveyGuid;
        dashsC.TeacherName = $routeParams.TeacherName;
        dashsC.TeacherID = $routeParams.TeacherID;
        dashsC.EventID = $routeParams.EventID;
        dashsC.isSurveyLoaded = false;
        dashsC.surveyHasPreSurveyQuestions = false;
        dashsC.displayLoadingSpinner = null;

        dashsC.preSurveySurveyQuestions = [];
        dashsC.getUpdatedSurveyData = getUpdatedSurveyData;
        dashsC.resetPreSurveySurveyQuestionAnswers = resetPreSurveySurveyQuestionAnswers;
        dashsC.isGettingNewData = false;

        dashsC.iframeLoadedCallback = setIFrameHeight;

        getSurveyData();
        getSurvey();//G001
        window.document.getElementsByTagName('iframe')[0].addEventListener(ProjectConstants.Events.SurveyComplete, function (e) {
            setTimeout(function () {
                window.location.hash = "#selectForm";
            }, 3000);
        });

        dashsC.getSurvey = checkForRequireds;

        dashsC.backToSelectionPage = backToSelectionPage;
        dashsC.toSettingsPage = toSettingsPage;

        setTimeout(function () {
            if (dashsC.displayLoadingSpinner !== false) {
                dashsC.displayLoadingSpinner = true;
            }
            $scope.$apply();
        }, ProjectConstants.Integers.LoadDelayTime);



        // this is set to whatever the current httprequest is based on
        // (last item changed, by pre-survey-survey-question display order)
        var activeQuestion = null;
        var lastPSSA = null;



        return dashsC;

        // backend

        function getSurveyData() {
            var pssa = {
                UserID: $scope.AppC.ActiveUser.UserID || -1,
                SurveyID: dashsC.SurveyID || -1,
                MerchantID: -1,
                SchoolID: -1,
                ClassID: -1,
                GradeID: -1,
                TeacherID: -1,
                StudentID: -1
            };
            DataService.getUpdatedSurveyVariables(pssa, 'PRESURVEY')//M0014
            .success(function (data, status, headers, config) {
                console.log(data);
                if (data.length && data.length > 0) {
                    dashsC.displayLoadingSpinner = false;
                    dashsC.surveyHasPreSurveyQuestions = true;
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
                    dashsC.preSurveySurveyQuestions = data;
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
            if (dashsC.isGettingNewData === true) { // make sure everything runs in order
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
            //console.log(dashsC.preSurveySurveyQuestions);
            // remove all other options for current selection (to avoid bad data since you could still switch it to another value)
            for (var i = question.Options.length - 1; i > -1; i--) {
                if (question.Options[i].Value !== question.SelectedOption) {
                    question.Options.splice(i, 1);
                }
            }
            dashsC.isGettingNewData = true;
            var dynamicVariables = {};
            for (var k in dashsC.preSurveySurveyQuestions) {
                if (dashsC.preSurveySurveyQuestions[k].SelectedOption) {
                    dynamicVariables[dashsC.preSurveySurveyQuestions[k].ValueVariableName.toUpperCase()] = dashsC.preSurveySurveyQuestions[k].SelectedOption;
                }
            }
            //var pssa = {
            //    UserID: dynamicVariables["USERID"] || $scope.AppC.ActiveUser.UserID || -1,
            //    SurveyID: dynamicVariables["SURVEYID"] || dashsC.preSurveySurveyQuestions[0].SurveyID || -1,
            //    MerchantID: dynamicVariables["MERCHANTID"] || -1,
            //    SchoolID: dynamicVariables["SCHOOLID"] || -1,
            //    ClassID: dynamicVariables["CLASSID"] || dynamicVariables["SUBJECTID"] || -1,
            //    GradeID: dynamicVariables["GRADEID"] || -1,
            //    TeacherID: dynamicVariables["TEACHERID"] || -1,
            //    StudentID: dynamicVariables["STUDENTID"] || -1
            //};
            var pssa = {
                UserID: dynamicVariables.USERID || $scope.AppC.ActiveUser.UserID || -1,
                SurveyID: dynamicVariables.SURVEYID || dashsC.preSurveySurveyQuestions[0].SurveyID || -1,
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
                    dashsC.isGettingNewData = false;
                })
                .error(function (data, status, headers, config) {
                    dashsC.isGettingNewData = false;
                });
            } else { // no reason to do the same call again, ends here
                dashsC.isGettingNewData = false;
            }
        }

        function compareNewDataToExistingAndFilter(data) {
            // maintain data integrity by setting SelectedOption to be a variable
            for (var i in data) {
                data[i].SelectedOption = null;
            }
            // loop through existing data
            for (var j in dashsC.preSurveySurveyQuestions) {
                // we only care about the dropdowns, so ignore input types
                if (!dashsC.preSurveySurveyQuestions[j].InputType || dashsC.preSurveySurveyQuestions[j].InputType === "") {
                    // loop through new questions
                    for (var k in data) {
                        // find the right object
                        if (dashsC.preSurveySurveyQuestions[j].ValueVariableName === data[k].ValueVariableName) {
                            // set the selected answer
                            dashsC.preSurveySurveyQuestions[j].Options = [];
                            dashsC.preSurveySurveyQuestions[j].Options = data[k].Options;
                            if (dashsC.preSurveySurveyQuestions[j].Options.length === 0) {
                                var obj = {
                                    Name: "No Data Available.",
                                    Value: -1
                                };
                                dashsC.preSurveySurveyQuestions[j].Options.push(obj);
                            }
                        }
                    }
                }
            }
        }

        function resetPreSurveySurveyQuestionAnswers() {
            dashsC.preSurveySurveyQuestions = [];
            getSurveyData();
        }

        function checkForRequireds() {
            var allRequiredsSelected = true;
            //console.log(dashsC.preSurveySurveyQuestions);
            for (var i in dashsC.preSurveySurveyQuestions) {
                if (dashsC.preSurveySurveyQuestions[i].IsRequired === true) {
                    if (dashsC.preSurveySurveyQuestions[i].SelectedOption === null) {
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
            for (var i in dashsC.preSurveySurveyQuestions) { // loop through each pre-survey question
                s = getQueryString(dashsC.preSurveySurveyQuestions[i]);
                //console.log(s);
                if (s && s !== "") {
                    strings = strings.concat(s);
                }
                s = "";
            }
            // add other default values
            var iFrameSourceString = DataService.getAdminPanelSurveyURL(dashsC.SurveyGuid, $scope.AppC.UserID, $scope.AppC.ActiveUser.SessionID);
            var otherValuesStrings = [];
            otherValuesStrings.push(strings);
            otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.CurrentDateTime + "=" + encodeURIComponent(ProjectConstants.QWRYSTRVal.CurrentDateTimeValue()));
            otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.CurrentTime + "=" + encodeURIComponent(ProjectConstants.QWRYSTRVal.CurrentTimeValue()));

            //START NILESH-TSK46
            if ($scope.AppC.ActiveUser.FirstName && $scope.AppC.ActiveUser.LastName) {
                otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.iAspireUserName + "=" + encodeURIComponent($scope.AppC.ActiveUser.FirstName + " " + $scope.AppC.ActiveUser.LastName));
            }
            if (dashsC.TeacherName && dashsC.TeacherID && dashsC.EventID) {
                otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.EmployeeName + "=" + encodeURIComponent(dashsC.TeacherName))
                otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.EmployeeID + "=" + encodeURIComponent(dashsC.TeacherID))
                otherValuesStrings.push("&" + ProjectConstants.QWRYSTR.EventID + "=" + encodeURIComponent(dashsC.EventID))
            } 
            
            iFrameSourceString += otherValuesStrings.join("");
            var iFrame = document.getElementById("surveyIFrame");
            iFrame.setAttribute("src", iFrameSourceString);
            // Spinner added in Continue button click - Rajib
            dashsC.continueClickedButton = true;
        }

        function setIFrameHeight() {
            dashsC.displayLoadingSpinner = false;
            function resize() {
                if (typeof (func) == "function") {
                    func();
                }
                setTimeout(function () {
                    if (iframe) {
                       

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
                        win.postMessage(JSON.stringify({ key: 'AccessID', data: localStorage.getItem('AccessID') }), "*");

                    }
                }, 1);
            }
            
            var iframe = document.getElementById("surveyIFrame");
            if (iframe.getAttribute("src") !== "") {
                dashsC.isSurveyLoaded = true;
                dashsC.surveyHasPreSurveyQuestions = false;
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
        }

        function backToSelectionPage(event) {
            window.location.hash = "#/selection";
        }
    }

})();