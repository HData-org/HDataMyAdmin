var loggedInUser;

fetch("/api/hdata/login").then(response => response.json()).then((json) => {
    if(json.auth) {
        console.log("Logged in as " + json.username);
        loggedInUser = json.username;
        try {
            $("loggedInUser").textContent = loggedInUser;
        } catch (err) { }
    } else {
        window.location = "/login.html";
    }
});

var serverInfo;

function updateInfo() {
    fetch("/api/info")
    .then(response => response.json())
    .then((data) => {
        var serverHost = data["connectionInfo"]["host"] + ":" + data["connectionInfo"]["port"];
        $("serverHost").textContent = serverHost;
        if(typeof page !== 'undefined' && page == 'home') {
            $("hdmaVersion").textContent = data["hdmaVersion"];
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
        }
    });
}

function updateServerInfo(data) {
    serverInfo = data;
    var html = '<span class="material-icons icon txt-red">link_off</span>&nbsp;<span>Server not connected</span>';
    if(serverInfo.status == 'OK') {
        html = '<span class="material-icons icon">link</span>&nbsp;<span>Server:&nbsp;</span> <span id="serverHost">localhost:8888</span>';
    }
    $("serverInfo").title = JSON.stringify(serverInfo);
    $("serverInfo").innerHTML = html;
    try {
        updateInfo();
    } catch (err) {}
}

fetch("/api/hdata/status")
    .then(response => response.json())
    .then(data => updateServerInfo(data))