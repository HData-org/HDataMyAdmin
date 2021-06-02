var page = "search";
var tableName = getAllUrlParams().name;
if (typeof tableName !== 'undefined') {
    updateNavTabs(page);
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
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        if (type === "queryall") {
            var tableName = result.table;
            var name = document.createElement("a");
            name.setAttribute("href", "./table.html?name=" + tableName);
            name.setAttribute("class", "txt-bold");
            name.appendChild(document.createTextNode(tableName));
            cell.appendChild(name);
            row.appendChild(cell);
        }
        cell = document.createElement("td");
        cell.appendChild(document.createTextNode(result.key));
        row.appendChild(cell);
        cell = document.createElement("td");
        cell.appendChild(document.createTextNode(result.value));
        row.appendChild(cell);
        table.appendChild(row);
    }
    return table;
}

function search() {
    var evaluator = $("evaluator").value;
    var tableName = $("tableName").value;
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
                var searchResults = data.matches;
                console.log(searchResults);
                $("searchResults").innerHTML = "";
                $("searchResults").appendChild(showResults(searchResults, queryType));
            } else {
                showErrorMsg("searchError", "Could not complete search: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
            }
        }).catch((error) => {
            showErrorMsg("searchError", "Could not complete search: " + error);
        });
    }
}

$("searchForm").onsubmit = (e) => {
    e.preventDefault();
    search();
}