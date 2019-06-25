/// <reference path="Question.js" />
/// <reference path="AnswerType.js" />
/// <reference path="QuestionSelectionMode.js" />
(function () {
    var Answer = function (XMLAnswerDom) {

        this["_questionID"] = null;
        this["_answerTypeID"] = null;
        this["_displayOrder"] = null;
        this["_scorePoint"] = null;
        this["_ratePart"] = null;
        this["_selected"] = null;
        this["_answerID"] = null;
        this["_mandatory"] = null;
        this["_answerText"] = null;
        this["_imageURL"] = null;
        this["_answerPipeAlias"] = null;
        this["_answerIDText"] = null;
        this["_answerAlias"] = null;
        this["_sliderRange"] = null;
        this["_sliderValue"] = null;
        this["_sliderMin"] = null;
        this["_sliderMax"] = null;
        this["_sliderAnimate"] = null;
        this["_sliderStep"] = null;
        this["_oldAnswerID"] = null;
        this["_defaultText"] = null;
        this["_regularExpressionID"] = null;

        /// <field name="_ParentQuestion" type="Question">Description</field>
        this["_ParentQuestion"] = null;
        /// <field name="AnswerType" type="AnswerType">Description</field>
        this["AnswerType"] = null;

        if (XMLAnswerDom) {
            if (XMLAnswerDom.attributes) {
                // dynamically add the elements from the XML file
                for (var i = 0, leni = XMLAnswerDom.attributes.length; i < leni; i++) {
                    var attrName = XMLAnswerDom.attributes.item(i).name;
                    attrName = attrName.charAt(0).toLowerCase() + attrName.slice(1);
                    if (this["_" + attrName] !== undefined) {
                        try {
                            this["_" + attrName] = JSON.parse(XMLAnswerDom.attributes.item(i).value.toLowerCase());
                        } catch (ex) {
                            this["_" + attrName] = XMLAnswerDom.attributes.item(i).value;
                        }
                    } else {
                        // if this happens, the field needs added to the constructor
                        throw new ReferenceError("Answer: Property not found: _" + attrName);
                    }
                }
                // children vs childNodes IE compatability
                if (XMLAnswerDom.children) {
                    for (var k = 0, lenk = XMLAnswerDom.children.length; k < lenk; k++) {
                        var childName = XMLAnswerDom.children[k].tagName;
                        childName = childName.charAt(0).toLowerCase() + childName.slice(1);
                        if (this["_" + childName] !== undefined) {
                            try {
                                this["_" + childName] = JSON.parse(XMLAnswerDom.children[k].innerHTML.toLowerCase());
                            } catch (ex) {
                                this["_" + childName] = XMLAnswerDom.children[k].innerHTML;
                            }
                        } else {
                            // if this happens, the field needs added to the constructor
                            throw new ReferenceError("Answer: Property not found: _" + childName);
                        }
                    }
                } else {
                    for (var k = 1, lenk = XMLAnswerDom.childNodes.length; k < lenk; k = k + 2) {
                        var childName = XMLAnswerDom.childNodes[k].tagName;
                        childName = childName.charAt(0).toLowerCase() + childName.slice(1);
                        if (this["_" + childName] !== undefined) {
                            try {
                                this["_" + childName] = JSON.parse(XMLAnswerDom.childNodes[k].textContent.toLowerCase());
                            } catch (ex) {
                                this["_" + childName] = XMLAnswerDom.childNodes[k].textContent;
                            }
                        } else {
                            // if this happens, the field needs added to the constructor
                            throw new ReferenceError("Answer: Property not found: _" + childName);
                        }
                    }
                }
            } else {
                // dynamically add parameters
                for (var key in XMLAnswerDom) {
                    var keyName = key.charAt(0).toLowerCase() + key.slice(1);
                    if (this["_" + keyName] !== undefined) {
                        try {
                            this["_" + keyName] = JSON.parse(XMLAnswerDom[key]);
                        } catch (ex) {
                            this["_" + keyName] = XMLAnswerDom[key];
                        }
                    } else {
                        throw new ReferenceError("Answer: Property not found: _" + keyName);
                    }
                }
            }
        }

        Object.defineProperties(this, {
            "QuestionID": {
                get: function () {
                    return this["_questionID"];
                },
                set: function (val) {
                    this["_questionID"] = val;
                }
            },
            "AnswerTypeID": {
                get: function () {
                    return this["_answerTypeID"];
                },
                set: function (val) {
                    this["_answerTypeID"] = val;
                }
            },
            "DisplayOrder": {
                get: function () {
                    return this["_displayOrder"];
                },
                set: function (val) {
                    this["_displayOrder"] = val;
                }
            },
            "ScorePoint": {
                get: function () {
                    return this["_scorePoint"];
                },
                set: function (val) {
                    this["_scorePoint"] = val;
                }
            },
            "RatePart": {
                get: function () {
                    return this["_ratePart"];
                },
                set: function (val) {
                    this["_ratePart"] = val;
                }
            },
            "Selected": {
                get: function () {
                    return this["_selected"];
                },
                set: function (val) {
                    this["_selected"] = val;
                }
            },
            "AnswerID": {
                get: function () {
                    return this["_answerID"];
                },
                set: function (val) {
                    this["_answerID"] = val;
                }
            },
            "Mandatory": {
                get: function () {
                    return this["_mandatory"];
                },
                set: function (val) {
                    this["_mandatory"] = val;
                }
            },
            "AnswerText": {
                get: function () {
                    var tA = document.createElement("textarea");
                    tA.innerHTML = this["_answerText"];
                    return tA.textContent;
                },
                set: function (val) {
                    this["_answerText"] = val;
                }
            },
            "ImageURL": {
                get: function () {
                    return this["_imageURL"];
                },
                set: function (val) {
                    this["_imageURL"] = val;
                }
            },
            "AnswerPipeAlias": {
                get: function () {
                    return this["_answerPipeAlias"];
                },
                set: function (val) {
                    this["_answerPipeAlias"] = val;
                }
            },
            "AnswerIDText": {
                get: function () {
                    return this["_answerIDText"];
                },
                set: function (val) {
                    this["_answerIDText"] = val;
                }
            },
            "AnswerAlias": {
                get: function () {
                    return this["_answerAlias"];
                },
                set: function (val) {
                    this["_answerAlias"] = val;
                }
            },
            "SliderRange": {
                get: function () {
                    return this["_sliderRange"];
                },
                set: function (val) {
                    this["_sliderRange"] = val;
                }
            },
            "SliderValue": {
                get: function () {
                    return this["_sliderValue"];
                },
                set: function (val) {
                    this["_sliderValue"] = val;
                }
            },
            "SliderMin": {
                get: function () {
                    return this["_sliderMin"];
                },
                set: function (val) {
                    this["_sliderMin"] = val;
                }
            },
            "SliderMax": {
                get: function () {
                    return this["_sliderMax"];
                },
                set: function (val) {
                    this["_sliderMax"] = val;
                }
            },
            "SliderAnimate": {
                get: function () {
                    return this["_sliderAnimate"];
                },
                set: function (val) {
                    this["_sliderAnimate"] = val;
                }
            },
            "SliderStep": {
                get: function () {
                    return this["_sliderStep"];
                },
                set: function (val) {
                    this["_sliderStep"] = val;
                }
            },
            "OldAnswerID": {
                get: function () {
                    return this["_oldAnswerID"];
                },
                set: function (val) {
                    this["_oldAnswerID"] = val;
                }
            },
            "DefaultText": {
                get: function () {
                    return this["_defaultText"];
                },
                set: function (val) {
                    this["_defaultText"] = val;
                }
            },
            "RegularExpressionID": {
                get: function () {
                    return this["_regularExpressionID"];
                },
                set: function (val) {
                    this["_regularExpressionID"] = val;
                }
            }
        });
    }
    Answer.prototype = Object.create({}, {
        "AttachToQuestion": {
            value: function (par) {
                /// <param name="par" type="Question">Description</param>
                this["_ParentQuestion"] = par;
                par["AttachAnswer"](this);
            }
        },
        "GenerateHTML": {
            value: function () {
                var answerWrapper;

                switch (this["_ParentQuestion"]["SelectionModeID"]) {
                    // RadioButtonSelection
                    case 1:

                        if (this["answerTypeID"] === 24) {
                            answerWrapper = document.createElement("tr");
                            var answerWrapperCell = document.createElement("td");
                            answerWrapperCell.vAlign = "top";
                            answerWrapperCell.style.width = "0%";

                            answerWrapperCell.appendChild(this["AnswerType"]["RenderAnswerType"](this["_ParentQuestion"], this));
                            answerWrapper.appendChild(answerWrapperCell);
                        } else {
                            if (this["_ParentQuestion"]["LayoutModeID"] === 2) {
                                var answerWrapperCell = document.createElement("td");
                                answerWrapperCell.vAlign = "top";
                                answerWrapperCell.style.width = "0%";

                                answerWrapperCell.appendChild(this["AnswerType"]["RenderAnswerType"](this["_ParentQuestion"], this));
                                answerWrapper = answerWrapperCell;
                            } else {
                                answerWrapper = document.createElement("tr");
                                answerWrapper.className = "answerStyle";
                                var answerWrapperCell = document.createElement("td");
                                answerWrapperCell.vAlign = "top";
                                answerWrapperCell.style.width = "0%";

                                answerWrapperCell.appendChild(this["AnswerType"]["RenderAnswerType"](this["_ParentQuestion"], this));
                                answerWrapper.appendChild(answerWrapperCell);
                            }
                        }

                        break;

                        // CheckBoxSelection
                    case 2:

                        if (this["answerTypeID"] === 24) {
                            answerWrapper = document.createElement("tr");
                            var answerWrapperCell = document.createElement("td");
                            answerWrapperCell.vAlign = "top";
                            answerWrapperCell.style.width = "0%";

                            answerWrapperCell.appendChild(this["AnswerType"]["RenderAnswerType"](this["_ParentQuestion"], this))
                            answerWrapper.appendChild(answerWrapperCell);
                        } else {
                            if (this["_ParentQuestion"]["LayoutModeID"] === 2) {
                                var answerWrapperCell = document.createElement("td");
                                answerWrapperCell.vAlign = "top";
                                answerWrapperCell.style.width = "0%";

                                answerWrapperCell.appendChild(this["AnswerType"]["RenderAnswerType"](this["_ParentQuestion"], this));
                                answerWrapper = answerWrapperCell;
                            } else {
                                answerWrapper = document.createElement("tr");
                                answerWrapper.className = "answerStyle";
                                var answerWrapperCell = document.createElement("td");
                                answerWrapperCell.vAlign = "top";
                                answerWrapperCell.style.width = "0%";

                                answerWrapperCell.appendChild(this["AnswerType"]["RenderAnswerType"](this["_ParentQuestion"], this));
                                answerWrapper.appendChild(answerWrapperCell);
                            }
                        }

                        break;

                        // DropDownListSelection
                    case 3:
                        var answerSelection = document.createElement("option");
                        answerSelection.value = this["OldAnswerID"];
                        answerSelection.innerHTML = this["AnswerText"];
                        answerWrapper = answerSelection;
                        break;

                        // MatrixSingleSelection
                    case 4:

                        break;

                        // StaticTextSelection
                    case 5:

                        break;

                        // MatrixMultipleSelection
                    case 6:

                        break;
                    default:
                        throw ReferenceError("Unknown Selection Mode: " + this["_ParentQuestion"]["SelectionModeID"]);
                }

                // assemble answer

                return answerWrapper;
            }
        },
        "SortByDisplayOrder": {
            value: function (a, b) {
                /// <param name="a" type="Answer">Description</param>
                /// <param name="b" type="Answer">Description</param>
                return a["DisplayOrder"] - b["DisplayOrder"];
            }
        },
        "AttachAnswerTypeObject": {
            value: function (aType) {
                this["AnswerType"] = aType;
            }
        }
    });
    Answer.prototype.constructor = Answer;
    window["Answer"] = Answer;
})();
﻿/// <reference path="Question.js" />
/// <reference path="D:\SkyDrive\Web Development\iAspire\www\trunk\www_iAspire\www_iAspire_App\Scripts/jquery-ui-1.11.4.js" />
/// <reference path="Answer.js" />

