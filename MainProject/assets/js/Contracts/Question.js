/// <reference path="Answer.js" />
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
