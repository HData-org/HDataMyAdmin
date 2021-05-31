var error = getAllUrlParams().error;

if(error !== undefined && error !== "OK") {
    $("error").style.display = "block";
    if(error !== "PDNM") {
        $("error").textContent = errorCodeToMsg(error);
    }
}