fetch("/api/hdata/login").then(response => response.json()).then((json) => {
    if(json.auth) {
        console.log(json.username);
    } else {
        window.location = '/login.html';
    }
});