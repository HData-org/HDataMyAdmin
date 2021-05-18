fetch("/api/hdata/gettables").then(response => response.json()).then((data) => {
    console.log(data);
    $("tables").innerHTML = "";
    var tables = document.createElement("table");
    var tableHeader = document.createElement("tr");
    var tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Table name"));
    tableHeader.appendChild(tableHeaderRow);
    tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Actions"));
    tableHeader.appendChild(tableHeaderRow);
    tables.appendChild(tableHeader);
    for(var i = 0; i <= data.value.length-1; i++) {
        var tableName = data.value[i];
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell.appendChild(document.createTextNode(tableName));
        row.appendChild(cell);
        row.setAttribute("onclick", 'goToTable("'+tableName+'")');
        cell = document.createElement("td");
        cell.appendChild(document.createTextNode("Delete"));
        row.append(cell);
        tables.appendChild(row);
    }
    $("tables").appendChild(tables);
});