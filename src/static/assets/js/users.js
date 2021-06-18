var tableData;

function showJSON() {
    exportJson(tableData);
}

function getUser(currentUser) {
    fetch("/api/hdata/getuser?username=" + currentUser).then(response => response.json()).then((data) => {
        if (data.status !== "OK") {
            showErrorMsg("tableError", "Could not load users: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
        }
        $("usersTable").innerHTML = "";
        console.log(data);
        tableData = data.value;
        var table = document.createElement("table");
        var tableHeader = document.createElement("tr");
        /* table headers */
        var tableHeaders = ["Username", "Permissions", "Tables", "Action"];
        for (var t = 0; t < tableHeaders.length; t++) {
            var tableHeaderTitle = tableHeaders[t];
            var tableHeaderRow = document.createElement("th");
            tableHeaderRow.appendChild(document.createTextNode(tableHeaderTitle));
            tableHeader.appendChild(tableHeaderRow);
        }
        table.appendChild(tableHeader);
        var user = currentUser;
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var name = document.createElement("span");
        name.appendChild(document.createTextNode(user + " (You)"));
        name.setAttribute("class", "txt-bold");
        cell.appendChild(name);
        row.appendChild(cell);
        /* perms */
        cell = document.createElement("td");
        var permissions = document.createElement("span");
        for (var p = 0; p < Object.keys(tableData.permissions).length; p++) {
            var permissionName = tableData.permissions[p];
            var permission = document.createElement("span");
            permission.setAttribute("class", "label");
            permission.appendChild(document.createTextNode(permissionName));
            permissions.appendChild(permission);
        }
        cell.appendChild(permissions);
        row.appendChild(cell);
        /* tables */
        cell = document.createElement("td");
        var userTables = document.createElement("span");
        for (var t = 0; t < Object.keys(tableData.tables).length; t++) {
            var userTableName = tableData.tables[t];
            var userTable = document.createElement("a");
            userTable.setAttribute("class", "label");
            userTable.setAttribute("href", "./table.html?name=" + userTableName);
            userTable.appendChild(document.createTextNode(userTableName));
            userTables.appendChild(userTable);
        }
        cell.appendChild(userTables);
        row.appendChild(cell);
        /* actions */
        var actionsJson = {
            0: {
                "name": "Edit",
                "class": "edit",
                "icon": "edit",
                "href": "./changepassword.html"
            },
            1: {
                "name": "Delete",
                "class": "trash",
                "icon": "delete",
                "href": "#",
                "onclick": "alert(\"Can not delete user: " + user + "\")"
            }
        };
        cell = document.createElement("td");
        cell.setAttribute("class", "flex-center actions");
        for (var a = 0; a < Object.keys(actionsJson).length; a++) {
            var actionInfo = actionsJson[a];
            var action = document.createElement("a");
            action.setAttribute("href", actionInfo.href + "?name=" + user + "&ref=" + page);
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
        table.appendChild(row);
        row = document.createElement("tr");
        row.setAttribute("class", "tb-footer");
        cell = document.createElement("td");
        cell.setAttribute("colspan", 3);
        cell.appendChild(document.createTextNode(1 + " User(s) *Only able to show the current user"));
        row.appendChild(cell);
        cell = document.createElement("td");
        cell.setAttribute("class", "txt-right");
        var link = document.createElement("a");
        link.setAttribute("onclick", "showJSON()");
        link.appendChild(document.createTextNode("Show JSON"));
        cell.appendChild(link);
        row.appendChild(cell);
        table.appendChild(row);
        $("usersTable").appendChild(table);
    }).catch((error) => {
        console.log(error);
        showErrorMsg("tableError", "Could not load users: " + error);
    });
}