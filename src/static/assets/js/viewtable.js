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

fetch("/api/hdata/tablekeys?tableName=" + tableName).then(response => response.json()).then((data) => {
    if (data.status !== "OK") {
        showErrorMsg("tableError", "Could not load table: " + errorCodeToMsg(data.status) + " (" + JSON.stringify(data) + ")");
    }
    createTable1D($("table"), "Key", data.keys);
}).catch((error) => {
    console.log(error);
    showErrorMsg("tableError", "Could not load users: " + error);
});