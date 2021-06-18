function saveSettings() {
    console.log("Saving settings...");
    var inputs = document.forms["settings"].getElementsByTagName("input");
    var settings = {};
    for (i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var settingValue = input.value;
        if (input.type == "checkbox") {
            settingValue = input.checked;
        }
        settings[input.name] = settingValue;
    }
    localStorage.setItem("settings", JSON.stringify(settings));
}