(function () {
    var AnswerType = function (XMLAnswerTypeDom) {
        /// <param name="XMLAnswerTypeDom" type="HTMLElement">Description</param>

        this["_answerTypeID"] = null;
        this["_fieldWidth"] = null;
        this["_fieldHeight"] = null;
        this["_fieldLength"] = null;
        this["_typeMode"] = null;
        this["_publicFieldResults"] = null;
        this["_builtIn"] = null;
        this["_description"] = null;
        this["_javascriptFunctionName"] = null;
        this["_javascriptCode"] = null;
        this["_javascriptErrorCode"] = null;
        this["_typeNameSpace"] = null;
        this["_typeAssembly"] = null;
        this["_xMLDataSource"] = null;

        if (XMLAnswerTypeDom) {
            if (XMLAnswerTypeDom.attributes) {
                // dynamically add the elements from the XML file
                for (var i = 0, leni = XMLAnswerTypeDom.attributes.length; i < leni; i++) {
                    var attrName = XMLAnswerTypeDom.attributes.item(i).name;
                    attrName = attrName.charAt(0).toLowerCase() + attrName.slice(1);
                    if (this["_" + attrName] !== undefined) {
                        try {
                            this["_" + attrName] = JSON.parse(XMLAnswerTypeDom.attributes.item(i).value.toLowerCase());
                        } catch (ex) {
                            this["_" + attrName] = XMLAnswerTypeDom.attributes.item(i).value;
                        }
                    } else {
                        // if this happens, the field needs added to the constructor
                        throw new ReferenceError("AnswerType: Property not found: _" + attrName);
                    }
                }
                // children vs childNodes IE compatability
                if (XMLAnswerTypeDom.children) { // not IE
                    for (var k = 0, lenk = XMLAnswerTypeDom.children.length; k < lenk; k++) {
                        var childName = XMLAnswerTypeDom.children[k].tagName;
                        childName = childName.charAt(0).toLowerCase() + childName.slice(1);
                        if (this["_" + childName] !== undefined) {
                            try {
                                this["_" + childName] = JSON.parse(XMLAnswerTypeDom.children[k].innerHTML.toLowerCase());
                            } catch (ex) {
                                this["_" + childName] = XMLAnswerTypeDom.children[k].innerHTML;
                            }
                        } else {
                            // if this happens, the field needs added to the constructor
                            throw new ReferenceError("AnswerType: Property not found: _" + childName);
                        }
                    }
                } else { // IE
                    for (var k = 1, lenk = XMLAnswerTypeDom.childNodes.length; k < lenk; k = k + 2) {
                        var childName = XMLAnswerTypeDom.childNodes[k].tagName;
                        childName = childName.charAt(0).toLowerCase() + childName.slice(1);
                        if (this["_" + childName] !== undefined) {
                            try {
                                this["_" + childName] = JSON.parse(XMLAnswerTypeDom.childNodes[k].textContent.toLowerCase());
                            } catch (ex) {
                                this["_" + childName] = XMLAnswerTypeDom.childNodes[k].textContent;
                            }
                        } else {
                            // if this happens, the field needs added to the constructor
                            throw new ReferenceError("AnswerType: Property not found: _" + childName);
                        }
                    }
                }
            } else {
                // dynamically add parameters
                for (var key in XMLAnswerTypeDom) {
                    var keyName = key.charAt(0).toLowerCase() + key.slice(1);
                    if (this["_" + keyName] !== undefined) {
                        try {
                            this["_" + keyName] = JSON.parse(XMLAnswerTypeDom[key]);
                        } catch (ex) {
                            this["_" + keyName] = XMLAnswerTypeDom[key];
                        }
                    } else {
                        throw new ReferenceError("AnswerType: Property not found: _" + keyName);
                    }
                }
            }
        }

        Object.defineProperties(this, {
            "AnswerTypeID": {
                get: function () {
                    return this["_answerTypeID"];
                },
                set: function (val) {
                    this["_answerTypeID"] = val;
                }
            },
            "FieldWidth": {
                get: function () {
                    return this["_fieldWidth"];
                },
                set: function (val) {
                    this["_fieldWidth"] = val;
                }
            },
            "FieldHeight": {
                get: function () {
                    return this["_fieldHeight"];
                },
                set: function (val) {
                    this["_fieldHeight"] = val;
                }
            },
            "FieldLength": {
                get: function () {
                    return this["_fieldLength"];
                },
                set: function (val) {
                    this["_fieldLength"] = val;
                }
            },
            "TypeMode": {
                get: function () {
                    return this["_typeMode"];
                },
                set: function (val) {
                    this["_typeMode"] = val;
                }
            },
            "PublicFieldResults": {
                get: function () {
                    return this["_publicFieldResults"];
                },
                set: function (val) {
                    this["_publicFieldResults"] = val;
                }
            },
            "BuiltIn": {
                get: function () {
                    return this["_builtIn"];
                },
                set: function (val) {
                    this["_builtIn"] = val;
                }
            },
            "Description": {
                get: function () {
                    return this["_description"];
                },
                set: function (val) {
                    this["_description"] = val;
                }
            },
            "JavascriptFunctionName": {
                get: function () {
                    return this["_javascriptFunctionName"];
                },
                set: function (val) {
                    this["_javascriptFunctionName"] = val;
                }
            },
            "JavascriptCode": {
                get: function () {
                    return this["_javascriptCode"];
                },
                set: function (val) {
                    this["_javascriptCode"] = val;
                }
            },
            "JavascriptErrorCode": {
                get: function () {
                    return this["_javascriptErrorCode"];
                },
                set: function (val) {
                    this["_javascriptErrorCode"] = val;
                }
            },
            "TypeNameSpace": {
                get: function () {
                    return this["_typeNameSpace"];
                },
                set: function (val) {
                    this["_typeNameSpace"] = val;
                }
            },
            "TypeAssembly": {
                get: function () {
                    return this["_typeAssembly"];
                },
                set: function (val) {
                    this["_typeAssembly"] = val;
                }
            }
        });
    }
    AnswerType.prototype = Object.create({}, {
        "RenderAnswerType": {
            value: function (question, answer) {
                /// <param name="question" type="Question">Description</param>
                /// <param name="answer" type="Answer">Description</param>
                var wrapperSpan = document.createElement("span");
                wrapperSpan.id = "SurveyControl_Question" + question["QuestionID"];

                switch (this["AnswerTypeID"]) {
                    case 1: // SelectionTextType
                        var input = document.createElement("input");
                        input.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"];
                        if (question["SelectionModeID"] === 1) {
                            input.type = "radio";
                            input.name = "Q" + question["QuestionID"] + "Radio";
                        } else if (question["SelectionModeID"] === 2) {
                            input.type = "checkbox";
                            input.name = "Q" + question["QuestionID"] + "Checkbox";
                        }
                        var label = document.createElement("label");
                        label.setAttribute("for", input.id);
                        label.innerHTML = answer["AnswerText"];
                        label.className = "AnswerTextRender";
                        wrapperSpan.appendChild(input);
                        wrapperSpan.appendChild(label);

                        break;
                    case 2: // SelectionOtherType
                        var innerSpan = document.createElement("span");
                        var booleanInput = document.createElement("input");
                        if (question["SelectionModeID"] === 1) {
                            booleanInput.type = "radio";
                            booleanInput.name = "Q" + question["QuestionID"] + "Radio";
                        } else if (question["SelectionModeID"] === 2) {
                            booleanInput.type = "checkbox";
                            booleanInput.name = "Q" + question["QuestionID"] + "Checkbox";
                        }
                        booleanInput.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"] + "Checkbox";
                        var label = document.createElement("label");
                        label.setAttribute("for", booleanInput.id);
                        label.innerHTML = answer["AnswerText"];
                        label.className = "AnswerTextRender";
                        innerSpan.appendChild(booleanInput);
                        innerSpan.appendChild(label);
                        //var space = document.createTextNode("&nbsp;");
                        var textBox = document.createElement("input");
                        textBox.type = "text";
                        textBox.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"] + "Text";
                        wrapperSpan.appendChild(innerSpan);
                        wrapperSpan.appendChild(document.createElement("br"));
                        //wrapperSpan.appendChild(space);
                        wrapperSpan.appendChild(textBox);

                        break;
                    case 3: // FieldBasicType
                        var answerTextSpan = document.createElement("span");
                        answerTextSpan.innerHTML = answer["AnswerText"];
                        answerTextSpan.className = "AnswerTextRender";
                        var input = document.createElement("input");
                        input.type = "text";
                        input.size = (this["FieldLength"] == 0) ? 20 : this["FieldLength"];
                        input.height = (this["FieldHeight"] == 0) ? 20 : this["FieldHeight"];
                        input.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"];
                        wrapperSpan.appendChild(answerTextSpan);
                        wrapperSpan.appendChild(document.createElement("br"));
                        wrapperSpan.appendChild(input);

                        break;
                    case 4: // XMLCountryList
                        var span = document.createElement("span");
                        span.innerHTML = question["QuestionText"];
                        var select = document.createElement("select");
                        var defaultOption = document.createElement("option");
                        defaultOption.selected = "selected";
                        defaultOption.innerHTML = "[Select Country]";
                        select.appendChild(defaultOption);
                        wrapperSpan.appendChild(span);
                        wrapperSpan.appendChild(document.createElement("br"));
                        wrapperSpan.appendChild(select);

                        break;
                    case 20: // BooleanType
                        var input = document.createElement("input");
                        input.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"];
                        input.type = "checkbox";
                        input.name = "Q" + question["QuestionID"] + "Checkbox";
                        var label = document.createElement("label");
                        label.setAttribute("for", input.id);
                        label.innerHTML = answer["AnswerText"];
                        label.className = "AnswerTextRender";
                        wrapperSpan.appendChild(label);
                        wrapperSpan.appendChild(input);

                        break;
                    case 21: // FieldRequiredType
                        var answerTextSpan = document.createElement("span");
                        answerTextSpan.innerHTML = answer["AnswerText"];
                        answerTextSpan.className = "AnswerTextRender";
                        var input = document.createElement("input");
                        input.type = "text";
                        input.size = (this["FieldLength"] == 0) ? 20 : this["FieldLength"];
                        input.height = (this["FieldHeight"] == 0) ? 20 : this["FieldHeight"];
                        input.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"];
                        wrapperSpan.appendChild(answerTextSpan);
                        wrapperSpan.appendChild(document.createElement("br"));
                        wrapperSpan.appendChild(input);

                        break;
                    case 22: // FieldCalendarType
                        var answerTextSpan = document.createElement("span");
                        answerTextSpan.innerHTML = answer["AnswerText"];
                        answerTextSpan.className = "AnswerTextRender";
                        var input = document.createElement("input");
                        //input.type = "date";
                        input.placeholder = "mm/dd/yyyy";
                        input.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"];
                        $(input).datepicker();
                        wrapperSpan.appendChild(answerTextSpan);
                        wrapperSpan.appendChild(document.createElement("br"));
                        wrapperSpan.appendChild(input);

                        break;
                    case 24: // FieldLargeType
                        var answerTextSpan = document.createElement("span");
                        answerTextSpan.innerHTML = answer["AnswerText"];
                        answerTextSpan.className = "AnswerTextRender";
                        var textArea = document.createElement("textarea");
                        textArea.type = "text";
                        textArea.style.width = "95%";
                        textArea.style.height = "230px";
                        textArea.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"];
                        wrapperSpan.appendChild(answerTextSpan);
                        wrapperSpan.appendChild(document.createElement("br"));
                        wrapperSpan.appendChild(textArea);

                        break;
                    case 26: // FieldEmailType
                        var answerTextSpan = document.createElement("span");
                        answerTextSpan.innerHTML = answer["AnswerText"];
                        answerTextSpan.className = "AnswerTextRender";
                        var input = document.createElement("input");
                        input.type = "email";
                        input.placeholder = "emailAddress@emailDomain.com";
                        input.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"];
                        wrapperSpan.appendChild(answerTextSpan);
                        wrapperSpan.appendChild(document.createElement("br"));
                        wrapperSpan.appendChild(input);

                        break;
                    case 27: // FieldHiddenType
                        // do nothing?

                        break;
                    case 28: // FieldPasswordType
                        var answerTextSpan = document.createElement("span");
                        answerTextSpan.innerHTML = answer["AnswerText"];
                        answerTextSpan.className = "AnswerTextRender";
                        var input = document.createElement("input");
                        input.type = "password";
                        input.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"];
                        wrapperSpan.appendChild(answerTextSpan);
                        wrapperSpan.appendChild(document.createElement("br"));
                        wrapperSpan.appendChild(input);

                        break;
                    case 29: // SubscriberXMLList


                        break;
                    case 30: // ExtendedFileUploadType
                        var answerTextSpan = document.createElement("span");
                        answerTextSpan.innerHTML = answer["AnswerText"];
                        answerTextSpan.className = "AnswerTextRender";
                        var fileUploadInput = document.createElement("input");
                        fileUploadInput.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"];
                        fileUploadInput.type = "file";
                        var uploadButton = document.createElement("input");
                        uploadButton.type = "submit";
                        var table = document.createElement("table");
                        table.className = "lddl";
                        wrapperSpan.appendChild(answerTextSpan);
                        wrapperSpan.appendChild(fileUploadInput);
                        wrapperSpan.appendChild(uploadButton);
                        wrapperSpan.appendChild(table);

                        break;
                    case 31: // ExtendedFreeTextBoxType


                        break;
                    case 56: // FieldSliderType
                        var answerTextSpan = document.createElement("span");
                        answerTextSpan.innerHTML = answer["AnswerText"];
                        answerTextSpan.className = "AnswerTextRender";
                        var sliderValInput = document.createElement("input");
                        sliderValInput.type = "number";
                        var slider = document.createElement("input");
                        slider.type = "range";
                        slider.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"];
                        slider.min = answer["SliderMax"];
                        slider.min = answer["SliderMin"];
                        slider.step = answer["SliderStep"];
                        slider.value = answer["SliderValue"];
                        slider.width = "100%";
                        var sliderChange = function () {
                            sliderValInput.onchange = null;
                            sliderValInput.oninput = null;
                            sliderValInput.value = slider.value;
                            sliderValInput.onchange = sliderValChange;
                            sliderValInput.oninput = sliderValChange;
                        }
                        var sliderValChange = function () {
                            slider.onchange = null;
                            slider.oninput = null;
                            slider.value = sliderValInput.value;
                            slider.onchange = sliderChange;
                            slider.oninput = sliderChange;
                        }
                        sliderValInput.onchange = sliderValChange;
                        sliderValInput.oninput = sliderValChange;
                        slider.onchange = sliderChange;
                        slider.oninput = sliderChange;
                        wrapperSpan.appendChild(answerTextSpan);
                        wrapperSpan.appendChild(document.createElement("br"));
                        wrapperSpan.appendChild(sliderValInput);
                        wrapperSpan.appendChild(slider);

                        break;
                    case 58: // Static Text
                        var answerTextSpan = document.createElement("span");
                        answerTextSpan.innerHTML = answer["AnswerText"];
                        answerTextSpan.className = "AnswerTextRender";
                        wrapperSpan.appendChild(answerTextSpan);

                        break;
                    default:
                        throw ReferenceError("Unknown Answer Type: " + this["AnswerTypeID"]);

                        break;
                }
                return wrapperSpan;
            }
        },
        "RenderAnswerTypeForMatrix": {
            value: function (question, answer, childQuestionIndex) {
                /// <param name="question" type="Question">Description</param>
                /// <param name="answer" type="Answer">Description</param>
                var wrapperSpan = document.createElement("span");
                wrapperSpan.id = "SurveyControl_Question" + question["QuestionID"];

                switch (this["AnswerTypeID"]) {
                    case 1: // SelectionTextType
                        var input = document.createElement("input");
                        input.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex + answer["AnswerID"];
                        if (question["SelectionModeID"] === 4) {
                            input.type = "radio";
                            input.name = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex;
                        } else if (question["SelectionModeID"] === 6) {
                            input.type = "checkbox";
                            input.name = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex;
                        }
                        wrapperSpan.appendChild(input);

                        break;
                    case 2: // SelectionOtherType
                        var innerSpan = document.createElement("span");
                        var booleanInput = document.createElement("input");
                        if (question["SelectionModeID"] === 4) {
                            booleanInput.type = "radio";
                            booleanInput.name = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex;
                        } else if (question["SelectionModeID"] === 6) {
                            booleanInput.type = "checkbox";
                            booleanInput.name = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex;
                        }
                        booleanInput.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex;
                        var label = document.createElement("label");
                        label.setAttribute("for", booleanInput.id);
                        label.innerHTML = answer["AnswerText"];
                        label.className = "AnswerTextRender";
                        innerSpan.appendChild(booleanInput);
                        innerSpan.appendChild(label);
                        //var space = document.createTextNode("&nbsp;");
                        var textBox = document.createElement("input");
                        textBox.type = "text";
                        textBox.id = "Q" + question["QuestionID"] + "A" + answer["AnswerID"] + "Text";
                        wrapperSpan.appendChild(innerSpan);
                        wrapperSpan.appendChild(document.createElement("br"));
                        //wrapperSpan.appendChild(space);
                        wrapperSpan.appendChild(textBox);

                        break;
                    case 3: // FieldBasicType
                        var input = document.createElement("input");
                        input.type = "text";
                        input.size = (this["FieldLength"] == 0) ? 20 : this["FieldLength"];
                        input.height = (this["FieldHeight"] == 0) ? 20 : this["FieldHeight"];
                        input.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex + answer["AnswerID"];
                        wrapperSpan.appendChild(input);

                        break;
                    case 4: // XMLCountryList
                        var span = document.createElement("span");
                        span.innerHTML = question["QuestionText"];
                        var select = document.createElement("select");
                        var defaultOption = document.createElement("option");
                        defaultOption.selected = "selected";
                        defaultOption.innerHTML = "[Select Country]";
                        select.appendChild(defaultOption);
                        wrapperSpan.appendChild(span);
                        wrapperSpan.appendChild(document.createElement("br"));
                        wrapperSpan.appendChild(select);

                        break;
                    case 20: // BooleanType
                        var input = document.createElement("input");
                        input.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex + answer["AnswerID"];
                        input.type = "checkbox";
                        input.name = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex;
                        wrapperSpan.appendChild(input);

                        break;
                    case 21: // FieldRequiredType
                        var input = document.createElement("input");
                        input.type = "text";
                        input.size = (this["FieldLength"] == 0) ? 20 : this["FieldLength"];
                        input.height = (this["FieldHeight"] == 0) ? 20 : this["FieldHeight"];
                        input.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex + answer["AnswerID"];
                        wrapperSpan.appendChild(input);

                        break;
                    case 22: // FieldCalendarType
                        var input = document.createElement("input");
                        //input.type = "date";
                        input.placeholder = "mm/dd/yyyy";
                        input.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex + answer["AnswerID"];
                        $(input).datepicker();
                        wrapperSpan.appendChild(input);

                        break;
                    case 24: // FieldLargeType
                        var textArea = document.createElement("textarea");
                        textArea.type = "text";
                        textArea.style.width = "95%";
                        textArea.style.height = "230px";
                        textArea.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex + answer["AnswerID"];
                        wrapperSpan.appendChild(textArea);

                        break;
                    case 26: // FieldEmailType
                        var input = document.createElement("input");
                        input.type = "email";
                        input.placeholder = "emailAddress@emailDomain.com";
                        input.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex + answer["AnswerID"];
                        wrapperSpan.appendChild(input);

                        break;
                    case 27: // FieldHiddenType
                        // do nothing?

                        break;
                    case 28: // FieldPasswordType
                        var input = document.createElement("input");
                        input.type = "password";
                        input.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex + answer["AnswerID"];
                        wrapperSpan.appendChild(input);

                        break;
                    case 29: // SubscriberXMLList


                        break;
                    case 30: // ExtendedFileUploadType
                        var fileUploadInput = document.createElement("input");
                        fileUploadInput.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex + answer["AnswerID"];
                        fileUploadInput.type = "file";
                        var uploadButton = document.createElement("input");
                        uploadButton.type = "submit";
                        var table = document.createElement("table");
                        table.className = "lddl";
                        wrapperSpan.appendChild(fileUploadInput);
                        wrapperSpan.appendChild(uploadButton);
                        wrapperSpan.appendChild(table);

                        break;
                    case 31: // ExtendedFreeTextBoxType


                        break;
                    case 56: // FieldSliderType
                        var sliderValInput = document.createElement("input");
                        sliderValInput.type = "number";
                        var slider = document.createElement("input");
                        slider.type = "range";
                        slider.id = "Q" + question["QuestionID"] + "CQ" + childQuestionIndex + answer["AnswerID"];
                        slider.min = answer["SliderMax"];
                        slider.min = answer["SliderMin"];
                        slider.step = answer["SliderStep"];
                        slider.value = answer["SliderValue"];
                        slider.width = "100%";
                        var sliderChange = function () {
                            sliderValInput.onchange = null;
                            sliderValInput.oninput = null;
                            sliderValInput.value = slider.value;
                            sliderValInput.onchange = sliderValChange;
                            sliderValInput.oninput = sliderValChange;
                        }
                        var sliderValChange = function () {
                            slider.onchange = null;
                            slider.oninput = null;
                            slider.value = sliderValInput.value;
                            slider.onchange = sliderChange;
                            slider.oninput = sliderChange;
                        }
                        sliderValInput.onchange = sliderValChange;
                        sliderValInput.oninput = sliderValChange;
                        slider.onchange = sliderChange;
                        slider.oninput = sliderChange;
                        wrapperSpan.appendChild(sliderValInput);
                        wrapperSpan.appendChild(slider);

                        break;
                    case 57: // Static Text
                        // do nothing?

                        break;
                    default:
                        throw ReferenceError("Unknown Answer Type: " + this["AnswerTypeID"]);

                        break;
                }
                return wrapperSpan;
            }
        }
    });
    AnswerType.prototype.constructor = AnswerType;
    window["AnswerType"] = AnswerType;
    var AnswerTypes = [];
    window["AnswerTypes"] = AnswerTypes;
})();﻿/// <reference path="Question.js" />

