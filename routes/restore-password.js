const express = require("express");//Import express
const router = express.Router(); //Created router instance and save it to variable
const {sendEmail} = require("../helpers/mailer/mailer");
const connection = require("../config/db");

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 60 * 60 * 1000 * 24; //1 day

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

let unlockDate = 0;
let failedAttempts = 0;


router.post("/", (req, res) => {
    // req.session.failedAttempts = 0
    // req.session.lockoutUntil=0

    const email = req.body.email.trim();

    const query = `SELECT * FROM customer WHERE email = ?`;

    if((unlockDate - Date.now()) > 0 && req.session.lockoutUntil !== null) {
        return res.status(400).json({
            message: `You can't restore password until ${unlockDate}`,
            unlockDate: unlockDate
        })
    }else{
        connection.query(query, [email], (err) => {
            console.log(err)
            if (err &&  failedAttempts <= MAX_FAILED_ATTEMPTS + 1) {
                if (failedAttempts < MAX_FAILED_ATTEMPTS) {
                    req.session.failedAttempts = (req.session.failedAttempts || 0) + 1;
                    failedAttempts = req.session.failedAttempts;
                    return res.status(400).json({
                        message: `We didn't find such email in our database, please check your email. Restore attempts left: ${MAX_FAILED_ATTEMPTS - req.session.failedAttempts}`,
                        invalidAttempts: req.session.failedAttempts,
                        unlockDate: unlockDate
                    });
                } else {
                    req.session.lockoutUntil = Date.now() + LOCKOUT_DURATION;
                    unlockDate = req.session.lockoutUntil;
                    console.log("ELSE LOCKOUT");
                    return res.status(400).json({
                        message: `You can't restore password until ${req.session.lockoutUntil}`,
                        unlockDate: unlockDate
                    });
                }
            } else {
                req.session.failedAttempts = 0;
                req.session.lockoutUntil = null;

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
                            "We sent you details with restoring instructions. Please check your email!",
                        redirect: "/"
                    });
                });
            }
        });
    }
});

module.exports = router;