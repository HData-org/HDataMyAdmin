var page = "setkey";
var tableName = getAllUrlParams().name;
updateNavTabs(page);

document.title = tableName + " - Set Key - HDataMyAdmin";

$('tableName').value = tableName;

$("setKeyForm").onsubmit = (e) => {
    var form = $("setKeyForm");
    e.preventDefault();
    let tableName = form.elements['tableName'].value;
    let keyName = form.elements['keyName'].value;
    let value = form.elements['value'].value;
    setKey(tableName, keyName, value, "./table.html?name="+tableName);
}