(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("MobileViewController", ["DataService", "$scope", "$rootScope", "SMAAlertFactory", MobileViewController]);

    function MobileViewController(DataService, $scope, $rootScope, SMAAlertFactory) {
        $scope.AppC.ShowHeader = false;
        $scope.AppC.ShowFooter = false;
        $scope.AppC.ActivePageName = "Select";
        var sc = this;
       // checkpart();
        ChecMerchantType();
        // functions
        //sc.Logout = logout;
        sc.TESurveyList = [];
        sc.SESurveyList = [];
        sc.SurveyList = [];        
        sc.BDynamicSurveyList = [];
        sc.BSurveyList = [];
        sc.SurveyFormType = [];
        sc.HighFiveSurveyID = null;
        sc.HighFiveSurveyGUID = null;
        sc.getSurveyList = getSurveyList;
        sc.getVotesList = getVotesList;
        sc.toSurveyPage = toSurveyPage;
        sc.MakeSupportPopup = makeSupportPopup;
        
        // data
        sc.surveys = [];
        sc.teachers = [];
        $(".xdsoft_").remove(); // clear all of the datetimepickers hiding in the html

        var keys = [];
        var correctCode = [
            38, 38,
            40, 40,
            37, 39,
            37, 39,
            66, 65
        ];
        var div = document.getElementsByClassName('iAspireLogo')[0];
        document.body.addEventListener("keydown", konami, false);
        function checkpart() {
            getTESurveyListForUser();
            getSESurveyListForUser();
        }
        return sc;

        //function getSurveyListForUser() {
        //    DataService.getSurveys()
        //    .success(function (data, status, headers, config) {
        //        sc.SurveyList = data;                
        //        businessrpt();
        //    })            
        //}

        function getTESurveyListForUser() {
            DataService.getTESurveyListForUser()
            .success(function (data, status, headers, config) {
                sc.TESurveyList = data;
                if (sc.TESurveyList.length > 0) {
                    educationrpt();
                }
                else {
                    businessrpt();
                }

            })
        }

        function getSESurveyListForUser() {
            DataService.getSESurveyListForUser()
            .success(function (data, status, headers, config) {
                sc.SESurveyList = data;
                if (sc.SESurveyList.length > 0) {
                    educationrpt();
                }
                else {
                    businessrpt();
                }
            })
        }
        function educationrpt() {
            if (sc.TESurveyList.length > 0 || sc.SESurveyList.length > 0) {
                //alert("Education")
                $scope.eductnrpt = true;
                $scope.businessrpt = false;
            }
        }

        function businessrpt() {
            if ((sc.TESurveyList.length < 0 && sc.SESurveyList.length > 0) || (sc.TESurveyList.length > 0 && sc.SESurveyList.length < 0) || (sc.TESurveyList.length <= 0 && sc.SESurveyList.length <= 0)) {
                //alert("Business")
                $scope.businessrpt = true;
                $scope.eductnrpt = false;
            }
        }
        // backend

        function konami(e) {
            var div = document.getElementsByClassName('PositioningContainer')[0];
            if (div) {
                var isCorrect = true;
                if (keys.length > 10) {
                    keys.shift();
                } else if (keys.length > 10) {
                    isCorrect = false;
                }
                keys.push(e.keyCode);
                for (var i in keys) {
                    for (var k in correctCode) {
                        if (i === k) {
                            if (keys[i] !== correctCode[k]) {
                                isCorrect = false;
                            }
                        }
                    }
                }
                if (isCorrect === true && keys.length === 10) {
                    $(div).addClass("Spin");
                }
            }
        }

        function getSurveyList(teacherID, surveyGuid, forceReload) {
            if (forceReload !== true) {
                forceReload = false;
            }
            function makeLine(obj) {
                var line = document.createElement("div");
                line.classList.add("SurveyRow");
                line.onclick = function () {
                    SMAAlertFactory.RemoveAllAlerts();
                    window.location.hash = "#/survey/" + obj.SurveyID + "/" + obj.SurveyGuid;
                };

                var text = document.createElement("label");
                text.textContent = obj.Title;
                text.classList.add("SurveyText");

                line.appendChild(text);
                return line;
            }
            if (sc.surveys.length < 1 || forceReload === true) {
                DataService.getSurveys()
                .success(function (data, status, headers, config) {
                    var block = document.createElement("div");
                    block.classList.add("SurveyRowWrapper");
                    sc.surveys = [];

                    data.forEach(function (obj) {
                        //if (sc.surveys.map(function (e) { return e.SurveyID }).indexOf(obj.SurveyID) === -1) {
                        sc.surveys.push(obj);
                        block.appendChild(makeLine(obj));
                        //}
                    });

                    SMAAlertFactory.CreateCustomAlert(block, "Surveys");
                })
                .error(function (data, status, headers, config) {

                });
            } else {
                var block = document.createElement("div");
                block.classList.add("SurveyRowWrapper");
                sc.surveys.forEach(function (obj) {
                    block.appendChild(makeLine(obj));
                });
                SMAAlertFactory.CreateCustomAlert(block, "Surveys");
            }
        }
        function ChecMerchantType() {
            var merchantData = JSON.parse(localStorage.getItem("MainUserData"));
            DataService.surveyTypeGetList(merchantData.MerchantID).then(function (res) {
                var SurveyTypeList = res.data;
                sc.SurveyFormType = res.data;
                if (SurveyTypeList.length > 0) {
                    $.map(SurveyTypeList, function (elem, index) {
                        if (elem.SurveyTypeID.toUpperCase() == "23385B0F-60E2-482C-B8B3-4EC217DF409E" || elem.SurveyTypeID.toUpperCase() == "9BAFFB63-2177-424D-9B8F-C1BAE984B0F0" ||
                            elem.SurveyTypeID.toUpperCase() == "E8F029C9-399C-4137-A66B-E05C5F923CE2") {
                            $rootScope.headrval = "Business";
                            $rootScope.businessrpt = true;
                            $rootScope.eductnrpt = false;
                            getListOfAllSurvey(merchantData);
                        }
                        if (elem.SurveyTypeID.toUpperCase() == "55DFE451-6BF3-484B-950D-1384E20EF3B6" || elem.SurveyTypeID.toUpperCase() == "222B448D-E08A-43B6-B70F-7A19867336EA" ||
                            elem.SurveyTypeID.toUpperCase() == "B58916CE-CD62-4036-937D-8308B8568A6D") {
                            $rootScope.headrval = "Education";
                            $rootScope.eductnrpt = true;
                            $rootScope.businessrpt = false;
                            getListOfAllSurvey(merchantData);
                        }
                    })                    
                }
                else {
                    if (merchantData.MerchantType == "business") {
                        $rootScope.headrval = "Business";
                        $rootScope.businessrpt = true;
                        $rootScope.eductnrpt = false;
                        getListOfAllSurvey(merchantData);
                    }
                    if (merchantData.MerchantType == "education") {
                        $rootScope.headrval = "Education";
                        $rootScope.eductnrpt = true;
                        $rootScope.businessrpt = false;
                        getListOfAllSurvey(merchantData);
                    }
                }
            });
        }
        function getVotesList() {
            function makeSurveyRow(objects) {
                var surveyRowWrapper = document.createElement("div");
                var surveyTitleLabel = document.createElement("label");
                surveyTitleLabel.textContent = objects[0].SurveyTitle;
                var voteListWrapper = document.createElement("div");
                for (var i in objects) {
                    voteListWrapper.appendChild(makeVoteRow(objects[i]));
                }
                surveyRowWrapper.appendChild(surveyTitleLabel);
                surveyRowWrapper.appendChild(voteListWrapper);
                surveyRowWrapper.style.marginBottom = "10px";
                return surveyRowWrapper;
            }
            function makeVoteRow(object) {
                var voteWrapper = document.createElement("div");
                var voteNameLabel = document.createElement("label");
                voteNameLabel.style.display = "inline-block";
                voteNameLabel.style.width = "49%";
                voteNameLabel.style.textAlign = "left";
                var lastEditLabel = document.createElement("label");
                lastEditLabel.style.display = "inline-block";
                lastEditLabel.style.width = "50%";
                lastEditLabel.style.textAlign = "right";

                voteNameLabel.textContent = object.UniqueSurveyTitle;
                var d = new Date(object.VoteDate);
                var isPM = (d.getHours() > 12);
                lastEditLabel.textContent = (d.toDateString() + " " + (d.getHours() % 12) + ":" + d.getMinutes() + (isPM ? "PM" : "AM"));
                voteWrapper.appendChild(voteNameLabel);
                voteWrapper.appendChild(lastEditLabel);
                return voteWrapper;
            }
            DataService.getVoterList('PRESURVEY')//M0014
            .success(function (data, status, headers, config) {
                console.log(data);
                var block = document.createElement("div");
                var activeSurvey = data[0].SurveyID;
                var surveyVotes = [];
                for (var i in data) { // loop through the votes
                    if (data[i].SurveyID !== activeSurvey) { // check if we've found a new survey
                        block.appendChild(makeSurveyRow(surveyVotes));
                        surveyVotes = [];
                        surveyVotes.push(data[i]);
                        activeSurvey = data[i].SurveyID;
                    } else { // add all 
                        surveyVotes.push(data[i]);
                    }
                }
                SMAAlertFactory.CreateCustomAlert(block, "Available Forms");
            })
            .error(function (data, status, headers, config) {

            });
        }
        function toSurveyPage(surveyID, surveyGuid) {
            $rootScope.rdHighFive = 1;//M0040 
            window.location.hash = "#/survey/" + surveyID + "/" + surveyGuid;
        }
        function getListOfAllSurvey(merchantData) {            
            if ($rootScope.businessrpt)
                var MerchantType = "Business";
            if ($rootScope.eductnrpt)
                MerchantType = "Education";
            DataService.GetSureyListByFormType(merchantData.MerchantID, MerchantType)
                .success(function (data, status, headers, config) {

                    sc.AllSurveyList = data.filter(function (e) {
                        return e.Archive != true;
                    });
                    localStorage.setItem("surveyform", JSON.stringify(sc.AllSurveyList));
                    for (var i in data) {
                        data[i].VoteList = [];
                        data[i].ShowVotes = false;
                        if (data[i].Title == "High Five a Teammate!") {
                            sc.HighFiveSurveyID = data[i].SurveyID;
                            sc.HighFiveSurveyGUID = data[i].SurveyGuid;
                        }
                    }                                                           
                })
                .error(function (data, status, headers, config) {

                });
        }
        function makeSupportPopup() {
            //var wrapper = document.createElement("div");
            //wrapper.style = "background:url(assets/images/circle_spinner.png) center center no-repeat;background-size:35px;";
            //var iFrame = document.createElement("iframe");
            //iFrame.src = "https://support.iaspirebusiness.com/portal/kb/iaspire-business-solutions";
            //iFrame.frameBorder = 0;
            //iFrame.style = "height:500px;width:500px;border:none;";
            //wrapper.appendChild(iFrame);
            //var alert = SMAAlertFactory.CreateCustomAlert(wrapper, "What can we help you with today?");


            // window.open('https://www.support.iaspireapp.com', '_blank');//window.open("'https://www.support.iaspireapp.com")    

            if (location.origin.indexOf('business') > -1) {
                window.open('https://support.iaspirebusiness.com/portal/kb/iaspire-business-solutions', '_blank');
            }
            else {
                window.open('https://support.iaspireapp.com/portal/kb/iaspire', '_blank');
            }



        }
    }

})();