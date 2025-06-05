const showHidePassword = () => {
    const toggleIcon = document.querySelectorAll("#toggleIcon");

    toggleIcon.forEach(el => {
        el.addEventListener("click", () => {
            let pass = el.closest(".form-label").querySelector("input[type=\"password\"]");
            pass.type = "text";

            pass.addEventListener("blur", () => {
                    pass.type = "password";
                },
                {once: true}
            );
        });
    });
};

export default showHidePassword;