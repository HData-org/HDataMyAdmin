var username = getAllUrlParams().name;

if (username !== undefined) {
    $("username").value = username;
    var breadcrumbsInfo = {
        0: {
            "name": "User accounts",
            "icon": "group",
            "href": "./users.html"
        },
        1: {
            "name": username,
            "icon": "person",
            "href": "./users.html"
        },
        2: {
            "name": "Change password",
            "icon": "password",
            "href": "./changepassword.html"
        }
    }
} else {
    var breadcrumbsInfo = {
        0: {
            "name": "User accounts",
            "icon": "group",
            "href": "./users.html"
        },
        1: {
            "name": "Change password",
            "icon": "password",
            "href": "./changepassword.html"
        }
    }
}
updateBreadcrumbs(breadcrumbsInfo);

var error = getAllUrlParams().error;

if (error !== undefined && error !== "OK") {
    $("error").style.display = "block";
    if (error !== "PDNM") {
        $("error").textContent = errorCodeToMsg(error);
    }
}