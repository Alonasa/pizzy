const express = require("express");//Import express
const router = express.Router(); //Created router instance and save it to variable
const {sendEmail} = require("../helpers/mailer/mailer");
const connection = require("../config/db");

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

let errorCount = 0;
router.post("/", (req, res) => {
    const email = req.body.email.trim();
    const query = `SELECT * FROM users WHERE email = ?`;
    connection.query(query, [email], (err) => {
        if (err && errorCount < 6) {
            errorCount = errorCount + 1;
            console.log(errorCount);
            return res.status(400).json({
                message: "We didn't find such email in our database, please check your email",
                invalidAttempts: errorCount
            });
        } else {
            const https = require("https");
            https.get(`https://${process.env["EMAIL_HOST "]}`, (res) => {
                console.log(`Status Code: ${res.statusCode}`);
            }).on("error", (err) => {
                console.log(`Error: ${err.message}`);
                return res.status(500).json({
                    message:
                        "Email service error, please try again later"
                });
            });

            sendEmail(email, "Restore your password",
                `You made request to restore your password for email: ${req.body.email}`).then(r => {
                return res.status(200).json({
                    message:
                        "We sent you details with restoring instructions. Please check your email!"
                });
            });
        }
    });
});

module.exports = router;