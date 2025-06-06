const showHidePassword = () => {
    const toggleIcon = document.querySelectorAll(".bi-eye");

    toggleIcon.forEach(el => {
        el.addEventListener("click", () => {
            el.classList.toggle("bi-eye");
            const passwordField = el.closest(".form-label").querySelector('input[type=\"password\"]');

            if (el.classList.contains("bi-eye") && el.classList.contains("bi-eye-slash")) {
                passwordField.type = "password";
            } else if (!el.classList.contains("bi-eye") && el.classList.contains("bi-eye-slash")){
                passwordField.type = "text";
            }
            passwordField.addEventListener("blur", () => {
                    passwordField.type = "password";
                    el.classList.toggle("bi-eye");
                },
                {once: true}
            );
        });
    });
};

export default showHidePassword;