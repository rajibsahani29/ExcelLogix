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
