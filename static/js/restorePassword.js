import showPopup from "./popup.js";
import {validateEmail} from "./validators.js";

const restorePasswordForm = document.querySelector("#restore-password");
const emailField = restorePasswordForm.querySelector("#email");
const submitButton = restorePasswordForm.querySelector("button[type=submit]");
const lockedUntil = localStorage.getItem("lockedUntil") || null;

const convertMilliseconds = (ms) => {
    const remainingMinutes = (ms - Date.now()) / 1000;
    const totalMinutes = Math.floor(remainingMinutes / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {hours, minutes};
};

const enableSubmitButton = () => {
    if (lockedUntil === null || lockedUntil === "null") {
        emailField.addEventListener("change", () => {
            if (validateEmail(emailField.value)) {
                submitButton.disabled = false;
            }
        });
    }
};

const setEmailField = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("email")) {
        const passwordElement = document.querySelector("#email");
        passwordElement.value = urlParams.get("email");
        submitButton.disabled = false;
    }
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
            if (error.unlockDate > 0) {
                submitButton.disabled = true;
                let {hours, minutes} = convertMilliseconds(error.unlockDate);
                localStorage.setItem("lockedUntil", error.unlockDate);
                showPopup(`You reach attempts limit for today. Please come back in ${hours}:${minutes < 10 ? "0" + minutes : minutes}`, "error");
            } else {
                localStorage.setItem("lockedUntil", null);
                showPopup(error.message, "error");
            }
        } else {
            localStorage.setItem("lockedUntil", null);
            const result = await response.json();
            showPopup("Restore email are sent to your mailbox", "success");
            showPopup(result.message, "success");
            submitButton.disabled = true;
            emailField.value = "";
            window.location.href = result.redirect;
        }
    });
};

const restorePassword = () => {
    submitButton.disabled = true;
    setEmailField();
    enableSubmitButton();
};

const showLockout = () => {
    let {hours, minutes} = convertMilliseconds(Number(lockedUntil));
    if (minutes > 0) {
        const element = `<p class="remaining-time text-danger">Time to unblock: <span class="time-value">${hours}:${minutes}</span></p>`;
        return restorePasswordForm.insertAdjacentHTML("beforebegin", element);
    }
};

const rerenderTime = (lockedUntil) => {
    const timeValueField = document.querySelector(".time-value");
    let {hours, minutes} = convertMilliseconds(Number(lockedUntil));
    timeValueField.innerText = `${hours}:${minutes > 9 ? minutes : '0' + minutes}`;
};

const renderTimeField = () => {
    if (lockedUntil !== null || lockedUntil !== "null") {
        showLockout();

        setInterval(() => {
            rerenderTime(lockedUntil);
        },1000 * 60)
    }
}


export {restorePassword, restorePasswordFetch, renderTimeField};