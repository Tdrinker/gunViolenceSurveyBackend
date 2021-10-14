function processConsentChecked() {
    let consentCheckbox = document.getElementById("consentCheck");
    let submitButton = document.getElementById("submitBtn");

    submitButton.disabled = !consentCheckbox.checked
}