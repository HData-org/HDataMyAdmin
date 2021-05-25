var error = getAllUrlParams().error;

if(error !== undefined && error !== "OK") {
    $("newUserError").style.display = "block";
    if(error !== "PDOM") {
        $("newUserErrorText").textContent = errorCodeToMsg(error);
    }
}