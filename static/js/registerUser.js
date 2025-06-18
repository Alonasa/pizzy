import showPopup from "./popup.js";

const fetchRegister = () => {
    document.getElementById("registerForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        const response = await fetch("/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errors = await response.json();
            errors.errors.forEach(err => {
                showPopup(err.msg, "error");
                document.getElementById(err.path).classList.add("is-invalid");
            });
        } else {
            const result = await response.json();

            showPopup("User registered successfully", "success");
            showPopup(result.message, "success");
            if (result.redirect) {
                window.location.href = result.redirect;
            }
        }
    });
}

export  {fetchRegister};