(function () {
    var ChildQuestion = function (XMLChildQuestionDom) {

        this["_questionText"] = null;
        this["_parentQuestionID"] = null;

        this["_ParentQuestion"] = new Question();

        if (XMLChildQuestionDom) {
            if (XMLChildQuestionDom.attributes) {
                // dynamically add the elements from the XML file
                for (var i = 0, leni = XMLChildQuestionDom.attributes.length; i < leni; i++) {
                    var attrName = XMLChildQuestionDom.attributes.item(i).name;
                    attrName = attrName.charAt(0).toLowerCase() + attrName.slice(1);
                    if (this["_" + attrName] !== undefined) {
                        try {
                            this["_" + attrName] = JSON.parse(XMLChildQuestionDom.attributes.item(i).value.toLowerCase());
                        } catch (ex) {
                            this["_" + attrName] = XMLChildQuestionDom.attributes.item(i).value;
                        }
                    } else {
                        // if this happens, the field needs added to the constructor
                        throw new ReferenceError("ChildQuestion: Property not found: _" + attrName);
                    }
                }
                // children vs childNodes IE compatability
                if (XMLChildQuestionDom.children) {
                    for (var k = 0, lenk = XMLChildQuestionDom.children.length; k < lenk; k++) {
                        var childName = XMLChildQuestionDom.children[k].tagName;
                        childName = childName.charAt(0).toLowerCase() + childName.slice(1);
                        if (this["_" + childName] !== undefined) {
                            try {
                                this["_" + childName] = JSON.parse(XMLChildQuestionDom.children[k].innerHTML.toLowerCase());
                            } catch (ex) {
                                this["_" + childName] = XMLChildQuestionDom.children[k].innerHTML;
                            }
                        } else {
                            // if this happens, the field needs added to the constructor
                            throw new ReferenceError("ChildQuestion: Property not found: _" + childName);
                        }
                    }
                } else {
                    for (var k = 1, lenk = XMLChildQuestionDom.childNodes.length; k < lenk; k = k + 2) {
                        var childName = XMLChildQuestionDom.childNodes[k].tagName;
                        childName = childName.charAt(0).toLowerCase() + childName.slice(1);
                        if (this["_" + childName] !== undefined) {
                            try {
                                this["_" + childName] = JSON.parse(XMLChildQuestionDom.childNodes[k].textContent.toLowerCase());
                            } catch (ex) {
                                this["_" + childName] = XMLChildQuestionDom.childNodes[k].textContent;
                            }
                        } else {
                            // if this happens, the field needs added to the constructor
                            throw new ReferenceError("ChildQuestion: Property not found: _" + childName);
                        }
                    }
                }
            } else {
                // dynamically add parameters
                for (var key in XMLChildQuestionDom) {
                    var keyName = key.charAt(0).toLowerCase() + key.slice(1);
                    if (this["_" + keyName] !== undefined) {
                        try {
                            this["_" + keyName] = JSON.parse(XMLChildQuestionDom[key]);
                        } catch (ex) {
                            this["_" + keyName] = XMLChildQuestionDom[key];
                        }
                    } else {
                        throw new ReferenceError("ChildQuestion: Property not found: _" + keyName);
                    }
                }
            }
        }

        Object.defineProperties(this, {
            "QuestionText": {
                get: function () {
                    return this["_questionText"];
                },
                set: function (val) {
                    this["_questionText"] = val;
                }
            },
            "ParentQuestionID": {
                get: function () {
                    return this["_parentQuestionID"];
                },
                set: function (val) {
                    this["parentQuestionID"] = val;
                }
            }
        });
    }
    ChildQuestion.prototype = Object.create({}, {
        "AttachToQuestion": {
            value: function (parentQuestion) {
                this["_ParentQuestion"] = parentQuestion;
                parentQuestion["AttachChildQuestion"](this);
            }
        }
    });
    ChildQuestion.prototype.constructor = ChildQuestion;
    window["ChildQuestion"] = ChildQuestion;
})();
﻿/// <reference path="Answer.js" />
/// <reference path="D:\SkyDrive\Web Development\iAspire\www\trunk\www_iAspire\www_iAspire_App\Scripts/jquery-2.1.3.js" />

