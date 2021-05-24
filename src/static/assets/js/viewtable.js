var page = "table";
var tableName = getAllUrlParams().name;
updateNavTabs(page);

document.title = tableName + " - HDataMyAdmin";
$("tableTitle").textContent = tableName;

fetch("/api/hdata/tablekeys?tableName="+tableName).then(response => response.json()).then((data) => {
    console.log(data);
    createTable1D($("table"), "Key", data);
});