fetch("/api/hdata/gettables").then(response => response.json()).then((data) => {
    if (data.status !== "OK") {
        showErrorMsg("tableError", "Could not load tables: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
    }
    $("tables").innerHTML = "";
    var tables = document.createElement("table");
    var tableHeader = document.createElement("tr");
    var tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Table"));
    tableHeader.appendChild(tableHeaderRow);
    tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Action"));
    tableHeader.appendChild(tableHeaderRow);
    tables.appendChild(tableHeader);
    for (var i = 0; i < Object.keys(data.value).length; i++) {
        var tableName = data.value[i];
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var name = document.createElement("a");
        name.setAttribute("href", "./table.html?name=" + tableName);
        name.setAttribute("class", "txt-bold");
        name.appendChild(document.createTextNode(tableName));
        cell.appendChild(name);
        row.appendChild(cell);
        /* actions */
        var actionsJson = {
            0: {
                "name": "Browse",
                "class": "browse",
                "icon": "view_list",
                "href": "./table.html"
            },
            1: {
                "name": "Set Key",
                "class": "setkey",
                "icon": "vpn_key",
                "href": "./setkey.html"
            },
            2: {
                "name": "Operations",
                "class": "operations",
                "icon": "build",
                "href": "./tablesettings.html"
            },
            3: {
                "name": "Delete",
                "class": "trash",
                "icon": "delete",
                "href": "#",
                "onclick": "deleteTable(\"" + tableName + "\")"
            }
        };
        cell = document.createElement("td");
        cell.setAttribute("class", "flex-center actions");
        for (var a = 0; a < Object.keys(actionsJson).length; a++) {
            var actionInfo = actionsJson[a];
            var action = document.createElement("a");
            action.setAttribute("href", actionInfo.href + '?name=' + tableName);
            if (actionInfo.onclick !== undefined) {
                action.setAttribute("onclick", actionInfo.onclick);
            }
            action.setAttribute("class", "flex-center " + actionInfo.class);
            var actionIcon = document.createElement("span");
            actionIcon.setAttribute("class", "material-icons icon");
            actionIcon.appendChild(document.createTextNode(actionInfo.icon));
            action.appendChild(actionIcon);
            var actionText = document.createElement("span");
            actionText.appendChild(document.createTextNode(actionInfo.name));
            action.appendChild(actionText);
            cell.appendChild(action);
            row.append(cell);
        }
        tables.appendChild(row);
    }
    row = document.createElement("tr");
    row.setAttribute("class", "tb-footer");
    cell = document.createElement("td");
    cell.appendChild(document.createTextNode(i + " Tables(s)"));
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.setAttribute("class", "txt-right");
    var link = document.createElement("a");
    link.setAttribute("onclick", "exportJson(" + JSON.stringify(data.value) + ")");
    link.appendChild(document.createTextNode("Show JSON"));
    cell.appendChild(link);
    row.appendChild(cell);
    tables.appendChild(row);
    $("tables").appendChild(tables);
}).catch((error) => {
    console.log(error);
});