(function () {
    var Question = function (XMLQuestionDom) {

        this["_questionID"] = null;
        this["_surveyID"] = null;
        this["_layoutModeID"] = null;
        this["_selectionModeID"] = null;
        this["_columnsNumber"] = null;
        this["_minSelectionRequired"] = null;
        this["_maxSelectionAllowed"] = null;
        this["_ratingEnabled"] = null;
        this["_randomizeAnswers"] = null;
        this["_pageNumber"] = null;
        this["_displayOrder"] = null;
        this["_questionText"] = null;
        this["_questionPipeAlias"] = null;
        this["_questionIDText"] = null;
        this["_helpText"] = null;
        this["_alias"] = null;
        this["_showHelpText"] = null;
        this["_oldQuestionID"] = null;
        this["_libraryID"] = null;
        this["_parentQuestionID"] = null;

        /// <field name="SelectedAnswer" type="Answer">Description</field>
        this["SelectedAnswer"] = null;
        this["Answers"] = [];
        this["ChildQuestions"] = [];

        // constructor
        if (XMLQuestionDom) {
            if (XMLQuestionDom.attributes) {
                // dynamically add the elements from the XML file
                for (var i = 0, leni = XMLQuestionDom.attributes.length; i < leni; i++) {
                    var attrName = XMLQuestionDom.attributes.item(i).name;
                    attrName = attrName.charAt(0).toLowerCase() + attrName.slice(1);
                    if (this["_" + attrName] !== undefined) {
                        try {
                            this["_" + attrName] = JSON.parse(XMLQuestionDom.attributes.item(i).value.toLowerCase());
                        } catch (ex) {
                            this["_" + attrName] = XMLQuestionDom.attributes.item(i).value;
                        }
                    } else {
                        // if this happens, the field needs added to the constructor
                        throw new ReferenceError("Question: Property not found: _" + attrName);
                    }
                }
                // children vs childNodes IE compatability
                if (XMLQuestionDom.children) {
                    for (var k = 0, lenk = XMLQuestionDom.children.length; k < lenk; k++) {
                        var childName = XMLQuestionDom.children[k].tagName;
                        childName = childName.charAt(0).toLowerCase() + childName.slice(1);
                        if (this["_" + childName] !== undefined) {
                            try {
                                this["_" + childName] = JSON.parse(XMLQuestionDom.children[k].innerHTML.toLowerCase());
                            } catch (ex) {
                                this["_" + childName] = XMLQuestionDom.children[k].innerHTML;
                            }
                        } else {
                            // if this happens, the field needs added to the constructor
                            throw new ReferenceError("Question: Property not found: _" + childName);
                        }
                    }
                } else {
                    for (var k = 1, lenk = XMLQuestionDom.childNodes.length; k < lenk; k = k + 2) {
                        var childName = XMLQuestionDom.childNodes[k].tagName;
                        childName = childName.charAt(0).toLowerCase() + childName.slice(1);
                        if (this["_" + childName] !== undefined) {
                            try {
                                this["_" + childName] = JSON.parse(XMLQuestionDom.childNodes[k].textContent.toLowerCase());
                            } catch (ex) {
                                this["_" + childName] = XMLQuestionDom.childNodes[k].textContent;
                            }
                        } else {
                            // if this happens, the field needs added to the constructor
                            throw new ReferenceError("Question: Property not found: _" + childName);
                        }
                    }
                }
            } else {
                // dynamically add parameters
                for (var key in XMLQuestionDom) {
                    var keyName = key.charAt(0).toLowerCase() + key.slice(1);
                    if (this["_" + keyName] !== undefined) {
                        try {
                            this["_" + keyName] = JSON.parse(XMLQuestionDom[key]);
                        } catch (ex) {
                            this["_" + keyName] = XMLQuestionDom[key];
                        }
                    } else {
                        throw new ReferenceError("Question: Property not found: _" + keyName);
                    }
                }
            }
        }

        Object.defineProperties(this, {
            "QuestionID": {
                get: function () {
                    return this["_questionID"];
                },
                set: function (val) {
                    this["_questionID"] = val;
                }
            },
            "SurveyID": {
                get: function () {
                    return this["_surveyID"];
                },
                set: function (val) {
                    this["_surveyID"] = val;
                }
            },
            "LayoutModeID": {
                get: function () {
                    return this["_layoutModeID"];
                },
                set: function (val) {
                    this["_layoutModeID"] = val;
                }
            },
            "SelectionModeID": {
                get: function () {
                    return this["_selectionModeID"];
                },
                set: function (val) {
                    this["_selectionModeID"] = val;
                }
            },
            "ColumnsNumber": {
                get: function () {
                    return this["_columnsNumber"];
                },
                set: function (val) {
                    this["_columnsNumber"] = val;
                }
            },
            "MinSelectionRequired": {
                get: function () {
                    return this["_minSelectionRequired"];
                },
                set: function (val) {
                    this["_minSelectionRequired"] = val;
                }
            },
            "MaxSelectionAllowed": {
                get: function () {
                    return this["_maxSelectionAllowed"];
                },
                set: function (val) {
                    this["_maxSelectionAllowed"] = val;
                }
            },
            "RatingEnabled": {
                get: function () {
                    return this["_ratingEnabled"];
                },
                set: function (val) {
                    this["_ratingEnabled"] = val;
                }
            },
            "RandomizeAnswers": {
                get: function () {
                    return this["_randomizeAnswers"];
                },
                set: function (val) {
                    this["_randomizeAnswers"] = val;
                }
            },
            "PageNumber": {
                get: function () {
                    return this["_pageNumber"];
                },
                set: function (val) {
                    this["_pageNumber"] = val;
                }
            },
            "DisplayOrder": {
                get: function () {
                    return this["_displayOrder"];
                },
                set: function (val) {
                    this["_displayOrder"] = val;
                }
            },
            "QuestionText": {
                get: function () {
                    var tA = document.createElement("textarea");
                    tA.innerHTML = this["_questionText"];
                    return tA.textContent;
                },
                set: function (val) {
                    this["_questionText"] = val;
                }
            },
            "QuestionPipeAlias": {
                get: function () {
                    return this["_questionPipeAlias"];
                },
                set: function (val) {
                    this["_questionPipeAlias"] = val;
                }
            },
            "QuestionIDText": {
                get: function () {
                    return this["_questionIDText"];
                },
                set: function (val) {
                    this["_questionIDText"] = val;
                }
            },
            "HelpText": {
                get: function () {
                    return this["_helpText"];
                },
                set: function (val) {
                    this["_helpText"] = val;
                }
            },
            "Alias": {
                get: function () {
                    return this["_alias"];
                },
                set: function (val) {
                    this["_alias"] = val;
                }
            },
            "ShowHelpText": {
                get: function () {
                    return this["_showHelpText"];
                },
                set: function (val) {
                    this["_showHelpText"] = val;
                }
            },
            "OldQuestionID": {
                get: function () {
                    return this["_oldQuestionID"];
                },
                set: function (val) {
                    this["_oldQuestionID"] = val;
                }
            },
            "LibraryID": {
                get: function () {
                    return this["_libraryID"];
                },
                set: function (val) {
                    this["_libraryID"] = val;
                }
            },
            "ParentQuestionID": {
                get: function () {
                    return this["_parentQuestionID"];
                },
                set: function (val) {
                    this["_parentQuestionID"] = val;
                }
            }
        });
    }
    Question.prototype = Object.create({}, {
        "GenerateHTML": {
            value: function () {
                /// <param name="answers" type="Array" elementType="Answer">Description</param>
                /// <param name="childQuestions" type="Array" elementType="ChildQuestion">Description</param>
                var that = this;
                var answers = that["Answers"];
                var childQuestions = that["ChildQuestions"];
                if (that["RandomizeAnswers"]) {
                    answers.sort(Question.prototype.SortByDisplayOrder);
                }

                var questionItemWrapper = document.createElement("tr");
                var questionItemWrapperCell = document.createElement("td");
                var questionItemWrapperSpan = document.createElement("span");
                questionItemWrapperSpan.id = "SurveyControl_Question" + that["QuestionID"];
                var questionItemWrapperTable = document.createElement("table");
                questionItemWrapperTable.cellPadding = 2;
                questionItemWrapperTable.cellSpacing = 0;
                questionItemWrapperTable.style.width = "100%";
                questionItemWrapperTable.style.borderCollapse = "collapse";
                questionItemWrapperTable.style.tableLayout = "fixed";
                var questionItemWrapperTableBody = document.createElement("tbody");

                // assemble question item wrapper
                questionItemWrapperTable.appendChild(questionItemWrapperTableBody);
                questionItemWrapperSpan.appendChild(questionItemWrapperTable);
                questionItemWrapperCell.appendChild(questionItemWrapperSpan);
                questionItemWrapper.appendChild(questionItemWrapperCell);

                var questionWrapper = document.createElement("tr");
                questionWrapper.className = "questionStyle";
                var questionWrapperCell = document.createElement("td");
                var questionWrapperSpan = document.createElement("span");
                var questionWrapperDiv = document.createElement("div");

                // insert question text
                //var qText = document.createTextNode(qElement.QuestionText);
                var qText = document.createElement("div");
                qText.className = "question-text-div";
                qText.innerHTML = that["QuestionText"];

                if (that["ShowHelpText"]) {
                    var helpTextDiv = document.createElement("div");
                    helpTextDiv.className = "HelpTextSmallFont";
                    helpTextDiv.innerHTML = that["HelpText"];
                    qText.appendChild(helpTextDiv);
                }

                questionWrapperDiv.appendChild(qText);

                // assemble question item wrapper
                questionWrapperSpan.appendChild(questionWrapperDiv);
                questionWrapperCell.appendChild(questionWrapperSpan);
                questionWrapper.appendChild(questionWrapperCell);

                // create wrappers for answers
                var answerItemsWrapper = document.createElement("tr");
                answerItemsWrapper.className = "answerStyle";
                var answerItemsWrapperCell = document.createElement("td");
                var answerItemsWrapperTable = document.createElement("table");
                answerItemsWrapperTable.cellPadding = 2;
                answerItemsWrapperTable.cellSpacing = 0;
                answerItemsWrapperTable.style.width = "100%";
                answerItemsWrapperTable.style.borderCollapse = "collapse";
                answerItemsWrapperTable.style.tableLayout = "fixed";
                var answerItemsWrapperTBody = document.createElement("tbody");
                var answerItemsWrapperTR = document.createElement("tr");
                var answerItemsWrapperCell2 = document.createElement("td");
                var answerItemsWrapperTable2 = document.createElement("table");
                answerItemsWrapperTable2.cellPadding = 2;
                answerItemsWrapperTable2.cellSpacing = 0;
                answerItemsWrapperTable2.style.width = "100%";
                answerItemsWrapperTable2.style.borderCollapse = "collapse";
                answerItemsWrapperTable2.style.tableLayout = "fixed";
                var answerItemsWrapperTBody2 = document.createElement("tbody");

                // assemble answers wrapper
                answerItemsWrapperTable2.appendChild(answerItemsWrapperTBody2);
                answerItemsWrapperCell2.appendChild(answerItemsWrapperTable2);
                answerItemsWrapperTR.appendChild(answerItemsWrapperCell2);
                answerItemsWrapperTBody.appendChild(answerItemsWrapperTR);
                answerItemsWrapperTable.appendChild(answerItemsWrapperTBody);
                answerItemsWrapperCell.appendChild(answerItemsWrapperTable);
                answerItemsWrapper.appendChild(answerItemsWrapperCell);

                switch (that["SelectionModeID"]) {

                    case 1: // RadioButtonSelection
                    case 2: // CheckBoxSelection
                        if (that.LayoutModeID === 2) {
                            var verticalWrapper = document.createElement("tr");
                            answers.forEach(function (ansElement, ansIndex, ansArray) {
                                /// <param name="ansElement" type="Answer">Description</param>
                                verticalWrapper.appendChild(ansElement["GenerateHTML"]());
                            });
                            answerItemsWrapperTBody2.appendChild(verticalWrapper);
                        } else {
                            answers.forEach(function (ansElement, ansIndex, ansArray) {
                                /// <param name="ansElement" type="Answer">Description</param>
                                answerItemsWrapperTBody2.appendChild(ansElement["GenerateHTML"]());
                            });
                        }

                        break;

                    case 3: // DropDownListSelection
                        var selectTR = document.createElement("tr");
                        selectTR.className = "answerStyle";
                        var selectCell = document.createElement("td");
                        selectCell.vAlign = "top";
                        var selectSpan = document.createElement("span");
                        var select = document.createElement("select");
                        var optionPlaceholder = document.createElement("option");
                        optionPlaceholder.value = -1;
                        optionPlaceholder.innerHTML = "[Select an answer]";
                        select.appendChild(optionPlaceholder);

                        answers.forEach(function (ansElement, ansIndex, ansArray) {
                            /// <param name="ansElement" type="Answer">Description</param>
                            select.appendChild(ansElement["GenerateHTML"]());
                        });
                        selectSpan.appendChild(select);
                        selectCell.appendChild(selectSpan);
                        selectTR.appendChild(selectCell);
                        answerItemsWrapperTBody2.appendChild(selectTR);
                        break;

                    case 5: // StaticTextSelection
                        questionItemWrapperSpan.innerHTML = "";
                        questionItemWrapperSpan.innerHTML = that["QuestionText"];
                        break;

                    case 4: // MatrixSingleSelection
                    case 6: // MatrixMultipleSelection

                        var matrixWrapperDiv = document.createElement("div");
                        matrixWrapperDiv.className = "ScrollableDiv";
                        var matrixWrapperTable = document.createElement("table");
                        matrixWrapperTable.cellPadding = 2;
                        matrixWrapperTable.cellSpacing = 2;
                        matrixWrapperTable.style.width = "100%";
                        matrixWrapperTable.className = "matrixStyle";
                        var matrixWrapperTableBody = document.createElement("tbody");

                        // create header
                        var matrixHeader = document.createElement("tr");
                        matrixHeader.className = "mhStyle";
                        matrixHeader.appendChild(document.createElement("td"));
                        answers.forEach(function (answer) {
                            /// <param name="answer" type="Answer">Description</param>
                            var questionCell = document.createElement("td");
                            questionCell.align = "center";
                            questionCell.vAlign = "top";
                            questionCell.innerHTML = answer["AnswerText"];
                            matrixHeader.appendChild(questionCell);
                        });
                        matrixWrapperTableBody.appendChild(matrixHeader);

                        var bit = 0;
                        // create rows
                        childQuestions.forEach(function (childQuestion, index) {
                            /// <param name="childQuestion" type="Question">Description</param>
                            var childQuestionRow = document.createElement("tr");
                            if (bit === 0) {
                                childQuestionRow.className = "miStyle";
                                bit = 1;
                            } else {
                                childQuestionRow.className = "maiStyle";
                                bit = 0;
                            }

                            var rowHeader = document.createElement("td");
                            rowHeader.vAlign = "top";
                            rowHeader.innerHTML = childQuestion["QuestionText"];

                            childQuestionRow.appendChild(rowHeader);

                            answers.forEach(function (answer) {
                                /// <param name="answer" type="Answer">Description</param>
                                var rowWrapper = document.createElement("td");

                                rowWrapper.appendChild(answer["AnswerType"]["RenderAnswerTypeForMatrix"](that, answer, index));
                                childQuestionRow.appendChild(rowWrapper);
                            });

                            matrixWrapperTableBody.appendChild(childQuestionRow);
                        });

                        matrixWrapperDiv.appendChild(matrixWrapperTable);
                        matrixWrapperTable.appendChild(matrixWrapperTableBody);

                        answerItemsWrapperCell2.innerHTML = "";
                        answerItemsWrapperCell2.appendChild(matrixWrapperDiv);

                        break;
                }

                questionItemWrapperTableBody.appendChild(questionWrapper);
                questionItemWrapperTableBody.appendChild(answerItemsWrapper);
                return questionItemWrapper;
            }
        },
        "SortByDisplayOrder": {
            value: function (a, b) {
                /// <param name="a" type="Question">Description</param>
                /// <param name="b" type="Question">Description</param>
                return a["DisplayOrder"] - b["DisplayOrder"];
            }
        },
        "SetSelectedAnswer": {
            value: function (val) {
                this["SelectedAnswer"] = val;
            }
        },
        "AttachAnswer": {
            value: function (ans) {
                this["Answers"].push(ans);
            }
        },
        "AttachChildQuestion": {
            value: function (cq) {
                this["ChildQuestions"].push(cq);
            }
        }
    });
    Question.prototype.constructor = Question;
    window["Question"] = Question;
})();
﻿
var QuestionSelectionModes = [];

