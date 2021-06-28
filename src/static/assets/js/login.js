var ref = getAllUrlParams().ref;

if (ref !== undefined) {
    $("login").action = "/api/hdata/login/?ref=" + ref;
}

var error = getAllUrlParams().error;

if (error !== undefined && error !== "OK") {
    $("loginError").style.display = "block";
    if (error !== "AERR") {
        $("loginErrorText").textContent = errorCodeToMsg(error);
    }
}

function updateServerInfo(data) {
    serverInfo = data;
    if (serverInfo.status !== 'OK') {
        $("serverError").style.display = "block";
        $("serverErrorText").title = JSON.stringify(serverInfo);
        setTimeout(() => {
            if (confirm("Connection to HData server lost, try to reconnect?")) {
                reconnect();
            }
        }, 100)

    }
}

fetch("/api/hdata/status").then(response => response.json()).then(data => updateServerInfo(data)).catch((error) => { console.log(error); });