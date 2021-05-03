setTimeout(() => {
    fetch("/api/hdata/login").then(response => response.json()).then((json) => {
        if(json.auth) {
            console.log('Logged in as ' + json.username);
        } else {
            window.location = '/login.html';
        }
    });
}, 100)