var QuestionSelectionMode = function () {
    /// <field name="QuestionSelectionModeID" type="Number" integer="true"></field>
    this["QuestionSelectionModeID"] = null;
    /// <field name="Description" type="String"></field>
    this["Description"] = null;
    /// <field name="TypeNameSpace" type="String"></field>
    this["TypeNameSpace"] = null;
    /// <field name="TypeAssembly" type="String"></field>
    this["TypeAssembly"] = null;
    /// <field name="TypeMode" type="Number" integer="true"></field>
    this["TypeMode"] = null;
}
window["QuestionSelectionMode"] = QuestionSelectionMode;

var qsm1 = new QuestionSelectionMode();
qsm1.QuestionSelectionModeID = 1;
qsm1.Description = "RadioButtonSelection";
qsm1.TypeNameSpace = "Votations.NSurvey.WebControls.UI.RadioButtonQuestion";
qsm1.TypeAssembly = "Votations.NSurvey.WebControls";
qsm1.TypeMode = 7;
QuestionSelectionModes[1] = qsm1;

var qsm2 = new QuestionSelectionMode();
qsm2.QuestionSelectionModeID = 2;
qsm2.Description = "CheckBoxSelection";
qsm2.TypeNameSpace = "Votations.NSurvey.WebControls.UI.CheckBoxQuestion";
qsm2.TypeAssembly = "Votations.NSurvey.WebControls";
qsm2.TypeMode = 23;
QuestionSelectionModes[2] = qsm2;

