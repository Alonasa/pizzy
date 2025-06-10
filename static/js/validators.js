const validateEmail = (email) => {
    return email.toLowerCase().trim().match(/^\S+@\S+\.\S+$/);
};

export {validateEmail};