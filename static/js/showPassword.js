const form = document.querySelector("form");
const toggleIcon = form.querySelectorAll(".eye-icon");
const passwordFields = form.querySelectorAll("#password, #password-confirm");


const iconsToggler = (el) => {
    const inputField = el.closest(".form-label").querySelector("input");
    el.classList.toggle("bi-eye");
    el.classList.contains("bi-eye") ? inputField.type = "password" : inputField.type = "text";
    el.classList.toggle("bi-eye-slash");
};

const changeVisibility = (evtType) => {
    passwordFields.forEach(el => {
        el.addEventListener(evtType, () => {
            if (el) {
                const eyeIcon = el.closest(".form-label").querySelector(".eye-icon");
                iconsToggler(eyeIcon);
            }
        });
    });
};

const showPassword = () => {
    toggleIcon.forEach(el => {
        el.addEventListener("click", () => {
            changeVisibility("focus");
        });
    });
};

const hidePassword = () => {
    changeVisibility("blur");
};

export {showPassword, hidePassword};