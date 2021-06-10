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

function showTable(tableData) {
    var table = document.createElement("table");
    var tableHeader = document.createElement("tr");
    var tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Key"));
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);
    tableHeaderRow = document.createElement("th");
    tableHeaderRow.appendChild(document.createTextNode("Value"));
    tableHeader.appendChild(tableHeaderRow);
    table.appendChild(tableHeader);
    for (var i = 0; i < tableData.length; i++) {
        var rowData = tableData[i];
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell = document.createElement("td");
        cell.appendChild(document.createTextNode(JSON.stringify(rowData.key)));
        row.appendChild(cell);
        cell = document.createElement("td");
        cell.appendChild(document.createTextNode(JSON.stringify(rowData.value)));
        if (rowData.value == undefined) {
            cell.classList.add("txt-red");
        }
        cell.classList.add("txt-ww-ba");
        row.appendChild(cell);
        table.appendChild(row);
    }
    row = document.createElement("tr");
    row.setAttribute("class", "tb-footer");
    cell = document.createElement("td");
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

fetch("/api/hdata/querytable?evaluator=true&tableName=" + tableName).then(response => response.json()).then((data) => {
    $("table").innerHTML = "";
    if (data.status !== "OK") {
        showErrorMsg("tableError", "Could not load table: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
    } else {
        tableData = data.matches;
        showTable(data.matches);
    }
}).catch((error) => {
    console.log(error);
    showErrorMsg("tableError", "Could not load users: " + error);
});

// fetch("/api/hdata/tablekeys?tableName=" + tableName).then(response => response.json()).then((data) => {
//     if (data.status !== "OK") {
//         showErrorMsg("tableError", "Could not load table: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
//     }
//     createTable1D($("table"), "Key", data.keys);
// }).catch((error) => {
//     console.log(error);
//     showErrorMsg("tableError", "Could not load users: " + error);
// });