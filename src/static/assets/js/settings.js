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
    settingsToLS(settings);
}

function updateSettingsInputs(settings) {
    for (i = 0; i < Object.keys(settings).length; i++) {
        var settingName = Object.keys(settings)[i];
        var settingValue = settings[settingName];
        try {
            if (typeof settingValue == "boolean") {
                $(settingName).checked = settingValue;
            } else {
                $(settingName).value = settingValue;
            }
        } catch { }
    }
}

updateSettingsInputs(settings);