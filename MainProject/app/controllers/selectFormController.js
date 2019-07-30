(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("SelectFormController", ["DataService", "$scope", "SMAAlertFactory","ProjectConstants", selectFormController]);

    function selectFormController(DataService, $scope, SMAAlertFactory,ProjectConstants) {
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
        sFC.toSurveyPage = toSurveyPage;
        
        // get surveys
        if ($scope.AppC.IsTrialVersion === true) {
            getSurveyListForUser();
        } else {
            //getTESurveyListForUser();
            //getSESurveyListForUser();
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

        function SurveyTypeGetList() {
            var MainUserData = JSON.parse(localStorage.getItem("MainUserData"));
              $scope.spinner = SMAAlertFactory.CreateSpinnerAlert();
              DataService.GetSureyListByFormType(MainUserData.MerchantID).then(function (res) {
                  sFC.SurveyTypeList = res.data;
                  if (sFC.SurveyTypeList.length > 0) {
                      sFC.SurveyTypeList = sFC.SurveyTypeList.filter(function (e) { return e.Archive == false; })
                      sFC.BDynamicSurveyList = sFC.SurveyTypeList;
                  }
                    $scope.spinner.resolve();
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