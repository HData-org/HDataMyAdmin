fetch("/api/hdata/gettables").then(response => response.json()).then((data) => {
    console.log(data);
    var tables = document.createElement('table');
    var tableHeader = document.createElement('th');
    tableHeader.appendChild(document.createTextNode('Tables'));
    tables.appendChild(tableHeader);
    for(var i = 0; i <= data.value.length-1; i++) {
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(data.value[i]));
        row.appendChild(cell);
        tables.appendChild(row);
    }
    $("tables").appendChild(tables);
})