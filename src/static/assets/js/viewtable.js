var page = "table";
var tableName = getAllUrlParams().name;
updateNavTabs(page);

document.title = tableName + " - HDataMyAdmin";
$("tableTitle").textContent = tableName;

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

var tableData;

function showJSON() {
    exportJson(tableData);
}

function showTable(tableData, tableType) {
    var table = document.createElement("table");
    var tableHeader = document.createElement("tr");
    var tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Key"));
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);
    if (tableType == "full") {
        tableHeaderRow = document.createElement("th");
        tableHeaderRow.appendChild(document.createTextNode("Value"));
        tableHeader.appendChild(tableHeaderRow);
        table.appendChild(tableHeader);
    }
    tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Action"));
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);
    for (var i = 0; i < tableData.length; i++) {
        var rowData = tableData[i];
        if (tableType == "full") {
            var keyName = tryStringifyJSON(rowData.key);
            var keyValue = tryStringifyJSON(rowData.value);
        } else {
            var keyName = tryStringifyJSON(rowData);
            var keyValue = "";
        }
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell = document.createElement("td");
        cell.appendChild(document.createTextNode(keyName));
        row.appendChild(cell);
        if (tableType == "full") {
            cell = document.createElement("td");
            cell.appendChild(document.createTextNode(keyValue));
            if (rowData.value == undefined) {
                cell.classList.add("txt-red");
            }
            cell.classList.add("txt-ww-ba");
            row.appendChild(cell);
        }
        /* actions */
        var actionsJson = {
            0: {
                "name": "Edit",
                "icon": "edit",
                "class": "edit",
                "href": "./setkey.html"
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
            if (tableType == "full") {
                var actionLink = actionInfo.href + '?name=' + tableName + "&key=" + JSON.stringify(rowData.key);
            } else {
                var actionLink = actionInfo.href + '?name=' + tableName + "&key=" + JSON.stringify(rowData);
            }
            action.setAttribute("href", actionLink);
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
    if (tableType == "full") {
        cell.setAttribute("colspan", 2);
    }
    cell.appendChild(document.createTextNode(i + " Key(s)"));
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.setAttribute("class", "txt-right");
    var link = document.createElement("a");
    link.setAttribute("onclick", "showJSON()");
    link.appendChild(document.createTextNode("Show JSON"));
    cell.appendChild(link);
    row.appendChild(cell);
    table.appendChild(row);
    $("table").appendChild(table);
}

if (settings["onlyLoadTableKeys"]) {
    fetch("/api/hdata/tablekeys?tableName=" + tableName).then(response => response.json()).then((data) => {
        $("table").innerHTML = "";
        if (data.status !== "OK") {
            showErrorMsg("tableError", "Could not load table: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
        } else {
            tableData = data.keys;
            showTable(tableData);
        }
    }).catch((error) => {
        console.log(error);
        showErrorMsg("tableError", "Could not load users: " + error);
    });
} else {
    fetch("/api/hdata/querytable?evaluator=true&tableName=" + tableName).then(response => response.json()).then((data) => {
        $("table").innerHTML = "";
        if (data.status !== "OK") {
            showErrorMsg("tableError", "Could not load table: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
        } else {
            tableData = data.matches;
            showTable(tableData, "full");
        }
    }).catch((error) => {
        console.log(error);
        showErrorMsg("tableError", "Could not load users: " + error);
    });
}