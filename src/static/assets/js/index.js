var loggedInUser;
setTimeout(() => {
    fetch("/api/hdata/login").then(response => response.json()).then((json) => {
        if(json.auth) {
            console.log('Logged in as ' + json.username);
            loggedInUser = json.username;
            try {
                $("loggedInUser").textContent = loggedInUser;
            } catch (err) { }
        } else {
            window.location = '/login.html';
        }
    });
}, 100)

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