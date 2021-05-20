var page = "setkey";
var tableName = getAllUrlParams().name;
updateNavTabs(page);

document.title = tableName + " - Set Key - HDataMyAdmin";

$('tableName').value = tableName;