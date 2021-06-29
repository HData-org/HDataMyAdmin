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

function getValueFromKey(keyName) {
    if (tableName != null) {
        const formData = new URLSearchParams();
        formData.append("tableName", tableName);
        var evaluator = "key == " + keyName;
        formData.append("evaluator", evaluator);
        fetch('/api/hdata/querytable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        }).then(response => response.json()).then((data) => {
            if (data.status == "OK") {
                $("value").value = tryStringifyJSON(data.matches[0].value);
            } else {
                var errMsg = errorCodeToMsg(data.status);
                alert("Error getting current value of key \"" + keyName + "\" from table \"" + tableName + "\": " + errMsg + " (" + JSON.stringify(data) + ")");
            }
        }).catch((error) => {
            console.log(error);
            alert("Error getting current value of key \"" + keyName + "\" from table \"" + tableName + "\": " + error);
        });
    }
}

var keyNameValue = getAllUrlParams().key;
var loadValue = settings["loadCurrentKeyValue"];
if (keyNameValue !== undefined) {
    $("keyName").value = keyNameValue;
    if (loadValue) {
        getValueFromKey(keyNameValue);
    }
    $("value").focus();
} else {
    $("keyName").focus();
}

$("setKeyForm").onsubmit = (e) => {
    var form = $("setKeyForm");
    e.preventDefault();
    let tableName = form.elements['tableName'].value;
    let keyName = JSON.parse(form.elements['keyName'].value);
    let value = JSON.parse(form.elements['value'].value);
    setKey(tableName, keyName, value, "./table.html?name=" + tableName);
}