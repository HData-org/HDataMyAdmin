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