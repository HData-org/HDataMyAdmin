function updateServerInfo(data) {
    var html = '<span class="material-icons icon txt-red">link_off</span> <span>&nbsp;Server not connected</span>';
    if(data.status == 'OK') {
        html = '<span class="material-icons icon">link</span> <span>&nbsp;Server:&nbsp;</span> <span>localhost:8888</span>';
    }
    $('serverInfo').title = JSON.stringify(data);
    $('serverInfo').innerHTML = html;
}

fetch('/api/hdata/status')
    .then(response => response.json())
    .then(data => updateServerInfo(data))