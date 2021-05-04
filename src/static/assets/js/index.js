var loggedInUser;
setTimeout(() => {
    fetch("/api/hdata/login").then(response => response.json()).then((json) => {
        if(json.auth) {
            console.log('Logged in as ' + json.username);
            loggedInUser = json.username;
            try {
                $("loggedInUser").textContent = loggedInUser;
            } catch (err) {
                console.log(err);
            }
        } else {
            window.location = '/login.html';
        }
    });
}, 100)