
(function () {
    var Survey = function (XMLSurveyDom) {

        this["_activated"] = null;
        this["_allowMultipleNSurveySubmissions"] = null;
        this["_allowMultipleUserNameSubmissions"] = null;
        this["_archive"] = null;
        this["_closeDate"] = null;
        this["_cookieExpires"] = null;
        this["_creationDate"] = null;
        this["_defaultSurvey"] = null;
        this["_folderID"] = null;
        this["_iPExpires"] = null;
        this["_lastEntryDate"] = null;
        this["_multiLanguageModeID"] = null;
        this["_navigationEnabled"] = null;
        this["_notificationModeID"] = null;
        this["_onlyInvited"] = null;
        this["_openDate"] = null;
        this["_progressDisplayModeID"] = null;
        this["_questionNumberingDisabled"] = null;
        this["_resultsDisplayTimes"] = null;
        this["_resumeModeID"] = null;
        this["_saveTokenUserData"] = null;
        this["_scored"] = null;
        this["_surveyDisplayTimes"] = null;
        this["_surveyGuid"] = null;
        this["_surveyID"] = null;
        this["_title"] = null;
        this["_unAuthentifiedUserActionID"] = null;

        if (XMLSurveyDom) {
            if (XMLSurveyDom.attributes) {
                // dynamically add elements from XML
                for (var i = 0, leni = XMLSurveyDom.attributes.length; i < leni; i++) {
                    var attrName = XMLSurveyDom.attributes.item(i).name;
                    attrName = attrName.charAt(0).toLowerCase() + attrName.slice(1);
                    if (this["_" + attrName] !== undefined) {
                        try {
                            this["_" + attrName] = JSON.parse(XMLSurveyDom.attributes.item(i).value.toLowerCase());
                        } catch (ex) {
                            this["_" + attrName] = XMLSurveyDom.attributes.item(i).value;
                        }
                    } else {
                        // if this happens, the field needs added to the constructor
                        throw new ReferenceError("Survey: Property not found: _" + attrName);
                    }
                }
                // children vs childNodes IE Compatability
                if (XMLSurveyDom.children) {
                    for (var k = 0, lenk = XMLSurveyDom.children.length; k < lenk; k++) {
                        var childName = XMLSurveyDom.children[k].tagName;
                        childName = childName.charAt(0).toLowerCase() + childName.slice(1);
                        if (this["_" + childName] !== undefined) {
                            try {
                                this["_" + childName] = JSON.parse(XMLSurveyDom.children[k].innerHTML.toLowerCase());
                            } catch (ex) {
                                this["_" + childName] = XMLSurveyDom.children[k].innerHTML;
                            }
                        } else {
                            // if this happens, the field needs added to the constructor
                            throw new ReferenceError("Survey: Property not found: _" + childName);
                        }
                    }
                } else {
                    for (var k = 1, lenk = XMLSurveyDom.childNodes.length; k < lenk; k = k + 2) {
                        var childName = XMLSurveyDom.childNodes[k].tagName;
                        childName = childName.charAt(0).toLowerCase() + childName.slice(1);
                        if (this["_" + childName] !== undefined) {
                            try {
                                this["_" + childName] = JSON.parse(XMLSurveyDom.childNodes[k].textContent.toLowerCase());
                            } catch (ex) {
                                this["_" + childName] = XMLSurveyDom.childNodes[k].textContent;
                            }
                        } else {
                            // if this happens, the field needs added to the constructor
                            throw new ReferenceError("Survey: Property not found: _" + childName);
                        }
                    }
                }
            } else {
                // dynamically add parameters
                for (var key in XMLSurveyDom) {
                    var keyName = key.charAt(0).toLowerCase() + key.slice(1);
                    if (this["_" + keyName] !== undefined) {
                        try {
                            this["_" + keyName] = JSON.parse(XMLSurveyDom[key]);
                        } catch (ex) {
                            this["_" + keyName] = XMLSurveyDom[key];
                        }
                    } else {
                        throw new ReferenceError("Survey: Property not found: _" + keyName);
                    }
                }
            }

        }

        Object.defineProperties(this, {
            "SurveyID": {
                get: function () {
                    return this["_surveyID"];
                },
                set: function (val) {
                    this["_surveyID"] = val;
                }
            },
            "ProgressDisplayModeID": {
                get: function () {
                    return this["_progressDisplayModeID"];
                },
                set: function (val) {
                    this["_progressDisplayModeID"] = val;
                }
            },
            "ResumeModeID": {
                get: function () {
                    return this["_resumeModeID"];
                },
                set: function (val) {
                    this["_resumeModeID"] = val;
                }
            },
            "Title": {
                get: function () {
                    return this["_title"];
                },
                set: function (val) {
                    this["_title"] = val;
                }
            },
            "NavigationEnabled": {
                get: function () {
                    return this["_navigationEnabled"];
                },
                set: function (val) {
                    this["_navigationEnabled"] = val;
                }
            },
            "Scored": {
                get: function () {
                    return this["_scored"];
                },
                set: function (val) {
                    this["_scored"] = val;
                }
            },
            "QuestionNumberingDisabled": {
                get: function () {
                    return this["_questionNumberingDisabled"];
                },
                set: function (val) {
                    this["_questionNumberingDisabled"] = val;
                }
            },
            "Activated": {
                get: function () {
                    return this["_activated"];
                },
                set: function (val) {
                    this["_activated"] = val;
                }
            },
            "Archive": {
                get: function () {
                    return this["_archive"];
                },
                set: function (val) {
                    this["_archive"] = val;
                }
            },
            "ResultsDisplayTimes": {
                get: function () {
                    return this["_resultsDisplayTimes"];
                },
                set: function (val) {
                    this["_resultsDisplayTimes"] = val;
                }
            },
            "CreationDate": {
                get: function () {
                    return this["_creationDate"];
                },
                set: function (val) {
                    this["_creationDate"] = val;
                }
            },
            "NotificationModeID": {
                get: function () {
                    return this["_notificationModeID"];
                },
                set: function (val) {
                    this["_notificationModeID"] = val;
                }
            },
            "AllowMultipleNSurveySubmissions": {
                get: function () {
                    return this["_allowMultipleNSurveySubmissions"];
                },
                set: function (val) {
                    this["_allowMultipleNSurveySubmissions"] = val;
                }
            },
            "AllowMultipleUserNameSubmissions": {
                get: function () {
                    return this["_allowMultipleUserNameSubmissions"];
                },
                set: function (val) {
                    this["_allowMultipleUserNameSubmissions"] = val;
                }
            },
            "CloseDate": {
                get: function () {
                    return this["_closeDate"];
                },
                set: function (val) {
                    this["_closeDate"] = val;
                }
            },
            "CookieExpires": {
                get: function () {
                    return this["_cookieExpires"];
                },
                set: function (val) {
                    this["_cookieExpires"] = val;
                }
            },
            "DefaultSurvey": {
                get: function () {
                    return this["_defaultSurvey"];
                },
                set: function (val) {
                    this["_defaultSurvey"] = val;
                }
            },
            "FolderID": {
                get: function () {
                    return this["_folderID"];
                },
                set: function (val) {
                    this["_folderID"] = val;
                }
            },
            "IPExpires": {
                get: function () {
                    return this["_iPExpires"];
                },
                set: function (val) {
                    this["_iPExpires"] = val;
                }
            },
            "LastEntryDate": {
                get: function () {
                    return this["_lastEntryDate"];
                },
                set: function (val) {
                    this["_lastEntryDate"] = val;
                }
            },
            "MultiLanguageModeID": {
                get: function () {
                    return this["_multiLanguageModeID"];
                },
                set: function (val) {
                    this["_multiLanguageModeID"] = val;
                }
            },
            "NotificationModeID": {
                get: function () {
                    return this["_notificationModeID"];
                },
                set: function (val) {
                    this["_notificationModeID"] = val;
                }
            },
            "OnlyInvited": {
                get: function () {
                    return this["_onlyInvited"];
                },
                set: function (val) {
                    this["_onlyInvited"] = val;
                }
            },
            "OpenDate": {
                get: function () {
                    return this["_openDate"];
                },
                set: function (val) {
                    this["_openDate"] = val;
                }
            },
            "SaveTokenUserData": {
                get: function () {
                    return this["_saveTokenUserData"];
                },
                set: function (val) {
                    this["_saveTokenUserData"] = val;
                }
            },
            "SurveyDisplayTimes": {
                get: function () {
                    return this["_surveyDisplayTimes"];
                },
                set: function (val) {
                    this["_surveyDisplayTimes"] = val;
                }
            },
            "SurveyGuid": {
                get: function () {
                    return this["_surveyGuid"];
                },
                set: function (val) {
                    this["_surveyGuid"] = val;
                }
            },
            "UnAuthentifiedUserActionID": {
                get: function () {
                    return this["_unAuthentifiedUserActionID"];
                },
                set: function (val) {
                    this["_unAuthentifiedUserActionID"] = val;
                }
            }
        });
    }
    Survey.prototype.constructor = Survey;
    window["Survey"] = Survey;
})();
