/// <reference path="Contracts/Answer.js" />
/// <reference path="Contracts/AnswerType.js" />
/// <reference path="Contracts/ChildQuestion.js" />
/// <reference path="Contracts/Question.js" />
/// <reference path="Contracts/Survey.js" />
/// <reference path="Contracts/QuestionSelectionMode.js" />

function readSurveyXML(inputElement) {
    var f = inputElement.files[0];
    if (f) {
        var r = new FileReader();
        r.onload = function (evt) {
            var returnVal = null;
            if (window.DOMParser) {
                var parser = new DOMParser();
                returnVal = parser.parseFromString(evt.target.result, "text/xml");
            } else {
                returnVal = new ActiveXObject("Microsoft.XMLDOM");
                returnVal.async = false;
                returnVal.loadXML(evt.target.result);
            }
            PrepXMLData(returnVal);
        }
        r.readAsText(f);
    }
}

function SurveyObject() {
    this.Survey = new Survey();
    /// <field name="AnswerTypes" type="Array" elementType="AnswerType">The available AnswerTypes</field>
    this.AnswerTypes = [];
    /// <field name="Questions" type="Array" elementType="Question">The available AnswerTypes</field>
    this.Questions = [];
    /// <field name="ChildQuestions" type="Array" elementType="ChildQuestion">The available AnswerTypes</field>
    this.ChildQuestions = [];
    /// <field name="Answers" type="Array" elementType="Answer">The available AnswerTypes</field>
    this.Answers = [];
}

function PrepXMLData(xmlData) {
    /// <param name="xmlData" type="HTMLElement">The xml file to create the survey with</param>
    
    var surveyObj = new SurveyObject();

    var _answerTypes = xmlData.getElementsByTagName("AnswerType");
    var _survey = xmlData.getElementsByTagName("Survey");
    var _questions = xmlData.getElementsByTagName("Question");
    var _childQuestions = xmlData.getElementsByTagName("ChildQuestion");
    var _answers = xmlData.getElementsByTagName("Answer");

    for (var i = 0, leni = _answerTypes.length; i < leni; i++) {
        surveyObj.AnswerTypes.push(new AnswerType(_answerTypes[i]));
        AnswerTypes[surveyObj.AnswerTypes[i].AnswerTypeID] = surveyObj.AnswerTypes[i];
    }
    for (var k = 0, lenk = _survey.length; k < lenk; k++) {
        surveyObj.Survey = new SurveyObject(_survey[k]);
    }
    for (var j = 0, lenj = _questions.length; j < lenj; j++) {
        surveyObj.Questions.push(new Question(_questions[j]));
    }
    for (var n = 0, lenn = _childQuestions.length; n < lenn; n++) {
        surveyObj.ChildQuestions.push(new ChildQuestion(_childQuestions[n]));
    }
    for (var q = 0, lenq = _answers.length; q < lenq; q++) {
        surveyObj.Answers.push(new Answer(_answers[q]));
    }
    
    // attach the answerTypes to the answers
    surveyObj.Answers.forEach(function (aObj) {
        /// <param name="aObj" type="Answer">Description</param>
        aObj.AttachAnswerTypeObject(AnswerTypes[aObj.AnswerTypeID]);
    });

    // tie the parent question to each answer
    surveyObj.Questions.forEach(function (qObj) {
        surveyObj.Answers.forEach(function (aObj) {
            if (qObj.QuestionID === aObj.QuestionID) {
                aObj.AttachToQuestion(qObj);
            }
        });
        surveyObj.ChildQuestions.forEach(function (cqObj) {
            if (cqObj.ParentQuestionID === qObj.QuestionID) {
                cqObj.AttachToQuestion(qObj);
            }
        });
    })

    // sort the questions
    surveyObj.Questions.sort(Question.prototype.SortByDisplayOrder);

    drawSurvey(surveyObj);
}

function prepServerResponse(surveyResponse) {
    console.log(surveyResponse);
    var surveyObject = new SurveyObject();

    surveyResponse.AnswerTypes.forEach(function (atObj) {
        var answerType = new AnswerType(atObj)
        surveyObject.AnswerTypes.push(answerType);
        AnswerTypes[atObj.AnswerTypeID] = answerType;
    });
    surveyResponse.Answers.forEach(function (aObj) {
        surveyObject.Answers.push(new Answer(aObj));
    });
    surveyResponse.Questions.forEach(function (qObj) {
        surveyObject.Questions.push(new Question(qObj));
    });
    surveyResponse.Surveys.forEach(function (sObj) {
        surveyObject.Survey = new Survey(sObj);
    });
    surveyResponse.ChildQuestions.forEach(function (cqObj) {
        surveyObject.ChildQuestions.push(new ChildQuestion(cqObj));
    });
    
    // attach the answerTypes to the answers
    surveyObject.Answers.forEach(function (aObj) {
        /// <param name="aObj" type="Answer">Description</param>
        aObj.AttachAnswerTypeObject(AnswerTypes[aObj.AnswerTypeID]);
    });

    // tie the parent question to each answer
    surveyObject.Questions.forEach(function (qObj) {
        surveyObject.Answers.forEach(function (aObj) {
            if (qObj.QuestionID === aObj.QuestionID) {
                aObj.AttachToQuestion(qObj);
            }
        });
        surveyObject.ChildQuestions.forEach(function (cqObj) {
            if (cqObj.ParentQuestionID === qObj.QuestionID) {
                cqObj.AttachToQuestion(qObj);
            }
        });
    })

    // sort the questions
    surveyObject.Questions.sort(Question.prototype.SortByDisplayOrder);
    console.log(surveyObject);

    return drawSurvey(surveyObject);
}
window.PrepServerResponse = (function (surveyResponse) {
    "use strict";
    return (function () {
        return prepServerResponse(surveyResponse);
    })();
});

function drawSurvey(surveyObj) {
    var startTime = null;
    if (performance.now) {
        startTime = performance.now();
    }

    window.ActiveSurvey = surveyObj;

    // create Survey Wrapper Box
    var surveyContainer = document.createElement("div");
    surveyContainer.className = "container";

    var form = document.createElement("form");
    form.id = "Form1";
    form.className = "form-inline";
    surveyContainer.appendChild(form);

    var surveyWrapperDiv = document.createElement("div");
    surveyWrapperDiv.className = "container panel panel-default";
    //surveyWrapperDiv.style.marginTop = "15px";
    form.appendChild(surveyWrapperDiv);

    var surveyWrapperSpan = document.createElement("span");
    surveyWrapperSpan.id = "SurveyControl";
    surveyWrapperSpan.className = "surveybox";
    //var header = document.createTextNode("this is where the header will go");
    //var footer = document.createTextNode("this is where the footer will go");
    //surveyWrapperSpan.appendChild(header);

    var surveyWrapperTable = document.createElement("table");
    var surveyWrapperTableBody = document.createElement("tbody");
    surveyWrapperTable.appendChild(surveyWrapperTableBody);

    surveyWrapperSpan.appendChild(surveyWrapperTable);
    //surveyWrapperSpan.appendChild(footer);
    surveyWrapperDiv.appendChild(surveyWrapperSpan);

    // render each question with answers
    surveyObj.Questions.forEach(function (qElement, qIndex, qArray) {
        /// <param name="qElement" type="Question">Survey Question Object</param>
        surveyWrapperTableBody.appendChild(qElement.GenerateHTML());
    });

    //var placeholder = document.getElementById("surveyPlaceholder");
    //placeholder.appendChild(surveyContainer);

    if (performance.now) {
        console.log("Elapsed render time: " + (performance.now() - startTime) + "ms");
    }

    return surveyContainer;
}