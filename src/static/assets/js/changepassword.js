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
updateBreadcrumbs(breadcrumbsInfo);

var error = getAllUrlParams().error;

if (error !== undefined && error !== "OK") {
    $("error").style.display = "block";
    if (error !== "PDNM") {
        $("error").textContent = errorCodeToMsg(error);
    }
}