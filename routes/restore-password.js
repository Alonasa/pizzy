const express = require("express");//Import express
const router = express.Router(); //Created router instance and save it to variable
const {sendEmail} = require("../helpers/mailer/mailer");


router.get("/", (req, res) => {
    res.render("form-wrapper", {
        formId: "restore-password",
        formAction: "/restore-password",
        formMethod: "POST",
        formTitle: "Restore password",
        formMessage: "Enter your email address and we will send you a link to reset your password.",
        formFieldsConfig: {showEmail: true}
    });
});

router.post("/", (req, res) => {
    console.log("HELLO");
    sendEmail(req.body.email, "Restore your password", `You made request to restore your password for email: ${req.body.email}`);
});

module.exports = router;