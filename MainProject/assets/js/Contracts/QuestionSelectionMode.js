
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

window["QuestionSelectionModes"] = QuestionSelectionModes;