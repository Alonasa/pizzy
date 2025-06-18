import showPopup from "./popup.js";
import { validatePasswordMatch, validatePasswordLength } from "./validators.js";

const resetPasswordForm = document.querySelector("#reset-password-form");
const passwordField = resetPasswordForm.querySelector("#password");
const confirmPasswordField = resetPasswordForm.querySelector("#confirm-password");
const submitButton = resetPasswordForm.querySelector("button[type=submit]");

// Get token from hidden input or URL
const getToken = () => {
    // Check if there's a hidden input with the token
    const tokenInput = document.querySelector('input[name="token"]');
    if (tokenInput) {
        return tokenInput.value;
    }

    // If no hidden input, try to get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("token")) {
        return urlParams.get("token");
    }

    return null;
};

const setupPasswordValidation = () => {
    confirmPasswordField.addEventListener("input", () => {
        if (!validatePasswordMatch(passwordField.value, confirmPasswordField.value)) {
            confirmPasswordField.classList.add("is-invalid");
            submitButton.disabled = true;
        } else {
            confirmPasswordField.classList.remove("is-invalid");
            if (validatePasswordLength(passwordField.value)) {
                submitButton.disabled = false;
            }
        }
    });

    passwordField.addEventListener("input", () => {
        if (confirmPasswordField.value && !validatePasswordMatch(passwordField.value, confirmPasswordField.value)) {
            confirmPasswordField.classList.add("is-invalid");
            submitButton.disabled = true;
        } else if (confirmPasswordField.value) {
            confirmPasswordField.classList.remove("is-invalid");
            if (validatePasswordLength(passwordField.value)) {
                submitButton.disabled = false;
            }
        }

        if (!validatePasswordLength(passwordField.value)) {
            passwordField.classList.add("is-invalid");
            submitButton.disabled = true;
        } else {
            passwordField.classList.remove("is-invalid");
            if (!confirmPasswordField.value || validatePasswordMatch(passwordField.value, confirmPasswordField.value)) {
                submitButton.disabled = false;
            }
        }
    });
};

const resetPassword = () => {
    submitButton.disabled = true;

    resetPasswordForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Validate password length and match
        if (!validatePasswordLength(passwordField.value)) {
            showPopup("Password must be at least 5 characters long", "error");
            return;
        }

        if (!validatePasswordMatch(passwordField.value, confirmPasswordField.value)) {
            showPopup("Passwords do not match", "error");
            return;
        }

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Add token to data if not already in form
        if (!data.token) {
            data.token = getToken();
        }

        if (!data.token) {
            showPopup("Missing reset token", "error");
            return;
        }

        const response = await fetch("/restore-password/reset", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            if (error.errors) {
                error.errors.forEach(err => {
                    showPopup(err.msg, "error");
                    const field = document.getElementById(err.path);
                    if (field) {
                        field.classList.add("is-invalid");
                    }
                });
            } else {
                showPopup(error.message || "An error occurred", "error");
            }
        } else {
            const result = await response.json();
            showPopup("Password updated successfully", "success");
            showPopup(result.message, "success");

            // Disable form after successful submission
            passwordField.disabled = true;
            confirmPasswordField.disabled = true;
            submitButton.disabled = true;

            // Redirect if server provides a redirect URL
            if (result.redirect) {
                setTimeout(() => {
                    window.location.href = result.redirect;
                }, 2000); // Redirect after 2 seconds to allow user to see success message
            }
        }
    });
};

export { resetPassword, setupPasswordValidation };
