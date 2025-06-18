const validateEmail = (email) => {
    return email.toLowerCase().trim().match(/^\S+@\S+\.\S+$/);
};

const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
};

const validatePasswordLength = (password) => {
    return password.length >= 5;
};

export {validateEmail, validatePasswordMatch, validatePasswordLength};
