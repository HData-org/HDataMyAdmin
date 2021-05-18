fetch("/api/hdata/gettables").then(response => response.json()).then((data) => {
    console.log(data);
    $('tables').innerHTML = "";
    var tables = document.createElement('table');
    var tableHeader = document.createElement('th');
    tableHeader.appendChild(document.createTextNode('Table name'));
    tables.appendChild(tableHeader);
    for(var i = 0; i <= data.value.length-1; i++) {
        var tableName = data.value[i];
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(tableName));
        row.appendChild(cell);
        row.setAttribute("onclick", 'goToTable("'+tableName+'")');
        tables.appendChild(row);
    }
    $("tables").appendChild(tables);
});