var tableName = getAllUrlParams().name;

document.title = tableName + " - Operations - HDataMyAdmin";
$("tableTitle").textContent = tableName+" - Operations";
$("tableName").setAttribute("placeholder", tableName);

var navTabsInfo = {
    0: {
        "name": "Browse",
        "active": false,
        "href": "./table.html?name="+tableName
    },
    1: {
        "name": "Operations",
        "active": true,
        "href": "currentPage"
    }
};

updateNavTabs(navTabsInfo);

function tableAction(action) {
    if(action === "delete") {
        deleteTable(tableName);
    }
}