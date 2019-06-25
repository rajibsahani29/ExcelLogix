/// <reference path="Question.js" />
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
})();