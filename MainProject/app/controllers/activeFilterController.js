(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .directive("activefilter", activeFilter)
        .factory("ActiveFilterLogic", activeFilterLogic)
        .controller("ActiveFilterController", ["$scope", "ActiveFilterLogic", activeFilterController]);

    function activeFilter() {
        return {
            restrict: "A",
            scope: {
                passedFilter: "=filter",
                parentNeedNewDataObject: "=parentnddo",
                onRemove: "&"
            },
            replace: true,
            templateUrl: "app/views/activeFilterView.html",
            controller: "ActiveFilterController",
            controllerAs: "activeFilter"
        };
    }

    function activeFilterLogic() {
        /*jshint validthis:true */
        var aFL = this;

        aFL.ApplyFiltersToVotes = applyFiltersToVotes;
        aFL.SurvivesFilter = survivesFilter;

        return aFL;

        // return a list of voterIDs that survived the filter
        function applyFiltersToVotes(allVotes, activeFilters) {
            var votesSurvived = [];

            //set up observer filter
            var observerFilterType;
            var observerFilters = [];
            if (activeFilters.filter(function (e) { if (e.FilterType === 1 && e.ValueVariableName === "iaspireuserid") return true; return false; }).length > 0) {
                observerFilterType = 1;
            } else if (activeFilters.filter(function (e) { if (e.FilterType === -1 && e.ValueVariableName === "iaspireuserid") return true; return false; }).length > 0) {
                observerFilterType = -1;
            }
            if (observerFilterType) {
                observerFilters = activeFilters.filter(function (e) { if (e.FilterType === observerFilterType && e.ValueVariableName === "iaspireuserid") return true; return false; });
            }

            // set up districts filter
            var districtFilterType;
            var districtFilters = [];
            if (activeFilters.filter(function (e) { if (e.FilterType === 1 && e.ValueVariableName === "districtid") return true; return false; }).length > 0) {
                districtFilterType = 1;
            } else if (activeFilters.filter(function (e) { if (e.FilterType === -1 && e.ValueVariableName === "districtid") return true; return false; }).length > 0) {
                districtFilterType = -1;
            }
            if (districtFilterType) {
                districtFilters = activeFilters.filter(function (e) { if (e.FilterType === districtFilterType && e.ValueVariableName === "districtid") return true; return false; });
            }

            // set up school filter
            var schoolFilterType;
            var schoolFilters = [];
            if (activeFilters.filter(function (e) { if (e.FilterType === 1 && (e.ValueVariableName === "schoolid" || e.ValueVariableName === "siteid")) return true; return false; }).length > 0) {
                schoolFilterType = 1;
            } else if (activeFilters.filter(function (e) { if (e.FilterType === -1 && (e.ValueVariableName === "schoolid" || e.ValueVariableName === "siteid")) return true; return false; }).length > 0) {
                schoolFilterType = -1;
            }
            if (schoolFilterType) {
                schoolFilters = activeFilters.filter(function (e) { if (e.FilterType === schoolFilterType && (e.ValueVariableName === "schoolid" || e.ValueVariableName === "siteid")) return true; return false; });
            }
            
            // set up teacher filter
            var teacherFilterType;
            var teacherFilters = [];
            if (activeFilters.filter(function (e) { if (e.FilterType === 1 && (e.ValueVariableName === "teacherid" || e.ValueVariableName === "employeeid")) return true; return false; }).length > 0) {
                teacherFilterType = 1;
            } else if (activeFilters.filter(function (e) { if (e.FilterType === -1 && (e.ValueVariableName === "teacherid" || e.ValueVariableName === "employeeid")) return true; return false; }).length > 0) {
                teacherFilterType = -1;
            }
            if (teacherFilterType) {
                teacherFilters = activeFilters.filter(function (e) { if (e.FilterType === teacherFilterType && (e.ValueVariableName === "teacherid" || e.ValueVariableName === "employeeid")) return true; return false; });
            }

            // set up subject filter
            var subjectFilterType;
            var subjectFilters = [];
            if (activeFilters.filter(function (e) { if (e.FilterType === 1 && (e.ValueVariableName === "classid" || e.ValueVariableName === "subjectid") === true) return true; return false; }).length > 0) {
                subjectFilterType = 1;
            } else if (activeFilters.filter(function (e) { if (e.FilterType === -1 && (e.ValueVariableName === "classid" || e.ValueVariableName === "subjectid") === true) return true; return false; }).length > 0) {
                subjectFilterType = -1;
            }
            if (subjectFilterType) {
                subjectFilters = activeFilters.filter(function (e) { if (e.FilterType === subjectFilterType && (e.ValueVariableName === "classid" || e.ValueVariableName === "subjectid") === true) return true; return false; });
            }

            // set up grade filter
            var gradeFilterType;
            var gradeFilters = [];
            if (activeFilters.filter(function (e) { if (e.FilterType === 1 && e.ValueVariableName === "gradeid") return true; return false; }).length > 0) {
                gradeFilterType = 1;
            } else if (activeFilters.filter(function (e) { if (e.FilterType === -1 && e.ValueVariableName === "gradeid") return true; return false; }).length > 0) {
                gradeFilterType = -1;
            }
            if (gradeFilterType) {
                gradeFilters = activeFilters.filter(function (e) { if (e.FilterType === gradeFilterType && e.ValueVariableName === "gradeid") return true; return false; });
            }

            // set up Type of Session
            var typeofSessionilterType;//M006
            var typeofSessionilters = [];
            if (activeFilters.filter(function (e) { if (e.FilterType === 1 && e.ValueVariableName === "typeofsession") return true; return false; }).length > 0) {//M0014
                typeofSessionilterType = 1;
            } else if (activeFilters.filter(function (e) { if (e.FilterType === -1 && e.ValueVariableName === "typeofsession") return true; return false; }).length > 0) {
                typeofSessionilterType = -1;
            }
            if (typeofSessionilterType) {
                typeofSessionilters = activeFilters.filter(function (e) { if (e.FilterType === typeofSessionilterType && e.ValueVariableName === "typeofsession") return true; return false; });
            }

            // set up Type of Discussion
            var typeofDiscussionilterType;//M008
            var typeofDiscussionilters = [];
            if (activeFilters.filter(function (e) { if (e.FilterType === 1 && e.ValueVariableName === "typeofdiscussion") return true; return false; }).length > 0) {//M0014
                typeofDiscussionilterType = 1;
            } else if (activeFilters.filter(function (e) { if (e.FilterType === -1 && e.ValueVariableName === "typeofdiscussion") return true; return false; }).length > 0) {
                typeofDiscussionilterType = -1;
            }
            if (typeofDiscussionilterType) {
                typeofDiscussionilters = activeFilters.filter(function (e) { if (e.FilterType === typeofDiscussionilterType && e.ValueVariableName === "typeofdiscussion") return true; return false; });
            }

            // loop through the votes, add the winners to the list
            for (var i in allVotes) {
                var survives = true;

                if (survives === true && (observerFilterType === -1 || observerFilterType === 1) === true && observerFilters.length > 0) {
                    survives = survivesFilter(allVotes[i], observerFilters[0].AnswerID, observerFilters, observerFilterType);
                }

                // apply districts filter
                if (survives === true && (districtFilterType === -1 || districtFilterType === 1) === true && districtFilters.length > 0) {
                    survives = survivesFilter(allVotes[i], districtFilters[0].AnswerID, districtFilters, districtFilterType);
                }
                if (survives === true && (schoolFilterType === -1 || schoolFilterType === 1) === true && schoolFilters.length > 0) {
                    survives = survivesFilter(allVotes[i], schoolFilters[0].AnswerID, schoolFilters, schoolFilterType);
                }
                if (survives === true && (teacherFilterType === -1 || teacherFilterType === 1) === true && teacherFilters.length > 0) {
                    survives = survivesFilter(allVotes[i], teacherFilters[0].AnswerID, teacherFilters, teacherFilterType);
                }
                if (survives === true && (subjectFilterType === -1 || subjectFilterType === 1) === true && subjectFilters.length > 0) {
                    survives = survivesFilter(allVotes[i], subjectFilters[0].AnswerID, subjectFilters, subjectFilterType);
                }
                if (survives === true && (gradeFilterType === -1 || gradeFilterType === 1) === true && gradeFilters.length > 0) {
                    survives = survivesFilter(allVotes[i], gradeFilters[0].AnswerID, gradeFilters, gradeFilterType);
                }
                if (survives === true && (typeofSessionilterType === -1 || typeofSessionilterType === 1) === true && typeofSessionilters.length > 0) {//M006
                    survives = survivesFilterForTypeOFSession(allVotes[i], typeofSessionilters[0].AnswerID, typeofSessionilters, typeofSessionilterType);
                }
                if (survives === true && (typeofDiscussionilterType === -1 || typeofDiscussionilterType === 1) === true && typeofDiscussionilters.length > 0) {//M008
                    survives = survivesFilterForTypeOFSession(allVotes[i], typeofDiscussionilters[0].AnswerID, typeofDiscussionilters, typeofDiscussionilterType);
                }
                if (survives === true) {
                    votesSurvived.push(allVotes[i].VoterID);
                }
            }
            return votesSurvived;
        }

        function survivesFilterForTypeOFSession(voter, answerID, values, filterType) {//M006
            var returnValue;
            if (filterType === 1) { // include
                returnValue = false;
            }
            else if (filterType === -1) { // exclude
                returnValue = true;
            }
            var keys = Object.keys(voter);
            for (var k in keys) {
                if (keys[k].indexOf("_" + answerID) > -1) {
                    var isMatch = false;
                    for (var m in values) {
                        var qstnidsplt = keys[k].split('_')
                        var slectdid = qstnidsplt[0] + '_' + values[m].SelectedOption;
                        if (voter[slectdid] ==='1') {
                            isMatch = true;
                        }
                    }
                    if (filterType === 1 && isMatch === true) { // include
                        returnValue = true;
                    } else if (filterType === -1 && isMatch === true) { // exclude
                        returnValue = false;
                    }
                    break;
                }
            }
            return returnValue;
        }


        function survivesFilter(voter, answerID, values, filterType) {
            var returnValue;
            if (filterType === 1) { // include
                returnValue = false;
            }
            else if (filterType === -1) { // exclude
                returnValue = true;
            }
            var keys = Object.keys(voter);
            for (var k in keys) {
                if (keys[k].indexOf("_" + answerID) > -1) {
                    var isMatch = false;
                    for (var m in values) {
                        if (voter[keys[k]] === values[m].SelectedOption) {
                            isMatch = true;
                        }
                    }
                    if (filterType === 1 && isMatch === true) { // include
                        returnValue = true;
                    } else if (filterType === -1 && isMatch === true) { // exclude
                        returnValue = false;
                    }
                    break;
                }
            }
            return returnValue;
        }

    }

    function activeFilterController($scope, activeFilterLogic) {
        /*jshint validthis:true */
        var aFC = this;

        aFC.PSSQ = $scope.passedFilter;
        aFC.FilterTypePlaceholder = null;
        aFC.PSSQ.FilterType = null;
        aFC.PSSQ.SelectedOption = null;

        $scope.$watch("activeFilter.FilterTypePlaceholder", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                // this is always going to be an integer so we can get away with parsing it outside of a try/catch
                aFC.PSSQ.FilterType = JSON.parse(newValue);
                $scope.parentNeedNewDataObject.NeedNewData = true;
            }
        });

        $scope.$watch("activeFilter.PSSQ.SelectedOption", function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
                $scope.parentNeedNewDataObject.NeedNewData = true;
            }
        });

        setTimeout(function () {
            aFC.FilterTypePlaceholder = '1';
            $scope.$apply();
        }, 1);

        return aFC;

    }

})();