var error = getAllUrlParams().error;

if(error !== undefined && error !== "OK") {
    $("error").style.display = "block";
    if(error !== "PDOM") {
        $("error").textContent = error;
    }
}