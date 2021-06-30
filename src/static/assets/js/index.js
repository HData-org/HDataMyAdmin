var loggedInUser;

fetch("/api/hdata/login").then(response => response.json()).then((json) => {
    if (json.auth) {
        console.log("Logged in as " + json.username);
        loggedInUser = json.username;
        try {
            $("loggedInUser").textContent = loggedInUser;
        } catch (err) { }
        if (typeof page !== 'undefined' && page == 'users') {
            getUser(loggedInUser);
        }
    } else {
        console.log("Not logged in, redirecting");
        location = "/login.html?ref=" + currLoc;
    }
}).catch((error) => {
    console.log(error);
});

function goToTable(tableName) {
    if (tableName == "" || tableName === undefined) {
        window.location = "./tables.html";
    } else {
        window.location = "./table.html?name=" + tableName;
    }
}

/* HData functions */

function newTable(redirectUrl = "browse") {
    var tableName = prompt("Create a new table with the name: ");
    if (tableName != null) {
        console.log("Creating new table with the name: " + tableName);
        const formData = new URLSearchParams();
        formData.append("tableName", tableName);
        fetch('/api/hdata/createtable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        }).then(response => response.json()).then((data) => {
            if (data.status == "OK") {
                if (redirectUrl === "reload") {
                    location.reload();
                } else if (redirectUrl === "browse") {
                    location = './table.html?name=' + tableName;
                } else {
                    location = redirectUrl;
                }
            } else {
                var errMsg = errorCodeToMsg(data.status);
                alert("Error creating table \"" + tableName + "\": " + errMsg + " (" + JSON.stringify(data) + ")");
            }
        }).catch((error) => {
            console.log(error);
            alert("Error creating table \"" + tableName + "\": " + error);
        });
    }
}

function deleteTable(tableName, redirectUrl = "reload") {
    if (confirm("Are you sure you want to DELETE table \"" + tableName + "\"?")) {
        if (tableName != null) {
            console.log("Deleting table: " + tableName);
            const formData = new URLSearchParams();
            formData.append("tableName", tableName);
            fetch('/api/hdata/deletetable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            }).then(response => response.json()).then((data) => {
                if (data.status == "OK") {
                    if (redirectUrl === "reload") {
                        location.reload();
                    } else {
                        location = redirectUrl;
                    }
                } else {
                    var errMsg = errorCodeToMsg(data.status);
                    alert("Error deleting table \"" + tableName + "\": " + errMsg + " (" + JSON.stringify(data) + ")");
                }
            }).catch((error) => {
                console.log(error);
                alert("Error deleting table \"" + tableName + "\": " + error);
            });
        }
    }
}

function setKey(tableName, keyName, value, redirectUrl = "reload") {
    if (tableName != null) {
        const formData = new URLSearchParams();
        formData.append("tableName", tableName);
        formData.append("keyName", keyName);
        formData.append("value", value);
        fetch('/api/hdata/setkey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        }).then(response => response.json()).then((data) => {
            if (data.status == "OK") {
                if (redirectUrl === "reload") {
                    location.reload();
                } else {
                    location = redirectUrl;
                }
            } else {
                var errMsg = errorCodeToMsg(data.status);
                alert("Error seting key \"" + keyName + "\": " + errMsg + " (" + JSON.stringify(data) + ")");
            }
        }).catch((error) => {
            console.log(error);
            alert("Error seting key \"" + keyName + "\": " + error);
        });
    }
}

function deleteKey(tableName, keyName, redirectUrl = "reload") {
    if (confirm("Are you sure you want to DELETE key \"" + keyName + "\"?")) {
        if (tableName != null) {
            console.log("Deleting key: " + tableName);
            const formData = new URLSearchParams();
            formData.append("tableName", tableName);
            formData.append("keyName", keyName);
            fetch('/api/hdata/deletekey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            }).then(response => response.json()).then((data) => {
                if (data.status == "OK") {
                    if (redirectUrl === "reload") {
                        location.reload();
                    } else {
                        location = redirectUrl;
                    }
                } else {
                    var errMsg = errorCodeToMsg(data.status);
                    alert("Error deleting key \"" + keyName + "\": " + errMsg + " (" + JSON.stringify(data) + ")");
                }
            }).catch((error) => {
                console.log(error);
                alert("Error deleting key \"" + keyName + "\": " + error);
            });
        }
    }
}

/* page content */

function showErrorMsg(id, msg) {
    $(id).style.display = "block";
    $(id + "Text").textContent = msg;
}

function hideErrorMsg(id) {
    $(id).style.display = "none";
}

$("settingsLink").href = "./settings.html?ref=" + currLoc;

