var tableName = getAllUrlParams().name;

document.title = tableName + " - HDataMyAdmin";
$('tableTitle').textContent = tableName;
fetch("/api/hdata/tablekeys?name="+tableName).then(response => response.json()).then((data) => {
    console.log(data);
    createTable1D($("table"), "Keys", data);
});