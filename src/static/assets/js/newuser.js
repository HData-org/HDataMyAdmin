var breadcrumbsInfo = {
    0: {
        "name": "Create User",
        "icon": "person_add",
        "href": "./newuser.html"
    }
}
updateBreadcrumbs(breadcrumbsInfo);

var error = getAllUrlParams().error;

if (error !== undefined && error !== "OK") {
    $("newUserError").style.display = "block";
    if (error !== "PDNM") {
        $("newUserErrorText").textContent = errorCodeToMsg(error);
    }
}