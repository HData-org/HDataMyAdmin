var error = getAllUrlParams().error;

if(error !== undefined && error !== "OK") {
    $("loginError").style.display = "block";
    if(error !== "AERR") {
        $("loginErrorText").textContent = errorCodeToMsg(error);
    }
}

function updateServerInfo(data) {
    serverInfo = data;
    if(serverInfo.status !== 'OK') {
        $("serverError").style.display = "block";
        $("serverErrorText").title = JSON.stringify(serverInfo);
    }
}

fetch("/api/hdata/status")
    .then(response => response.json())
    .then(data => updateServerInfo(data));