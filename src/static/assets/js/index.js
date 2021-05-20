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

function goToTable(tableName) {
    if(tableName == "" || tableName === undefined) {
        window.location = "./tables.html";
    } else {
	    window.location = "./table.html?name=" + tableName;
    }
}

function newTable(redirectUrl = "browse") {
	var tableName = prompt("Create a new table with the name: ");
    if (tableName != null) {
        console.log("Creating new table with the name: "+tableName);
        fetch("/api/hdata/createtable?tableName="+tableName).then(response => response.json()).then((data) => {
            if(data.status == "OK") {
                if(redirectUrl === "reload") {
                    location.reload();
                } else if(redirectUrl === "browse"){
                    location = './table.html?name='+tableName;
                } else {
                    location = redirectUrl;
                }
            } else {
                var errMsg = errorCodeToMsg(data.status);
                alert("Error creating table "+tableName+" "+errMsg+" ("+JSON.stringify(data)+")");
            }
        });
    }
}

function deleteTable(tableName, redirectUrl = "reload") {
    if(confirm('Are you sure you want to DELETE table "'+ tableName +'"?')) {
        console.log("Deleting table"+tableName);
        fetch("/api/hdata/deletetable?tableName="+tableName).then(response => response.json()).then((data) => {
            if(data.status == "OK") {
                if(redirectUrl === "reload") {
                    location.reload();
                } else {
                    location = redirectUrl;
                }
            } else {
                var errMsg = errorCodeToMsg(data.status);
                alert("Error deleting table "+tableName+" "+errMsg+" ("+JSON.stringify(data)+")");
            }
        });
    }
}

function createTable1D(parentElement, tableName, data) {
	parentElement.innerHTML = "";
    var tables = document.createElement('table');
    var tableHeader = document.createElement('th');
    tableHeader.appendChild(document.createTextNode(tableName));
    tables.appendChild(tableHeader);
    for(var i = 0; i <= data.length-1; i++) {
        var key = data[i];
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(key));
        row.appendChild(cell);
        tables.appendChild(row);
    }
    parentElement.appendChild(tables);
}

function createTable2D(array) {
    var table = document.createElement("table");
    for (var i = 0; i < array.length; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < array[i].length; j++) {
            var cell = document.createElement("td");
            cell.textContent = array[i][j];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    return table;
}

function updateNavTabs(navTabsInfo) {
    $("navTabs").innerHTML = "";
    var tabs = document.createElement("div");
    var tab = document.createElement("div");
    tab.setAttribute("class", "has-shadow");
    $("navTabs").appendChild(tab);
    for (var i = 0; i < Object.keys(navTabsInfo).length; i++) {
        tabInfo = navTabsInfo[i];
        console.log(tabInfo);
        var tab = document.createElement("a");
        tab.setAttribute("class", "nav-tab");
        if(tabInfo.href === "currentPage") {
            tab.setAttribute("href", window.location);
        } else {
            tab.setAttribute("href", tabInfo.href);
        }
        if(tabInfo.active) {
            tab.classList.add("active");
        }
        tab.appendChild(document.createTextNode(tabInfo.name));
        tabs.appendChild(tab);
    }
    $("navTabs").appendChild(tabs);
}

function updateTree() {
    var currentTable = getAllUrlParams().name;
    fetch("/api/hdata/gettables").then(response => response.json()).then((data) => {
        $("navTree").innerHTML = "";
        var treeRoot = document.createElement("div");
        if(typeof page !== 'undefined' && page == 'tables') {
            treeRoot.setAttribute("class", "tree-item active");
        } else {
            treeRoot.setAttribute("class", "tree-item");
        }
        treeRoot.setAttribute("onclick", "goToTable()");
        var icon = document.createElement("span");
        icon.setAttribute("class", "material-icons vam");
        icon.appendChild(document.createTextNode("arrow_drop_down"));
        treeRoot.appendChild(document.createTextNode("Tables"));
        treeRoot.appendChild(icon);
        $("navTree").appendChild(treeRoot);
        var treeItems = document.createElement("div");
        treeItems.setAttribute("class", "tree-items");
        for(var i = 0; i <= data.value.length-1; i++) {
            var tableName = data.value[i];
            var treeItem = document.createElement("div");
            if(currentTable === tableName) {
                treeItem.setAttribute("class", "tree-item active");
            } else {
                treeItem.setAttribute("class", "tree-item");
            }
            treeItem.setAttribute("onclick", 'goToTable("'+tableName+'")');
            treeItem.appendChild(document.createTextNode(tableName));
            treeItems.appendChild(treeItem);
        }
        $("navTree").appendChild(treeItems);
    });
}

updateTree();

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
    .then(data => updateServerInfo(data));