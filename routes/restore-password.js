const express = require("express");//Import express
const router = express.Router(); //Created router instance and save it to variable
const {sendEmail} = require("../helpers/mailer/mailer");


router.get("/", (req, res) => {
    res.render("restore-password", {
        title: "Login to Order your hot pizza",
        layout: "layout",
        formId: "restore-password",
        formAction: "/restore-password",
        formMethod: "POST",
        formTitle: "Restore password",
        formMessage: "Enter your email address and we will send you a link to reset your password.",
        formFieldsConfig: {
            showEmail: true,
            showFullName: false,
            showPhone: false,
            showAddress: false,
            showPassword: false,
            showConfirmPassword: false
        }
    });
});

router.post("/", (req, res) => {
    console.log("HELLO");
    const https = require("https");

    // Disable SSL validation globally (not recommended for production)
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    https.get(`https://m.pizzy.alonassko.com`, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
    }).on("error", (err) => {
        console.error("Error:", err.message);
    });
    console.log(req.body.email)

    sendEmail(req.body.email, "Restore your password",
        `You made request to restore your password for email: ${req.body.email}`).then(r => {
        console.log(r);
    });
});

module.exports = router;