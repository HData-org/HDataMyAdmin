fetch("/api/hdata/gettables")
.then(response => response.json())
.then((data) => {
    $('tables').textContent = JSON.stringify(data.value);
})