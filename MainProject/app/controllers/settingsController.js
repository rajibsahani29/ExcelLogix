(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("SettingsController", ["DataService", "$scope", "$rootScope", "SMAAlertFactory", settingsController]);
    //M0029                        08/03/2018           Gimesh        Added Default From Date on Settings form.
	//M0030                        15/03/2018           Gimesh        Distribution set Visible only for Jostens login in Settings form.
	//M0035                       28/03/2018             Gimesh       Remove Last week.. And days 9 from Settings Add "From Date" from database level
    function settingsController(DataService, $scope, $rootScope, SMAAlertFactory) {

        var three = localStorage.getItem("ReportingSettings_CollapseComments");
        var four = localStorage.getItem("ReportingSettings_DataFormat");
        var five = localStorage.getItem("ReportingSettings_DataType");
        var six = localStorage.getItem("ReportingSettings_DateRangeDate");//M0029

        $scope.AppC.ShowHeader = true;
        $scope.AppC.ShowFooter = true;
        $scope.AppC.ActivePageName = "Settings";		
        /*jshint validthis:true */
        var setC = this;
        checkpart();
        getSurveyEmailCheckStatus();
        setC.TESurveyList = [];
        setC.SESurveyList = [];
		setC.EmailHide = $scope.$parent.AppC.Merchant.MerchantID;
        if (three) {
            setC.ReportingSettings_CollapseComments = JSON.parse(three);
        }
        else {
            setC.ReportingSettings_CollapseComments = "false";
        }
        if (four) {
            setC.ReportingSettings_DataFormat = four;
        } else {
            setC.ReportingSettings_DataFormat = 'Totals';
        }
        if (five) {
            setC.ReportingSettings_DataType = five;
        } else {
            setC.ReportingSettings_DataType = 'Frequency';
        }
        if (six) {
            setC.ReportingSettings_DateRangeDate = moment(six).format('YYYY-MM-DD');//M0029
        } else {
             GetFromDateUserSettings();//M0035
        }


        setC.logout = logout;        
        setC.SetEmailStatus = SetEmailStatus;

        var NotBtnDiv = document.getElementsByName("NotificationButtonContainer");
        var NotBtn = document.getElementsByName("btnnotificatiion");
        //$(NotBtn).hide();
        //if ($scope.AppC.ActiveUser.UserID == '43') {
        //    $(NotBtn).show();
        //}
        $(NotBtn).remove();
        if ($scope.AppC.ActiveUser.UserID == '43' || $scope.AppC.ActiveUser.UserID == '16170') {
            var notfi = '<div> <button name="btnnotificatiion" onclick="window.location.hash = \'#/notifications\';">Notification</button></div>'
            $(NotBtnDiv).append($(notfi));
        }

        $scope.$watch("setC.ReportingSettings_DateRangeDate", function (newValue, oldValue) {//M0029
            if (newValue && newValue !== oldValue) {
                localStorage.setItem("ReportingSettings_DateRangeDate", JSON.stringify(setC.ReportingSettings_DateRangeDate));
				SetFromDateUserSettings();//M0035
            }
        });
        $scope.$watch("setC.ReportingSettings_CollapseComments", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                localStorage.setItem("ReportingSettings_CollapseComments", JSON.stringify(setC.ReportingSettings_CollapseComments));
            }
        });
        $scope.$watch("setC.ReportingSettings_DataFormat", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                localStorage.setItem("ReportingSettings_DataFormat", setC.ReportingSettings_DataFormat);
            }
        });
        $scope.$watch("setC.ReportingSettings_DataType", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                localStorage.setItem("ReportingSettings_DataType", setC.ReportingSettings_DataType);
            }
        });

        //console.log($scope);

        setC.MakeSupportPopup = makeSupportPopup;

        function checkpart() {
            getTESurveyListForUser();
            getSESurveyListForUser();
        }
        //return setC;

        //START NILESH-TSK29
        function makeSupportPopup() {
            var wrapper = document.createElement("div");
            wrapper.style = "background:url(assets/images/circle_spinner.png) center center no-repeat;background-size:35px;";
            var iFrame = document.createElement("iframe");
            iFrame.src = "https://forms.zohopublic.com/eric22/form/ZohoDeskHelpTicketCreator/formperma/B00022b1jhg5Ah59kh5J7a0A7";
            iFrame.frameBorder = 0;
            iFrame.style = "height:500px;width:500px;border:none;";
            wrapper.appendChild(iFrame);
            var alert = SMAAlertFactory.CreateCustomAlert(wrapper, "What can we help you with today?");
        }
        function makeSupportPopup_old() {
            var wrapper = document.createElement("div");

            var helpTextLabel = document.createElement("label");
            wrapper.appendChild(helpTextLabel);

            var summary = document.createElement("input");
            summary.type = "text";
            summary.placeholder = "Summary";
            wrapper.appendChild(summary);

            wrapper.appendChild(document.createElement("br"));
            wrapper.appendChild(document.createElement("br"));

            var textArea = document.createElement("textarea");
            textArea.placeholder = "Description";
            textArea.style.minWidth = "250px";
            textArea.style.minHeight = "100px";
            wrapper.appendChild(textArea);

            wrapper.appendChild(document.createElement("br"));
            wrapper.appendChild(document.createElement("br"));

            var button = document.createElement("button");
            button.type = "button";
            button.classList.add("blueButton");
            button.innerHTML = "Submit";
            button.style.marginBottom = "10px";
            wrapper.appendChild(button);



            var alert = SMAAlertFactory.CreateCustomAlert(wrapper, "What can we help you with today?");

            button.onclick = function () {
                button.disabled = true;
                summary.style.display = "none";
                textArea.style.display = "none";
                helpTextLabel.innerHTML = "Sending data...";
                DataService.support.createApptivoCase(summary.value, textArea.value).then(
                    function (response) { // success
                        console.log(response);
                        SMAAlertFactory.CreateInfoAlert("Success!", "Your feedback has been submitted.");
                        alert.resolve();
                    },
                    function (response) { // error
                        console.error(response);
                        SMAAlertFactory.CreateInfoAlert("Ooops!", "Something went wrong.");
                        alert.resolve();
                    }
                );
                //DataService.support.getApptivoCustomer($scope.$parent.AppC.Merchant.CustomerID).then(
                //    function (response) { // success
                //        if (response.data.countOfRecords > 0) {
                //            var caseObject = getCaseObject(summary.value, textArea.value, response.data.data[0].customerId, response.data.data[0].customerName, $scope.$parent.AppC.ActiveUser.UserName);
                //            console.log(caseObject);
                //            //DataService.support.createApptivoCase(caseObject).then(
                //            //    function (response) { // case created
                //            //        console.log(response);
                //            //        SMAAlertFactory.CreateInfoAlert("Success!", "Your feedback has been submitted.");
                //            //        alert.resolve();
                //            //    },
                //            //    function (response) { // case failed to create?
                //            //        console.log(response);
                //            //    }
                //            //);
                //        } else { // cutomerID is wrong or is not set up correctly

                //        }
                //    },
                //    function (response) { // error
                //        console.log(response);
                //    }
                //);
            };

        }
        //END NILESH-TSK29
        function getCaseObject(caseSummary, caseDescription, caseCustomerID, caseCustomerName, submittedByEmail) {
            return {
                "caseNumber": "Auto generated number", // required
                "caseStatus": "New", // required
                "caseStatusId": "14511144", // required
                "caseType": "Technical Issue", // required
                "caseTypeId": "14511151", // required
                "casePriority": "Medium", // required
                "casePriorityId": "14511143", // required
                "assignedObjectRefName": "Eric Bransteter",
                "assignedObjectId": 8,
                "assignedObjectRefId": 47094,
                "caseSummary": caseSummary || "No summary Entered", // required
                "description": caseDescription || "No description entered",
                "followUpDate": null,
                "followUpDescription": null,
                "caseItem": "",
                "caseItemId": null,
                "needByDate": "",
                "caseProject": "",
                "caseProjectId": null,
                "dateResolved": "",
                "createdByName": "",
                "lastUpdatedByName": "",
                "creationDate": "",
                "lastUpdateDate": "",
                "caseCustomer": caseCustomerName || "",
                "caseCustomerId": caseCustomerID || null,
                "caseContact": "",
                "caseContactId": null,
                "caseEmail": submittedByEmail || "",
                "addresses": [],
                "customAttributes": [],
                "createdBy": null
            };
        }

        function constructListObject() {
            setC.ReportingSettings_DateRangeOptions.push({
                Name: "Days",
                ID: "Day"
            });
            setC.ReportingSettings_DateRangeOptions.push({
                Name: "Weeks",
                ID: "Week"
            });
            setC.ReportingSettings_DateRangeOptions.push({
                Name: "Months",
                ID: "Month"
            });
            setC.ReportingSettings_DateRangeOptions.push({
                Name: "Quarters",
                ID: "Quarter"
            });
            setC.ReportingSettings_DateRangeOptions.push({
                Name: "Years",
                ID: "Year"
            });
            //setC.BooleanObject.push({
            //    Name: "No",
            //    ID: false
            //});
            //setC.BooleanObject.push({
            //    Name: "Yes",
            //    ID: true
            //});
        }
    
        function getTESurveyListForUser() {
            DataService.getTESurveyListForUser()
            .success(function (data, status, headers, config) {
                setC.TESurveyList = data;
                if (setC.TESurveyList.length <= 0) {
                    businessrpt();
                }
                else
                {
                    $scope.businessrpt = false;
                }
            })
        }

        function getSESurveyListForUser() {
            DataService.getSESurveyListForUser()
            .success(function (data, status, headers, config) {
                setC.SESurveyList = data;
                if (setC.SESurveyList.length <= 0) {
                    businessrpt();
                }
                else {
                    $scope.businessrpt = false;
                }
            })
        }
    function businessrpt() {
            if (localStorage.getItem('userID') == '12683') {//M0030
                if ((setC.TESurveyList.length < 0 && setC.SESurveyList.length > 0) || (setC.TESurveyList.length > 0 && setC.SESurveyList.length < 0) || (setC.TESurveyList.length <= 0 && setC.SESurveyList.length <= 0)) {
                    $scope.businessrpt = true;
                } else { $scope.businessrpt = false; }
            } else { $scope.businessrpt = false;}
        }
        function SetEmailStatus() {            
            var AddEmailstats = {
                UserID:$scope.AppC.ActiveUser.UserID,
                MerchantID: $scope.AppC.Merchant.MerchantID,
                Checkbox_Status: setC.Emailstat
            }
            DataService.AddSurveyEmailStatus(AddEmailstats).success(function (response) {
                var v = response;
            }).error(function (err) {
            })
        }
        function getSurveyEmailCheckStatus() {
            var userid = localStorage.getItem("USerID");
            DataService.GetSurveyEmailStatus(userid).success(function (response) {
                setC.Emailstat = response;
            }).error(function (err) {

            })
        }
        $rootScope.$on('CallParentMethod', function (event, args) {
            logout()
        });
        function logout() {
            function confirmCallback(val) {
                if (val === true) {
                    DataService.userLogout()
                    .success(function (data, status, headers, config) {
                        $scope.AppC.ActiveUser.UserID = null;
                        $rootScope.ID = null;
                    })
                    .error(function (data, status, headers, config) {
                        // we don't really care if it failed... the user clicked logout
                        $scope.AppC.ActiveUser.UserID = null;
                        $rootScope.ID = null;
                    });
                }
                //else if (val === false) {

                //} else {

                //}
            }
            SMAAlertFactory.CreateConfirmAlert("Are you sure you want to log out?", null, null, null, confirmCallback);
        }
		
		        //M0035 Start
        function GetFromDateUserSettings() {
            var userid = localStorage.getItem("USerID");
            DataService.GetUserSettings(userid).success(function (data) {
                if (data != null && data.UserID > 0) {
                    setC.ReportingSettings_DateRangeDate = moment(data.FromDate).format('YYYY-MM-DD');
                }
                else { setC.ReportingSettings_DateRangeDate = moment().endOf('day').format('YYYY-MM-DD'); }
            }).error(function (err) {

            })
        }

        function SetFromDateUserSettings() {
            var objSurveyUserSettings = {
                UserID: $scope.AppC.ActiveUser.UserID,
                MerchantID: $scope.AppC.Merchant.MerchantID,
                FromDate: setC.ReportingSettings_DateRangeDate
            }
            DataService.SetUserSettings(objSurveyUserSettings).success(function (response) {
                var v = response;
            }).error(function (err) {
            })
        }
        //M0035 End
    }

})();