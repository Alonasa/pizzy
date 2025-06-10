import showPopup from "./popup.js";
import {validateEmail} from "./validators.js";

const restorePasswordForm = document.querySelector("#restore-password");
const emailField = restorePasswordForm.querySelector("#email");
const submitButton = restorePasswordForm.querySelector("button[type=submit]");

const setEmailField = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("email")) {
        const passwordElement = document.querySelector("#email");
        passwordElement.value = urlParams.get("email");
    }
};
const enableSubmitButton = () => {
    emailField.addEventListener("change", () => {
        if (validateEmail(emailField.value)) {
            submitButton.disabled = false;
        }
    });
};

const restorePasswordFetch = () => {
    restorePasswordForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        const response = await fetch("/restore-password", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            if (error.invalidAttempts === 5) {
                submitButton.disabled = true;
                showPopup("You reach attempts limit for today. Please come back tomorrow", "error");
            } else {
                showPopup(error.message, "error");
            }
        } else {
            const result = await response.json();
            showPopup("Restore email are sent to your mailbox", "success");
            showPopup(result.message, "success");
            submitButton.disabled = true;
            emailField.value = "";
        }
    });
};

const restorePassword = () => {
    submitButton.disabled = true;
    setEmailField();
    enableSubmitButton();
};

export { restorePassword, restorePasswordFetch };