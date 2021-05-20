var tableName = getAllUrlParams().name;

document.title = tableName + " - HDataMyAdmin";
$("tableTitle").textContent = tableName;

fetch("/api/hdata/tablekeys?tableName="+tableName).then(response => response.json()).then((data) => {
    console.log(data);
    createTable1D($("table"), "Keys", data);
});

var navTabsInfo = {
    0: {
        "name": "Browse",
        "active": true,
        "href": "currentPage"
    },
    1: {
        "name": "Operations",
        "active": false,
        "href": "./tablesettings.html?name="+tableName
    }
};

updateNavTabs(navTabsInfo);