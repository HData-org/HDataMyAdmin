var page = "table";
var tableName = getAllUrlParams().name;
updateNavTabs(page);

document.title = tableName + " - HDataMyAdmin";
$("tableTitle").textContent = tableName;

fetch("/api/hdata/tablekeys?tableName=" + tableName).then(response => response.json()).then((data) => {
    if (data.status !== "OK") {
        showErrorMsg("tableError", "Could not load table: " + errorCodeToMsg(data.status) + " (" + data.status + ")");
    }
    createTable1D($("table"), "Key", data.keys);
});