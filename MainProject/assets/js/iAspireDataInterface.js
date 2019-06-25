
function login() {
    obj = {
        UserLoginUserName: "admin",
        UserLoginPassword: "SP_admin01",
        ModuleName: "iAspireTestApp"
    }
    xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost/iAspireWebAPI/api/" + "Users/Validate", false)
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.response);
            //var win = window.open("");
            //win.document.body.innerHTML = xhr.response;
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(JSON.stringify(obj));
}


function login2() {
    xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost/iAspireWebAPI/api/" + "Users/Validate" + "?accessID=df4e0df4-35c1-444a-badf-6037cd2e94fb", false)
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.response);
            //var win = window.open("");
            //win.document.body.innerHTML = xhr.response;
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send();
}

function getSurvey() {
    xhr = new XMLHttpRequest(surveyID);
    xhr.open("GET", "http://localhost/iAspireWebAPI/api/" + "Survey/Current" + "?surveyID=" + surveyID, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var surveyResponse = JSON.parse(xhr.response);
            window.SurveyResponse = surveyResponse;
            prepServerResponse(surveyResponse);
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("X-iA-AccessID", "DF4E0DF4-35C1-444A-BADF-6037CD2E94FB");
    xhr.send();
}

function getSurveys() {
    xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost/iAspireWebAPI/api/" + "Survey/Current", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("X-iA-AccessID", "DF4E0DF4-35C1-444A-BADF-6037CD2E94FB");
    xhr.send();
}