function createTable1D(parentElement, tableName, data) {
    parentElement.innerHTML = "";
    var tables = document.createElement('table');
    var tableHeader = document.createElement('th');
    tableHeader.appendChild(document.createTextNode(tableName));
    tables.appendChild(tableHeader);
    for (var i = 0; i <= data.length - 1; i++) {
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

function updateBreadcrumbs(breadcrumbsInfo) {
    $("breadcrumbs").innerHTML = "";
    var breadcrumbs = document.createElement("span");
    breadcrumbs.setAttribute("class", "breadcrumbs");
    for (var i = 0; i < Object.keys(breadcrumbsInfo).length; i++) {
        var breadcrumbInfo = breadcrumbsInfo[i];
        var arrow = document.createElement("span");
        arrow.setAttribute("class", "material-icons icon arrow");
        arrow.appendChild(document.createTextNode("arrow_right"));
        breadcrumbs.appendChild(arrow);
        var breadcrumb = document.createElement("a");
        if (breadcrumbInfo.href !== undefined) {
            breadcrumb.setAttribute("href", breadcrumbInfo.href);
        }
        var icon = document.createElement("span");
        icon.setAttribute("class", "material-icons icon");
        icon.appendChild(document.createTextNode(breadcrumbInfo.icon));
        var name = document.createElement("span");
        name.appendChild(document.createTextNode(breadcrumbInfo.name));
        breadcrumb.appendChild(icon);
        breadcrumb.appendChild(name);
        breadcrumbs.appendChild(breadcrumb);
    }
    $("breadcrumbs").appendChild(breadcrumbs);
}

function updateNavTabs(page) {
    var navTabsInfo = {
        0: {
            "name": "Browse",
            "icon": "view_list",
            "page": "table",
            "href": "./table.html"
        },
        1: {
            "name": "Search",
            "icon": "search",
            "page": "search",
            "href": "./search.html"
        },
        2: {
            "name": "Set Key",
            "icon": "vpn_key",
            "page": "setkey",
            "href": "./setkey.html"
        },
        3: {
            "name": "Operations",
            "icon": "build",
            "page": "operations",
            "href": "./tablesettings.html"
        }
    };
    $("navTabs").innerHTML = "";
    var tabs = document.createElement("div");
    var tab = document.createElement("div");
    tab.setAttribute("class", "has-shadow");
    $("navTabs").appendChild(tab);
    for (var i = 0; i < Object.keys(navTabsInfo).length; i++) {
        tabInfo = navTabsInfo[i];
        var tab = document.createElement("a");
        tab.setAttribute("class", "nav-tab");
        if (tabInfo.page === page) {
            tab.classList.add("active");
        }
        tab.setAttribute("href", tabInfo.href + "?name=" + getAllUrlParams().name);
        if (tabInfo.icon !== undefined) {
            var icon = document.createElement("span");
            icon.setAttribute("class", "material-icons icon");
            icon.appendChild(document.createTextNode(tabInfo.icon));
            tab.appendChild(icon);
        }
        tab.appendChild(document.createTextNode(tabInfo.name));
        tabs.appendChild(tab);
    }
    $("navTabs").appendChild(tabs);
}

function updateTree() {
    var currentTable = getAllUrlParams().name;
    fetch("/api/hdata/gettables").then(response => response.json()).then((data) => {
        if (data.status !== "OK") {
            console.log("Could not load table tree: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
        }
        $("navTree").innerHTML = "";
        var treeRoot = document.createElement("a");
        if (typeof page !== 'undefined' && page == 'tables') {
            treeRoot.setAttribute("class", "tree-item active");
        } else {
            treeRoot.setAttribute("class", "tree-item");
        }
        treeRoot.setAttribute("href", "./tables.html");
        var icon = document.createElement("span");
        icon.setAttribute("class", "material-icons vam");
        icon.appendChild(document.createTextNode("arrow_drop_down"));
        treeRoot.appendChild(document.createTextNode("Tables"));
        treeRoot.appendChild(icon);
        var flexGrow = document.createElement("span");
        flexGrow.setAttribute("class", "flex-grow");
        treeRoot.appendChild(flexGrow);
        // var a = document.createElement("a");
        // a.setAttribute("class", "icon-right txt-inherit");
        // a.setAttribute("title", "Search all tables");
        // a.setAttribute("href", "./search.html");
        // icon = document.createElement("span");
        // icon.setAttribute("class", "material-icons vam");
        // icon.appendChild(document.createTextNode("search"));
        // a.appendChild(icon);
        // treeRoot.appendChild(a);
        $("navTree").appendChild(treeRoot);
        var treeItems = document.createElement("div");
        treeItems.setAttribute("class", "tree-items");
        for (var i = 0; i <= data.value.length - 1; i++) {
            var tableName = data.value[i];
            var treeItem = document.createElement("a");
            if (currentTable === tableName) {
                treeItem.setAttribute("class", "tree-item active");
            } else {
                treeItem.setAttribute("class", "tree-item");
            }
            treeItem.setAttribute("href", "./table.html?name=" + tableName);
            treeItem.appendChild(document.createTextNode(tableName));
            treeItems.appendChild(treeItem);
        }
        $("navTree").appendChild(treeItems);
    }).catch((error) => {
        console.log(error);
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
            if (typeof page !== 'undefined' && page == 'home') {
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
                    "<li>Number of tables: " +
                    serverInfo.tables +
                    "</li>" +
                    "<li>User: <span id=\"loggedInUser\">" +
                    loggedInUser +
                    "</span>@" +
                    data["connectionInfo"]["host"] +
                    "</li>"
                    ;
            }
        }).catch((error) => {
            console.log(error);
        });
}

function updateServerInfo(data) {
    serverInfo = data;
    var html = '<span class="material-icons icon txt-red">link_off</span>&nbsp;<span>Server not connected</span>';
    if (serverInfo.status == 'OK') {
        html = '<span class="material-icons icon">link</span>&nbsp;<span>Server:&nbsp;</span> <span id="serverHost">localhost:8888</span>';
    } else {
        if (confirm("Connection to HData server lost, try to reconnect?")) {
            reconnect();
        }
    }
    $("serverInfo").title = JSON.stringify(serverInfo);
    $("serverInfo").innerHTML = html;
    try {
        updateInfo();
    } catch (err) { }
}

setTimeout(() => {
    fetch("/api/hdata/status").then(response => response.json())
        .then(data => updateServerInfo(data))
        .catch((error) => {
            console.log(error);
            if (confirm('Connection to HData server lost, reconnect?')) {
                reconnect();
            }
        });
}, 200);