var qsm3 = new QuestionSelectionMode();
qsm3.QuestionSelectionModeID = 3;
qsm3.Description = "DropDownListSelection";
qsm3.TypeNameSpace = "Votations.NSurvey.WebControls.UI.DropDownQuestion";
qsm3.TypeAssembly = "Votations.NSurvey.WebControls";
qsm3.TypeMode = 7;
QuestionSelectionModes[3] = qsm3;

var qsm4 = new QuestionSelectionMode();
qsm4.QuestionSelectionModeID = 4;
qsm4.Description = "MatrixSingleSelection";
qsm4.TypeNameSpace = "Votations.NSurvey.WebControls.UI.MatrixQuestion";
qsm4.TypeAssembly = "Votations.NSurvey.WebControls";
qsm4.TypeMode = 14;
QuestionSelectionModes[4] = qsm4;

var qsm5 = new QuestionSelectionMode();
qsm5.QuestionSelectionModeID = 5;
qsm5.Description = "StaticTextSelection";
qsm5.TypeNameSpace = "Votations.NSurvey.WebControls.UI.StaticQuestion";
qsm5.TypeAssembly = "Votations.NSurvey.WebControls";
qsm5.TypeMode = 3;
QuestionSelectionModes[5] = qsm5;

var qsm6 = new QuestionSelectionMode();
qsm6.QuestionSelectionModeID = 6;
qsm6.Description = "MatrixMultipleSelection";
qsm6.TypeNameSpace = "Votations.NSurvey.WebControls.UI.CheckBoxMatrixQuestion";
qsm6.TypeAssembly = "Votations.NSurvey.WebControls";
qsm6.TypeMode = 30;
QuestionSelectionModes[6] = qsm6;

window["QuestionSelectionModes"] = QuestionSelectionModes;﻿
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
