var page = "search";
var tableName = getAllUrlParams().name;
if(typeof tableName !== 'undefined') {
    updateNavTabs(page);
}

fetch("/api/hdata/gettables").then(response => response.json()).then((data) => {
    if(data.status !== "OK") {
        console.log("Could not load tables: "+data.status+" ("+errorCodeToMsg(data.status)+")");
    }
    $("tables").innerHTML = "";
    var select = document.createElement("select");
    select.setAttribute("class", "input");
    var option = document.createElement("option");
    option.setAttribute("value", "__all");
    option.appendChild(document.createTextNode("All tables"));
    select.appendChild(option);
    for (var i = 0; i < Object.keys(data.value).length; i++) {
        var currentTableName = data.value[i];
        option = document.createElement("option");
        option.setAttribute("value", currentTableName);
        if(tableName === currentTableName) {
            option.selected = true;
        }
        option.appendChild(document.createTextNode(currentTableName));
        select.appendChild(option);
    }
    $("tables").appendChild(select);
});