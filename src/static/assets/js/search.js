var page = "search";
var tableName = getAllUrlParams().name;
if (typeof tableName !== 'undefined') {
    document.title = tableName + " - Search - HDataMyAdmin";
    updateNavTabs(page);
    var breadcrumbsInfo = {
        0: {
            "name": "Tables",
            "icon": "table_view",
            "href": "./tables.html"
        },
        1: {
            "name": tableName,
            "icon": "view_list",
            "href": "?name=" + tableName
        }
    }
    updateBreadcrumbs(breadcrumbsInfo);
}

var tableData;

function showJSON() {
    exportJson(tableData);
}

fetch("/api/hdata/gettables").then(response => response.json()).then((data) => {
    if (data.status !== "OK") {
        console.log("Could not load tables: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
    }
    $("tables").innerHTML = "";
    var select = document.createElement("select");
    select.setAttribute("class", "input");
    select.setAttribute("id", "tableName");
    var option = document.createElement("option");
    option.setAttribute("value", "");
    option.appendChild(document.createTextNode("All tables"));
    select.appendChild(option);
    for (var i = 0; i < Object.keys(data.value).length; i++) {
        var currentTableName = data.value[i];
        option = document.createElement("option");
        option.setAttribute("value", currentTableName);
        if (tableName === currentTableName) {
            option.selected = true;
        }
        option.appendChild(document.createTextNode(currentTableName));
        select.appendChild(option);
    }
    $("tables").appendChild(select);
}).catch((error) => {
    console.log(error);
});

function showResults(results, type) {
    var table = document.createElement("table");
    var tableHeader = document.createElement("tr");
    var tableHeaderRow = document.createElement("th");
    if (type === "queryall") {
        tableHeaderRow.appendChild(document.createTextNode("Table"));
        tableHeader.appendChild(tableHeaderRow);
    }
    tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Key"));
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);
    tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Value"));
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);
    tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Action"));
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var keyName = JSON.stringify(result.key);
        var keyValue = JSON.stringify(result.value);
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        if (type === "queryall") {
            var resultsTableName = result.table;
            var name = document.createElement("a");
            name.setAttribute("href", "./table.html?name=" + resultsTableName);
            name.setAttribute("class", "txt-bold");
            name.appendChild(document.createTextNode(resultsTableName));
            cell.appendChild(name);
            row.appendChild(cell);
        }
        cell = document.createElement("td");
        cell.appendChild(document.createTextNode(keyName));
        row.appendChild(cell);
        cell = document.createElement("td");
        cell.appendChild(document.createTextNode(keyValue));
        if (result.value == undefined) {
            cell.classList.add("txt-red");
        }
        cell.classList.add("txt-ww-ba");
        row.appendChild(cell);
        /* actions */
        var actionsJson = {
            0: {
                "name": "Edit",
                "icon": "edit",
                "class": "edit",
                "href": "./setkey.html",
            },
            1: {
                "name": "Delete",
                "icon": "delete",
                "class": "trash",
                "href": "#",
                "onclick": "deleteKey(\"" + tableName + "\", " + keyName + ")"
            }
        };
        cell = document.createElement("td");
        cell.setAttribute("class", "flex-center actions");
        for (var a = 0; a < Object.keys(actionsJson).length; a++) {
            var actionInfo = actionsJson[a];
            var action = document.createElement("a");
            action.setAttribute("href", actionInfo.href + '?name=' + tableName + "&key=" + keyName);
            if (actionInfo.target !== undefined) {
                action.setAttribute("target", actionInfo.target);
            }
            if (actionInfo.onclick !== undefined) {
                action.setAttribute("onclick", actionInfo.onclick);
            }
            action.setAttribute("class", "flex-center " + actionInfo.class);
            var actionIcon = document.createElement("span");
            actionIcon.setAttribute("class", "material-icons icon");
            actionIcon.appendChild(document.createTextNode(actionInfo.icon));
            action.appendChild(actionIcon);
            action.setAttribute("title", actionInfo.name);
            cell.appendChild(action);
            row.append(cell);
        }
        table.appendChild(row);
    }
    row = document.createElement("tr");
    row.setAttribute("class", "tb-footer");
    cell = document.createElement("td");
    cell.setAttribute("colspan", 2);
    if (type === "queryall") {
        cell.setAttribute("colspan", 3);
    }
    cell.appendChild(document.createTextNode(i + " Result(s)"));
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.setAttribute("class", "txt-right");
    var link = document.createElement("a");
    link.setAttribute("onclick", "showJSON()");
    link.appendChild(document.createTextNode("Show JSON"));
    cell.appendChild(link);
    row.appendChild(cell);
    table.appendChild(row);
    return table;
}

function search() {
    var evaluator = $("evaluator").value;
    tableName = $("tableName").value;
    console.log("Searching \"" + evaluator + "\" in table " + tableName);
    $("results").style.display = "block";
    $("searchResults").innerHTML = "";
    var loaderContainer = document.createElement("div");
    loaderContainer.setAttribute("class", "center");
    var loader = document.createElement("div");
    loader.setAttribute("class", "loader");
    loaderContainer.appendChild(loader);
    $("searchResults").appendChild(loaderContainer);
    if (evaluator != null) {
        var queryType = 'querytable';
        if (tableName == "") {
            queryType = 'queryall';
        }
        const formData = new URLSearchParams();
        formData.append("evaluator", evaluator);
        formData.append("tableName", tableName);
        fetch('/api/hdata/' + queryType, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        }).then(response => response.json()).then((data) => {
            if (data.status == "OK") {
                hideErrorMsg("searchError");
                var searchResults = tableData = data.matches;
                console.log(searchResults);
                $("searchResults").innerHTML = "";
                $("searchResults").appendChild(showResults(searchResults, queryType));
            } else {
                showErrorMsg("searchError", "Could not complete search: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
            }
        }).catch((error) => {
            console.log(error);
            showErrorMsg("searchError", "Could not complete search: " + error);
        });
    }
}

$("searchForm").onsubmit = (e) => {
    e.preventDefault();
    search();
}