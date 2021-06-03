var page = "operations";
var tableName = getAllUrlParams().name;
updateNavTabs(page);

document.title = tableName + " - Operations - HDataMyAdmin";
$("tableName").setAttribute("placeholder", tableName);

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

function tableAction(action) {
    if (action === "delete") {
        deleteTable(tableName, "./tables.html");
    }
}