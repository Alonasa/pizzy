const form = document.querySelector("form");
const toggleIcons = form.querySelectorAll(".eye-icon");

const togglePasswordVisibility = (eyeIcon) => {
    const inputField = eyeIcon.closest(".form-label").querySelector("input");
    inputField.type = inputField.type === "password" ? "text" : "password";
    eyeIcon.classList.toggle("bi-eye");
    eyeIcon.classList.toggle("bi-eye-slash");
};

const changePasswordVisibility = () => {
    toggleIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            togglePasswordVisibility(icon);
        });
    });
};


export {changePasswordVisibility};
