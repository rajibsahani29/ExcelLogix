(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("SelectFormController", ["DataService", "$scope", "ProjectConstants", selectFormController]);

    function selectFormController(DataService, $scope, ProjectConstants) {
        SurveyTypeGetList();
        $scope.AppC.ShowHeader = true;
        $scope.AppC.ShowFooter = true;
        $scope.AppC.ActivePageName = "Select Form";
        /*jshint validthis:true */
        var sFC = this;
        sFC.SurveyList = [];
        sFC.TESurveyList = [];
        sFC.SESurveyList = [];
        sFC.SurveyList = [];
        sFC.SurveyTypeList = [];
        sFC.DynamicSurveyList = [];
        sFC.BSurveyList = [];
        sFC.BDynamicSurveyList = [];
        // use these for loading spinners
        sFC.SurveyListShowSpinner = null;
        sFC.TESurveyListShowSpinner = null; // Teacher Evaluation
        sFC.SESurveyListShowSpinner = null; // Special Education
        sFC.TESurveyType = null;
        sFC.SESurveyType = null;
        sFC.FilterForm = null;
        sFC.ifSearchbtn = false;


        sFC.toSurveyPage = toSurveyPage;
        
        // get surveys
        if ($scope.AppC.IsTrialVersion === true) {
            getSurveyListForUser();
        } else {
            //getTESurveyListForUser();
            //getSESurveyListForUser();
        }
        if ($scope.AppC.Merchant.MerchantID === "22181e79-90cf-4a9c-b354-5785a3552fa8") {
            sFC.ifSearchbtn = true;
        }

        // show spinners after 0.4 seconds
        setTimeout(function () {
            if (sFC.SurveyList.length < 1 && sFC.SurveyListShowSpinner !== false) {
                sFC.SurveyListShowSpinner = true;
            }
            if (sFC.TESurveyList.length < 1 && sFC.TESurveyListShowSpinner !== false) {
                sFC.TESurveyListShowSpinner = true;
            }
            if (sFC.SESurveyList.length < 1 && sFC.SESurveyListShowSpinner !== false) {
                sFC.SESurveyListShowSpinner = true;
            }
            $scope.$apply();
        }, ProjectConstants.Integers.LoadDelayTime);

        //---------------Business---------------
        return sFC;

        function getSurveyListForUser() {
            DataService.getSurveys()
            .success(function (data, status, headers, config) {               
                sFC.BSurveyList = data.filter(function (e) {
                    return e.Archive == false;
                });;

                sFC.SurveyListShowSpinner = false;
            })
            .error(function (data, status, headers, config) {
                sFC.SurveyListShowSpinner = false;
            });
        }

        //function getTESurveyListForUser() {
        //    DataService.getTESurveyListForUser()
        //    .success(function (data, status, headers, config) {
        //        sFC.TESurveyList = data.filter(function (e) {
        //            return e.Archive == false;
        //        });;
        //        if (sFC.TESurveyList.length > 0) {
        //            $scope.show = true;
        //        }
        //        sFC.TESurveyListShowSpinner = false;
        //    })
        //    .error(function (data, status, headers, config) {
        //        sFC.TESurveyListShowSpinner = false;
        //    });
        //}

        //function getSESurveyListForUser() {
        //    DataService.getSESurveyListForUser()
        //    .success(function (data, status, headers, config) {
        //        sFC.SESurveyList = data.filter(function (e) {
        //            return e.Archive == false;
        //        });
        //        if (sFC.SESurveyList.length > 0) {
        //            $scope.show = true;
        //        }
        //        sFC.SESurveyListShowSpinner = false;
        //    })
        //    .error(function (data, status, headers, config) {
        //        sFC.SESurveyListShowSpinner = false;
        //    });
        //}
        //----------------Business-------------------
          function getListByName(listID, listName, listTitle, index) {
                DataService.getSurveyListByListName(listID).then(
                    function (response) {
                        response.data=response.data.filter(function (e) {
                            return e.Archive == false && e.Title != 'High Five a Teammate!';
                        })
                        if ($scope.AppC.IsTrialVersion === true) {
                            for (var i = 0, len = response.data.length; i < len; i++) {
                                sFC.BSurveyList.push(response.data[i]);
                                if (sFC.BSurveyList.length > 0) {
                                    $scope.show = false;
                                }
                            }
                            sFC.SurveyListShowSpinner = false;
                        } else {
                            sFC.BDynamicSurveyList[index].IsLoading = false;
                            //START NILESH
                            if (response.data && response.data.length > 0 && response.data[0].SurveyTypeDisplayName != undefined && response.data[0].SurveyTypeDisplayName != "") {
                                sFC.BDynamicSurveyList[index].ListTitle = response.data[0].SurveyTypeDisplayName;
                            }
                            else {
                                sFC.BDynamicSurveyList[index].ListTitle = listTitle;
                            }
                            //END NILESH
                            sFC.BDynamicSurveyList[index].ListName = listName,
                            sFC.BDynamicSurveyList[index].Forms = response.data || []
                        }
                    },
                    function () {
                        sFC.BDynamicSurveyList[index].IsLoading = false;
                        sFC.SurveyListShowSpinner = false;
                    }
                );
            }

          function SurveyTypeGetList() {
                var merchantData = JSON.parse(localStorage.getItem("MerchantData"));
                DataService.surveyTypeGetList(merchantData.MerchantID).then(function (res) {
                    sFC.SurveyTypeList = res.data;
                    for (var i in sFC.SurveyTypeList) {
                        getListByName(sFC.SurveyTypeList[i].SurveyTypeID, sFC.SurveyTypeList[i].SurveyTypeName, sFC.SurveyTypeList[i].SurveyTypeTitle, i);
                        sFC.BDynamicSurveyList[i] = {
                            IsLoading: true
                        };
                    }
                })
            }

        function toSurveyPage(event, surveyID, surveyGuid) {
            window.location.hash = "#/survey/" + surveyID + "/" + surveyGuid;
        }
        if (sFC.TESurveyList.length > 0 || sFC.SESurveyList.length > 0) {
            $scope.show = true;
        }
        if( sFC.BSurveyList.length==0)
        {
            $scope.show = false;
        }         
        
    }

})();