var error = getAllUrlParams().error;

if(error !== undefined && error !== "OK") {
    $(".error")[0].style.display = "block";
    if(error !== "AERR") {
        $(".error")[0].textContent = errorCodeToMsg(error);
    }
}