/// <reference path="Question.js" />

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
