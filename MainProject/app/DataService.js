(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .factory("DataService", ["$http", "ProjectConstants", "$q", "$timeout", dataService]);

    function dataService($http, ProjectConstants, $q, $timeout) {

	    /*jshint validthis:true */  
        var dS = this;
        // user
        dS.validateUserLogin = validateUserLogin;
        dS.reValidateUserLogin = reValidateUserLogin;
        dS.validateAccessID = validateAccessID;
        dS.createAccount = createAccount;
        dS.userLogout = logout;
        dS.resetPassword = resetPassword;
        dS.userTeacherCheckIfUserIsTeacher = userTeacherCheckIfUserIsTeacher;
        // survey
        dS.getSurveys = getSurveysForUser;
        dS.getTESurveyListForUser = getTESurveyListForUser;
        dS.getSESurveyListForUser = getSESurveyListForUser;
        dS.getSurveyListByListName = getSurveyListByListName;
        dS.getSurvey = getSurvey;
        dS.getFullSurveyDetails = getFullSurveyDetails;
        dS.getSurveyVariables = getSurveyVariables;
        dS.getUpdatedSurveyVariables = getUpdatedSurveyVariables;
        dS.getAdminPanelSurveyURL = getAdminPanelSurveyURL;
        dS.getViewVoteURL = getViewVoteURL;
        dS.AddSurveyEmailStatus = addSurveyEmailStatus;
        dS.GetSurveyEmailStatus = getSurveyEmailStatus;
        dS.GetUserSettings = getUserSettings;//M0035
        dS.SetUserSettings = setUserSettings;//M0035
        dS.RolesGetListForUser = rolesGetListForUser;
        //START NILESH_TSK10
        dS.getPrintVoteURL = getPrintVoteURL;
        //END NILESH_TSK10
        //START NILESH-TSK16
        dS.searchUserDetailsbyName = searchUserDetailsbyName;
        dS.searchUserDetailsbyGrade = searchUserDetailsbyGrade;
        dS.searchUserDetailsbySchool = searchUserDetailsbySchool;
        dS.searchSchoolTeacherbyName = searchSchoolTeacherbyName;
        dS.searchUserDetailsbyClass = searchUserDetailsbyClass;
        dS.checkUserIsPremium = checkUserIsPremium;
        //END NILESH-TSK16
        dS.getViewVoteGuid = getViewVoteGuid;
        dS.getVoterList = getVoterList;
        dS.getVoterListAsync = getVoterListAsync;
        dS.GetSEAddinsVotesListForUser = getSEAddinsVotesListForUser;
        // roles
        dS.getUserRolesWithRights = getUserRolesWithRights;
        // teacher
        dS.getTeachersBySurvey = getTeachersBySurvey;
        dS.getTeacherbyNames = getTeacherbyNames;
        // voter
        dS.setVoterToOpen = setVoterToOpen;
        dS.setVoterToClosed = setVoterToClosed;
        dS.getVotesForSurveyBetweenRange = getVotesForSurveyBetweenRange;
        dS.DeActivateVoter = DeActivateVoter;
        // merchant
        dS.getMerchantsForUser = getMerchantsForUser;
        //
        dS.support = {};
        dS.support.createApptivoCase = iAspCreateApptivoCase;
        dS.CheckCustomPageRights = checkCustomPageRights;  //business code
        dS.surveyTypeGetList = surveyTypeGetList;
        dS.GetSureyListByFormType = GetSureyListByFormType;
        //START NILESH-TSK65
        dS.GetReportCSVData = getReportCSVData;
        //END NILESH-TSK65
        // dashboard
        dS.getDashboardData = getDashboardData;
        dS.getDashboardDataNew = getDashboardDataNew;
        dS.addDashbrdEvent = addDashbrdEvent;
        dS.getEventListbyUser = getEventListbyUser;
        dS.updateDashbrdEvent = updateDashbrdEvent;
        dS.deleteDashbrdEvent = deleteDashbrdEvent;
        dS.deleteDashbrdNotification = deleteDashbrdNotification;
        dS.getstatuslist = getstatuslist;
        dS.AddHighFiver = AddHighFiver;
        dS.gethighfiverdetails = gethighfiverdetails;
        dS.getreadreceipt = getreadreceipt;
        dS.userGetListForMerchant = userGetListForMerchant;
        dS.getCommentDetailsOfTeacher = getCommentDetailsOfTeacher;
        //
        dS.GetHighFiveForByTitle = GetHighFiveForByTitle;//M0040        
        return dS;

        // API Interface

        function getIP() {
            //return "http://192.168.1.11";
            //return "http://10.50.10.207";
            //return "http://10.50.10.64";
            //return "https://iAspire.azurewebsites.net";
            //return "http://iAspireApp.azurewebsites.net";
            //return "http://localhost:83/iAspireWebAPI";
            //return "http://10.50.10.122";
            return "http://localhost:8081";
            //return "https://104.44.135.42";

        }

        function getBaseURL() {
            var str = getIP();
            return str + (str.indexOf("azurewebsites") > -1 ? "/WebAPI/api/" : "/iAspireWebAPI/api/");
            //return str + (str.indexOf("azurewebsites") > -1 ? "/WebAPI/api/" : "/api/");
        }

        function getSurveyAdminURL() {
            var str = getIP();
            //return str + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/iAspireSurveyMobile.aspx" : "/iAspireWAPTest/iAspire/iAspireSurveyMobile.aspx");
            //return "http://localhost:4976" + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/iAspireSurveyMobile.aspx" : "/iAspire/iAspireSurveyMobile.aspx");
            return "http://localhost:8081/SurveyWAP" + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/iAspireSurveyMobile.aspx" : "/iAspire/iAspireSurveyMobile.aspx");
            //return "http://localhost:83/SurveyWAP" + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/iAspireSurveyMobile.aspx" : "/iAspire/iAspireSurveyMobile.aspx");
        }

        function getPrintableURL() {
            var str = getIP();
            //return str + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/ViewVote.aspx" : "/iAspireWAPTest/iAspire/ViewVote.aspx");
            //return "http://localhost:4976" + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/ViewVote.aspx" : "/iAspire/ViewVote.aspx");
            return "http://localhost:8081/SurveyWAP" + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/ViewVote.aspx" : "/iAspire/ViewVote.aspx");
        }

        function getPrintableURL2() {
            var str = getIP();
            //return str + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/surveymobilereport.aspx" : "/iAspireWAPTest/iAspire/surveymobilereport.aspx");
            //return "http://localhost:4976" + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/surveymobilereport.aspx" : "/iAspire/surveymobilereport.aspx");
            return "http://localhost:8081/SurveyWAP" + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/surveymobilereport.aspx" : "/iAspire/surveymobilereport.aspx");
            //return "http://localhost:83/SurveyWAP" + (str.indexOf("azurewebsites") > -1 ? "/WAP/iAspire/surveymobilereport.aspx" : "/iAspire/surveymobilereport.aspx");
        }

        // ///////
        // User //
        // ///////

        // "api/Users/Validate"
        function validateUserLogin(loginObject) {
            var url = getBaseURL() + "Users/Validate";
            //return $http.post(url, loginObject);
            return $http({
                method: "POST",
                url: url,
                headers: {
                    "X-iA-AccessID": undefined // this ensures that the accessID token is not passed for this call (which causes an error in the API)
                },
                data: loginObject
            });
        }

        function reValidateUserLogin(loginObject) {
            var url = getBaseURL() + "Users/Validate/Again";
            return $http.post(url, loginObject);
        }

        // "api/Users/Validate/{accessID}"
        function validateAccessID(accessID) {
            var url = getBaseURL() + "Users/Validate/" + accessID;
            //return $http.get(url);
            return $http({
                method: "GET",
                url: url,
                headers: {
                    "X-iA-AccessID": undefined // this ensures that the accessID token is not passed for this call (which causes an error in the API)
                }
            });
        }

        function createAccount(createAccountObject, accountType) {
            var url = getBaseURL() + "Users/CreateNew";
            return $http({
                method: "POST",
                url: url,
                headers: {
                    "X-iA-AccessID": undefined // this ensures that the accessID token is not passed for this call (which causes an error in the API)
                },
                params: {
                    "accountType": accountType
                },
                data: createAccountObject
            });
        }

        function logout() {
            var url = getBaseURL() + "Users/Logout";
            return $http.post(url);
        }

        function resetPassword(loginObject) {
            var url = getBaseURL() + "Users/Validate/Reset";
            return $http({
                method: "POST",
                url: url,
                headers: {
                    "X-iA-AccessID": undefined
                },
                data: loginObject
            });
        }

        function userTeacherCheckIfUserIsTeacher() {
            var url = getBaseURL() + "UserTeachers/Current";
            return $http.get(url);
        }

        // ////////
        // Roles //
        // ////////

        function getUserRolesWithRights() {
            var url = getBaseURL() + "Roles/Current/WithRights";
            return $http.get(url);
        }

        // /////////
        // Survey //
        // /////////

        function getSurveysForUser() {
            var url = getBaseURL() + "Surveys/CurrentUser";
            return $http.get(url);
        }

        function getTESurveyListForUser() {
            var url = getBaseURL() + "Surveys/CurrentUser/TE";
            return $http.get(url);
        }

        function getSESurveyListForUser() {
            var url = getBaseURL() + "Surveys/CurrentUser/SE";
            return $http.get(url);
        }

        function getSurveyListByListName(listName) {
            var url = getBaseURL() + "Surveys/CurrentUser/" + listName;
            return $http.get(url);
        }

        //M0040 
        function GetHighFiveForByTitle(Title) {
            var url = getBaseURL() + "Surveys/CurrentUser/HighFive/" + Title;
            return $http.get(url);
        }

        function getSurvey(surveyID) {
            var url = getBaseURL() + "Surveys/Current/" + surveyID;
            return $http.get(url);
        }

        function getSurveyVariables(surveyID, variableMode) {
            var url = getBaseURL() + "Surveys/Current/" + surveyID + "/" + variableMode + "/Variables";//M0014
            return $http.get(url);
        }

        function getUpdatedSurveyVariables(preSurveySurveyAnswersObject, variableMode) {//M0014
            var url = getBaseURL() + "Surveys/Current/Variables/" + variableMode;
            //return $http.post(url, preSurveySurveyAnswersObject, variableMode);//M0014
            return $http({
                method: "POST",
                url: url,
                data: preSurveySurveyAnswersObject,
            });
        }

        function getAdminPanelSurveyURL(surveyGuid, userID, accessID) {
            var url = getSurveyAdminURL() + "?" + ProjectConstants.QWRYSTR.SurveyID + "=" + surveyGuid + "&" + ProjectConstants.QWRYSTR.iAspireUserID + "=" + userID + "&" + ProjectConstants.QWRYSTR.iAspireSessionID + "=" + accessID + "&employeeid=&employeename=";
            return url;
        }

        function getViewVoteURL(guid) {
            var url = getPrintableURL2() + "?" + ProjectConstants.QWRYSTR.MappedParameters + "=" + guid;
            return url;
        }
        function addSurveyEmailStatus(Emailstatus) {
            var url = getBaseURL() + "Surveys/AddSurveyEmailStatus";
            return $http.post(url, Emailstatus);
        }
        function getSurveyEmailStatus(userID) {
            var url = getBaseURL() + "Surveys/GetSurveyEmailStatus/" + userID;
            return $http.get(url);
        }

        //M0035 Start
        function getUserSettings(userID) {
            var url = getBaseURL() + "Surveys/GetSurveyUserSettings/" + userID;
            return $http.get(url);
        }
        function setUserSettings(objSurveyUserSettings) {
            var url = getBaseURL() + "Surveys/AddSurveyUserSettings";
            return $http.post(url, objSurveyUserSettings);
        }
        //M0035 End

        //START NILESH_TSK10
        function getPrintVoteURL(guid, iaspireUserName) {
            var url = getPrintableURL() + "?" + ProjectConstants.QWRYSTR.MappedParameters + "=" + guid + "&" + ProjectConstants.QWRYSTR.iAspireUserName + "=" + iaspireUserName;
            return url;
        }
        //END NILESH_TSK10

        function getViewVoteGuid(voterID) {
            var url = getBaseURL() + "Surveys/Current/Summary/" + voterID;
            return $http.get(url);
        }

        function getVoterList(variableMode) {
            var url = getBaseURL() + "Users/Votes/WithTeacherAddins/" + variableMode;//M0014
            var req = {
                method: "GET",
                url: url,
                //timeout: 1000 * 60 * 2
            };
            return $http(req);
        }

        //M0014
        function getVoterListAsync(data, variableMode) {
            //var deferred = $q.defer();
            var url = getBaseURL() + "Users/Votes/WithTeacherAddins/Async/" + variableMode;
            //var url = "10.255.255.1/" + "Users/Votes/WithTeacherAddins/Async";
            var req = {
                method: "POST",
                url: url,
                data: data,
                //timeout: deferred.promise
                timeout: 1000 * 60 * 6
                //timeout: 2

            };
            //$timeout(function () {
            //    deferred.resolve();
            //}, 1);
            return $http(req);
        }

        function getSEAddinsVotesListForUser() {
            var url = getBaseURL() + "Users/Votes/SE/Addins/BySchool";
            return $http.get(url);
        }

        function getFullSurveyDetails(surveyID) {
            var url = getBaseURL() + "Surveys/FullDetails/" + surveyID;
            return $http.get(url);
        }

        //START NILESH-TSK16
        function DeActivateVoter(VoterData) {
            var url = getBaseURL() + "Voter/Current/DeActivateVoter";
            var req = {
                method: "POST",
                url: url,
                data: VoterData,
            };
            return $http(req);

        }
        function searchUserDetailsbyName(SearchTerm) {
            var url = getBaseURL() + "Users/Search/" + SearchTerm;
            return $http.get(url);
        }
        function searchEmployeeBySubjects(SearchTerm) {
            var url = getBaseURL() + "Users/Search/" + SearchTerm;
            return $http.get(url);
        }
        function searchUserDetailsbyGrade(SearchTerm) {
            var url = getBaseURL() + "Users/SearchGrade/" + SearchTerm;
            return $http.get(url);
        }
        function searchUserDetailsbySchool(SearchTerm) {
            var url = getBaseURL() + "Users/SearchSchool/byName?schoolname=" + SearchTerm;
            return $http.get(url);
        }
        function searchSchoolTeacherbyName(SearchTerm) {
            var url = getBaseURL() + "Users/SearSchoolTeacher/byName?Searchterm=" + SearchTerm;
            return $http.get(url);
        }
        function searchUserDetailsbyClass(SearchTerm) {
            var url = getBaseURL() + "Users/SearClass/byName?classname=" + SearchTerm;
            return $http.get(url);
        }
        function checkUserIsPremium() {
            var url = getBaseURL() + "Users/IsPremium";
            return $http.get(url);
        }
        //END NILESH-TSK16

        // //////////
        // Teacher //
        // //////////

        function getTeachersBySurvey(surveyID) {
            var url = getBaseURL() + "Teachers/Current/" + surveyID;
            return $http.get(url);
        }
        function getTeacherbyNames(term) {
            var url = getBaseURL() + "Users/Search/" + term;
            return $http.get(url);
        }
        // ////////
        // Voter //
        // ////////

        function setVoterToOpen(voterID) {
            var url = getBaseURL() + "Voter/Current/SetOpen/" + voterID;
            return $http.post(url);
        }

        function setVoterToClosed(voterID) {
            var url = getBaseURL() + "Voter/Current/SetClosed/" + voterID;
            return $http.post(url);
        }

        function getVotesForSurveyBetweenRange(surveyID, startDate, endDate) {
            // we're going to ignore the start date and end date here, because the voter date could potentially be wrong... 
            //  so we need to return every possible result and let the app handle the date filtering
            //var url = getBaseURL() + "Voter/Current/FullPivot" + "?surveyID=" + surveyID + "&startDate=" + startDate + "&endDate=" + endDate;
            //var newStartDate = encodeURIComponent(moment().year(2000).format('LLL'));
            var newStartDate = encodeURIComponent(moment(startDate).format('LLL'));
            //var newStartDate = moment().subtract(1, "year").format();
            //var newEndDate = encodeURIComponent(moment().format('LLL'));
            var newEndDate = encodeURIComponent(moment(endDate).format('LLL'));
            var url = getBaseURL() + "Voter/Current/FullPivot" + "?surveyID=" + surveyID + "&startDate=" + newStartDate + "&endDate=" + newEndDate;
            //var url = getBaseURL() + "Voter/FullPivot" + "/" + surveyID + "/" + startDate + "/" + endDate + "/" + "/";
            //return $http.get(url);
            return $http.get(url, { timeout: 2 * 60 * 60 * 1000 });
        }

        // ///////////
        // Merchant //
        // ///////////

        function getMerchantsForUser() {
            var url = getBaseURL() + "Merchant/Current";
            return $http.get(url);
        }

        ///////////////////////
        // Support API calls //
        ///////////////////////

        function iAspCreateApptivoCase(summary, description) {
            var url = getBaseURL() + "Apptivo/Cases" + "?caseSummary=" + encodeURIComponent(summary) + "&caseDescription=" + encodeURIComponent(description);
            return $http.post(url);
        }

        //START NILESH-TSK52
        function checkCustomPageRights(pagename) {
            var url = getBaseURL() + "UserCustomPageAccess?PageName=" + pagename;
            return $http.get(url);
        }
        //END NILESH-TSK52
        function rolesGetListForUser(userID) {
            var url = getBaseURL() + "Roles/User/" + userID;
            return $http.get(url);
        }

        //START NILESH-TSK65
        function getReportCSVData(surveyID, StartDate, EndDate) {
            var newStartDate = encodeURIComponent(moment(StartDate).format('LLL'));
            var newEndDate = encodeURIComponent(moment(EndDate).format('LLL'));

            var url = getBaseURL() + "NSurvey/GetFormCSVData" + "?surveyID=" + surveyID + "&startDate=" + newStartDate + "&endDate=" + newEndDate;
            return $http.get(url);
        }
        //END NILESH-TSK65
        function surveyTypeGetList(merchantID) {
            var url = getBaseURL() + "Surveys/GetSurveyTypeByMerchant/" + merchantID;
            return $http.get(url);
        }
        function GetSureyListByFormType(merchantid) {
            var url = getBaseURL() + "Surveys/UserByParam/" + merchantid;
            return $http.get(url);
        }
        //////////////////
        ////Dashboard////
        ////////////////
        function getDashboardData(data, variableMode) {
            var url = getBaseURL() + "Dashboard/getDashboardData/" + variableMode;
            var req = {
                method: "POST",
                url: url,
                data: data,
                timeout: 1000 * 60 * 6
            };
            return $http(req);
        }
        function getDashboardDataNew() {
            var url = getBaseURL() + "Dashboard/getNewDashboardData";
            return $http.get(url);            
        }
        function addDashbrdEvent(eventdata) {
            var url = getBaseURL() + "Dashboard/addevent";
            return $http.post(url, eventdata);
        }

        function getEventListbyUser() {
            var url = getBaseURL() + "Dashboard/Getevent";
            return $http.get(url);
        }
        function updateDashbrdEvent(eventdata) {
            var url = getBaseURL() + "Dashboard/UpdateEvent";
            return $http.post(url, eventdata);
        }
        function deleteDashbrdEvent(ID) {
            var url = getBaseURL() + "Dashboard/DeleteEvent/" + ID;
            return $http.delete(url);
        }
        function deleteDashbrdNotification(eventIDs) {
            var url = getBaseURL() + "Dashboard/DeleteNotification";
            return $http({
                method: "POST",
                url: url,
                data: eventIDs,
            });
            //return $http.delete(url);
        }
        function getstatuslist() {
            var url = getBaseURL() + "GetAllHighFiveStatus";
            return $http.get(url);
        }
        function gethighfiverdetails() {
            var url = getBaseURL() + "GetHighFiverDetails";
            return $http.get(url);
        }
        function AddHighFiver(highfive) {
            var url = getBaseURL() + "AddHighFiverDetails";
            return $http({
                method: "POST",
                url: url,
                data: highfive
            });
            //return $http.delete(url);
        }
        function getreadreceipt() {
            var url = getBaseURL() + "Dashboard/DashbrdReadReceipt";
            return $http.get(url);
        }
        function userGetListForMerchant(merchantID) {
            var url = getBaseURL() + "Users/List/ByMerchant/" + merchantID;
            return $http.get(url);
        }
        function getCommentDetailsOfTeacher(surveyids) {
            var url = getBaseURL() + "Dashboard/GetTeacherCommentdtlForDashbrd/" + surveyids;
            return $http.get(url);
        }
    }

})();