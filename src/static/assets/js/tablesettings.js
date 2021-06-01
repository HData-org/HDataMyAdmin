var page = "operations";
var tableName = getAllUrlParams().name;
updateNavTabs(page);

document.title = tableName + " - Operations - HDataMyAdmin";
$("tableName").setAttribute("placeholder", tableName);

function tableAction(action) {
    if (action === "delete") {
        deleteTable(tableName, "./tables.html");
    }
}