fetch("/api/hdata/gettables").then(response => response.json()).then((data) => {
    console.log(data);
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
    for(var i = 0; i <= data.value.length-1; i++) {
        var tableName = data.value[i];
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var name = document.createElement("a");
        name.setAttribute("href", "./table.html?name="+tableName);
        name.setAttribute("class", "txt-bold");
        name.appendChild(document.createTextNode(tableName));
        cell.appendChild(name);
        row.appendChild(cell);
        /* actions */
        cell = document.createElement("td");
        cell.setAttribute("class", "flex-center actions");
        var action = document.createElement("span");
        action.setAttribute("onclick", 'goToTable("'+tableName+'")');
        action.setAttribute("class", "flex-center browse");
        var actionIcon = document.createElement("span");
        actionIcon.setAttribute("class", "material-icons icon");
        actionIcon.appendChild(document.createTextNode("view_list"));
        action.appendChild(actionIcon);
        var actionText = document.createElement("span");
        actionText.appendChild(document.createTextNode("Browse"));
        action.appendChild(actionText);
        cell.appendChild(action);
        row.append(cell);
        action = document.createElement("span");
        action.setAttribute("onclick", 'deleteTable("'+tableName+'")');
        action.setAttribute("class", "flex-center trash");
        actionIcon = document.createElement("span");
        actionIcon.setAttribute("class", "material-icons icon");
        actionIcon.appendChild(document.createTextNode("delete"));
        action.appendChild(actionIcon);
        actionText = document.createElement("span");
        actionText.appendChild(document.createTextNode("Delete"));
        action.appendChild(actionText);
        cell.appendChild(action);
        row.append(cell);
        tables.appendChild(row);
    }
    $("tables").appendChild(tables);
});

function deleteTable(tableName) {
    if(confirm('Are you sure you want to DELETE table "'+ tableName +'"?')) {
        console.log("Deleting table"+tableName);
        fetch("/api/hdata/deleteTable?tableName="+tableName).then(response => response.json()).then((data) => {
            console.log(data);
            if(data.status == "OK") {
                location.reload();
            } else {
                alert("Error deleting table "+tableName+"("+data+")");
            }
        });
    }
}