var page = "setkey";
var tableName = getAllUrlParams().name;
updateNavTabs(page);

document.title = tableName + " - Set Key - HDataMyAdmin";

$('tableName').value = tableName;

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

$("setKeyForm").onsubmit = (e) => {
    var form = $("setKeyForm");
    e.preventDefault();
    let tableName = form.elements['tableName'].value;
    let keyName = form.elements['keyName'].value;
    let value = form.elements['value'].value;
    setKey(tableName, keyName, value, "./table.html?name=" + tableName);
}