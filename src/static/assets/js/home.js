var serverInfo;

function updateInfo() {
    fetch("/api/info")
    .then(response => response.json())
    .then((data) => {
        $("hdmaVersion").textContent = data["hdmaVersion"];
        var serverHost = data["connectionInfo"]["host"] + ":" + data["connectionInfo"]["port"];
        $("serverHost").textContent = serverHost;
        $("databaseInfo").innerHTML =
        "<li>Server: " +
        data["connectionInfo"]["host"] +
        " on port " +
        data["connectionInfo"]["port"] +
        "</li>" +
        "<li>Server type: HData</li>" +
        "<li>HData version: " +
        serverInfo.version +
        "</li>" +
        "<li>User: <span id=\"loggedInUser\">" +
        loggedInUser +
        "</span>@" +
        data["connectionInfo"]["host"] +
        "</li>"
        ;
    })
}

function updateServerInfo(data) {
    serverInfo = data;
    var html = '<span class="material-icons icon txt-red">link_off</span> <span>&nbsp;Server not connected</span>';
    if(serverInfo.status == 'OK') {
        html = '<span class="material-icons icon">link</span> <span>&nbsp;Server:&nbsp;</span> <span id="serverHost">localhost:8888</span>';
    }
    $("serverInfo").title = JSON.stringify(serverInfo);
    $("serverInfo").innerHTML = html;
    updateInfo();
}

fetch("/api/hdata/status")
    .then(response => response.json())
    .then(data => updateServerInfo(data))